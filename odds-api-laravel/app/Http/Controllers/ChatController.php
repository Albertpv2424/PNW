<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Usuari;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function startSession(Request $request)
    {
        try {
            // Get authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            // Log detailed user information for debugging
            Log::info('Starting chat session', [
                'user_class' => get_class($user),
                'user_id' => $user->id ?? null,
                'user_nick' => $user->nick ?? null,
                'user_attributes' => $user->getAttributes()
            ]);
            
            // Create a new chat session
            $session = new ChatSession();
            $session->session_id = Str::uuid()->toString();
            
            // Determine the correct user identifier
            if (property_exists($user, 'nick') || isset($user->nick)) {
                $session->user_id = $user->nick;
            } else {
                // If nick is not available, use a fallback approach
                // This assumes your user model has an 'id' field
                $session->user_id = $user->id;
            }
            
            // Save the session
            $session->save();
            
            Log::info('Chat session started successfully', [
                'session_id' => $session->session_id,
                'user_id' => $session->user_id
            ]);
            
            return response()->json([
                'session_id' => $session->session_id
            ]);
        } catch (\Exception $e) {
            // Log detailed error information
            Log::error('Error starting chat session: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Error al iniciar la sesión de chat: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function getMessages($sessionId)
    {
        try {
            $messages = ChatMessage::where('chat_session_id', $sessionId)
                ->with(['user', 'admin'])
                ->orderBy('created_at', 'asc')
                ->get();
                
            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error al obtener mensajes: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string',
                'session_id' => 'required|string'
            ]);
            
            $user = Auth::user();
            
            // Log user information for debugging
            Log::info('User sending message', [
                'user_class' => get_class($user),
                'user_attributes' => $user->getAttributes()
            ]);
            
            $message = new ChatMessage();
            
            // Use nick instead of id for user_id
            if (property_exists($user, 'nick') || isset($user->nick)) {
                $message->user_id = $user->nick;
            } else {
                $message->user_id = (string) $user->id;
            }
            
            $message->message = $request->message;
            $message->chat_session_id = $request->session_id;
            $message->is_admin = $user->tipus_acc === 'Administrador';
            
            if ($message->is_admin) {
                $message->admin_id = $user->id;
            }
            
            $message->save();
            
            // Actualizar la sesión con la hora del último mensaje
            ChatSession::where('session_id', $request->session_id)
                ->update([
                    'last_message_time' => now(),
                    'last_message' => $request->message
                ]);
            
            // Cargar las relaciones para la respuesta
            $message->load(['user', 'admin']);
            
            return response()->json($message);
        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getActiveSessions()
    {
        try {
            // Get all unique session IDs
            $sessions = ChatSession::with(['user'])
                ->orderBy('updated_at', 'desc')
                ->get();
                
            // For each session, get the last message and unread count
            $sessionsData = $sessions->map(function ($session) {
                // Get the last message for this session
                $lastMessage = ChatMessage::where('chat_session_id', $session->session_id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                    
                // Count unread messages (messages from user that haven't been read by admin)
                $unreadCount = ChatMessage::where('chat_session_id', $session->session_id)
                    ->where('is_admin', false)
                    ->where('is_read', false)
                    ->count();
                    
                return [
                    'session_id' => $session->session_id,
                    'user' => $session->user,
                    'created_at' => $session->created_at,
                    'updated_at' => $session->updated_at,
                    'last_message' => $lastMessage ? $lastMessage->message : '',
                    'last_message_time' => $lastMessage ? $lastMessage->created_at : $session->created_at,
                    'unread_count' => $unreadCount
                ];
            });
            
            return response()->json($sessionsData);
        } catch (\Exception $e) {
            // Log the detailed error
            Log::error('Error getting active sessions: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'Error al obtener sesiones activas: ' . $e->getMessage()], 500);
        }
    }
    
    public function markAsRead($sessionId)
    {
        try {
            ChatMessage::where('chat_session_id', $sessionId)
                ->where('is_admin', false)
                ->update(['read' => true]);
                
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error al marcar mensajes como leídos: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}