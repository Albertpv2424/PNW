<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\User;

class ChatController extends Controller
{
    // Método para obtener el admin predeterminado
    private function getDefaultAdmin()
    {
        // Buscar el primer usuario con rol de admin
        $admin = User::where('tipus_acc', 'Admin')->first();

        // Si no hay admin, usar 'admin' como valor predeterminado
        return $admin ? $admin->nick : 'admin';
    }

    // Iniciar una sesión de chat
    public function startSession(Request $request)
    {
        try {
            // Obtener usuario autenticado
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Obtener el admin predeterminado
            $defaultAdmin = $this->getDefaultAdmin();

            // Crear nueva sesión
            $session = new ChatSession();
            $session->session_id = Str::uuid()->toString();
            $session->user_id = $user->nick;
            $session->admin_id = $defaultAdmin;
            $session->active = true;
            $session->save();

            Log::info('Chat session created', ['session_id' => $session->session_id, 'user' => $user->nick]);

            // Si hay un mensaje inicial, guardarlo
            if ($request->has('message') && !empty($request->message)) {
                $message = new ChatMessage();
                $message->user_id = $user->nick;
                $message->message = $request->message;
                $message->is_admin = false;
                $message->read = false;
                $message->chat_session_id = $session->session_id;

                $saved = $message->save();

                if (!$saved) {
                    Log::error('Failed to save initial message', [
                        'session_id' => $session->session_id,
                        'message' => $request->message
                    ]);
                } else {
                    Log::info('Initial message saved', ['message_id' => $message->id]);

                    // Actualizar la sesión con el último mensaje
                    $session->last_message = $request->message;
                    $session->last_message_time = now();
                    $session->save();
                }
            }

            return response()->json([
                'session_id' => $session->session_id
            ]);

        } catch (\Exception $e) {
            Log::error('Error al iniciar sesión de chat: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json(['error' => 'Error al iniciar sesión de chat: ' . $e->getMessage()], 500);
        }
    }

    // Enviar un mensaje
    // Replace the problematic section (around line 130-160) with this clean implementation:
    public function sendMessage(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Validar datos
            $request->validate([
                'message' => 'required|string',
                'session_id' => 'required|string',
                'is_admin' => 'boolean'
            ]);

            // Log the request for debugging
            Log::info('Message request received', [
                'user' => $user->nick,
                'session_id' => $request->session_id,
                'is_admin' => $request->is_admin ?? false,
                'message_length' => strlen($request->message),
                'user_tipus_acc' => $user->tipus_acc
            ]);

            // Verificar que la sesión existe
            $session = ChatSession::where('session_id', $request->session_id)->first();

            if (!$session) {
                Log::error('Session not found', ['session_id' => $request->session_id]);
                return response()->json(['error' => 'Sesión no encontrada'], 404);
            }

            // 2. Now, let's update the ChatController to better handle the is_admin parameter
            // In the sendMessage method, update the isAdmin check:
            // Determinar si es un mensaje de admin
            $isAdmin = $request->has('is_admin') ? (bool)$request->is_admin : false;

            // Si es admin, verificar permisos
            if ($isAdmin) {
                // Check if user is admin with case-insensitive comparison
                $userType = strtolower($user->tipus_acc);
                if ($userType !== 'admin' && $userType !== 'administrador') {
                    Log::error('Unauthorized admin message attempt', [
                        'user' => $user->nick,
                        'tipus_acc' => $user->tipus_acc,
                        'session_id' => $request->session_id
                    ]);
                    return response()->json(['error' => 'No tienes permisos para enviar mensajes como admin'], 403);
                }

                // Update the session's admin_id if it's not set
                if (empty($session->admin_id)) {
                    $session->admin_id = $user->nick;
                    $session->save();
                }
            } else {
                // For regular users, verify they are the session owner
                if ($session->user_id !== $user->nick) {
                    Log::error('Unauthorized message attempt to another user\'s session', [
                        'user' => $user->nick,
                        'session_user_id' => $session->user_id,
                        'session_id' => $request->session_id
                    ]);
                    return response()->json(['error' => 'No puedes enviar mensajes en esta sesión'], 403);
                }
            }

            // Create and save the message
            $message = new ChatMessage();
            $message->user_id = $isAdmin ? $user->nick : $session->user_id;
            $message->message = $request->message;
            $message->is_admin = $isAdmin;
            $message->read = false;
            $message->chat_session_id = $session->session_id;

            // Log before saving
            Log::info('Attempting to save message', [
                'message' => $message->toArray(),
                'session_id' => $session->session_id
            ]);

            $saved = $message->save();

            if (!$saved) {
                Log::error('Failed to save message', ['message' => $message->toArray()]);
                return response()->json(['error' => 'Error al guardar el mensaje'], 500);
            }

            // Actualizar la sesión
            $session->last_message = $request->message;
            $session->last_message_time = now();
            $session->save();

            Log::info('Message saved successfully', [
                'message_id' => $message->id,
                'session_id' => $session->session_id
            ]);

            return response()->json($message);

        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request' => $request->all()
            ]);

            return response()->json(['error' => 'Error al enviar mensaje: ' . $e->getMessage()], 500);
        }
    }

    // Obtener mensajes de una sesión
    // En el método getMessages (alrededor de la línea 230)
    public function getMessages($sessionId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Verificar que la sesión existe
            $session = ChatSession::where('session_id', $sessionId)->first();

            if (!$session) {
                Log::error('Sesión no encontrada', ['session_id' => $sessionId, 'user' => $user->nick]);
                return response()->json(['error' => 'Sesión no encontrada'], 404);
            }

            // Añadir logs para depuración
            Log::info('Verificando permisos para ver mensajes', [
                'user_nick' => $user->nick,
                'session_user_id' => $session->user_id,
                'user_tipus_acc' => $user->tipus_acc
            ]);

            // Verificar permisos (solo el usuario de la sesión o un admin pueden ver los mensajes)
            $isAdmin = strtolower($user->tipus_acc) === 'admin' || strtolower($user->tipus_acc) === 'administrador';

            // IMPORTANTE: Permitir acceso si el usuario es admin o es el propietario de la sesión
            if (!$isAdmin && $session->user_id !== $user->nick) {
                Log::warning('Acceso denegado a mensajes', [
                    'user' => $user->nick,
                    'session_user' => $session->user_id,
                    'session_id' => $sessionId
                ]);
                return response()->json(['error' => 'No tienes permisos para ver estos mensajes'], 403);
            }

            // Obtener mensajes
            $messages = ChatMessage::where('chat_session_id', $sessionId)
                ->orderBy('created_at', 'asc')
                ->get();

            Log::info('Mensajes obtenidos correctamente', [
                'session_id' => $sessionId,
                'count' => count($messages)
            ]);

            return response()->json($messages);

        } catch (\Exception $e) {
            Log::error('Error al obtener mensajes: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json(['error' => 'Error al obtener mensajes: ' . $e->getMessage()], 500);
        }
    }

    // Marcar mensajes como leídos
    public function markAsRead($sessionId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Verificar que la sesión existe
            $session = ChatSession::where('session_id', $sessionId)->first();

            if (!$session) {
                return response()->json(['error' => 'Sesión no encontrada'], 404);
            }

            // Determinar qué mensajes marcar como leídos
            $isAdmin = strtolower($user->tipus_acc) === 'admin';

            // Si es admin, marcar los mensajes del usuario como leídos
            // Si es usuario, marcar los mensajes del admin como leídos
            ChatMessage::where('chat_session_id', $sessionId)
                ->where('is_admin', !$isAdmin)  // Mensajes opuestos al rol del usuario
                ->where('read', false)
                ->update(['read' => true]);

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Error al marcar mensajes como leídos: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Error al marcar mensajes como leídos'], 500);
        }
    }

    // Obtener sesiones activas (solo para admins)
    // In the getActiveSessions method (around line 280-320)
    public function getActiveSessions()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Verificar si es admin
            $isAdmin = strtolower($user->tipus_acc) === 'admin' || strtolower($user->tipus_acc) === 'administrador';

            if (!$isAdmin) {
                return response()->json(['error' => 'No tienes permisos para ver las sesiones'], 403);
            }

            // Get all active sessions
            $sessions = ChatSession::where('active', true)
                ->orderBy('last_message_time', 'desc')
                ->get();

            // Add user information and unread count to each session
            foreach ($sessions as $session) {
                // Get user information
                $sessionUser = User::where('nick', $session->user_id)->first();
                if ($sessionUser) {
                    $session->user_name = $sessionUser->nick;
                    $session->user_email = $sessionUser->email;
                }

                // Count unread messages (messages from user that admin hasn't read)
                $unreadCount = ChatMessage::where('chat_session_id', $session->session_id)
                    ->where('is_admin', false)
                    ->where('read', false)
                    ->count();

                $session->unread_count = $unreadCount;

                // Get last message preview
                $lastMessage = ChatMessage::where('chat_session_id', $session->session_id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($lastMessage) {
                    $session->last_message_preview = substr($lastMessage->message, 0, 50);
                }
            }

            Log::info('Active sessions retrieved', [
                'count' => count($sessions),
                'admin' => $user->nick
            ]);

            return response()->json($sessions);
        } catch (\Exception $e) {
            Log::error('Error getting active sessions: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Error al obtener sesiones activas'], 500);
        }
    }
}