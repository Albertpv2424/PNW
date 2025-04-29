<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Premio;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PrizeController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        // Registrar cada solicitud para depuración
        Log::info('Admin PrizeController inicializado');
    }

    /**
     * Verificar si el usuario es administrador
     */
    private function isAdmin()
    {
        $user = Auth::user();
        Log::info('Verificando permisos de administrador para usuario: ', [
            'user' => $user ? $user->nick : 'No autenticado',
            'tipus_acc' => $user ? $user->tipus_acc : 'N/A'
        ]);

        // More flexible check for admin status
        if (!$user) {
            return false;
        }

        $userType = strtolower($user->tipus_acc);
        Log::info('User type (lowercase): ' . $userType);

        // Check for various admin type strings (case-insensitive)
        return in_array($userType, ['admin', 'administrador', 'administrator']);
    }

    /**
     * Display a listing of the prizes.
     */
    public function index()
    {
        if (!$this->isAdmin()) {
            Log::warning('Intento de acceso no autorizado a premios por usuario no administrador');
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prizes = Premio::all();
        return response()->json($prizes);
    }

    /**
     * Get a specific prize
     */
    public function show($id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        return response()->json($prize);
    }

    /**
     * Create a new prize
     */
    // Add this method to your PrizeController class

    /**
     * Debug the incoming request data
     */
    private function debugRequest(Request $request, $message = 'Request data')
    {
        $requestData = $request->all();
        $hasImage = $request->hasFile('image');

        // Log the request data
        Log::info($message, [
            'request_data' => $requestData,
            'has_image' => $hasImage,
            'content_type' => $request->header('Content-Type'),
            'request_headers' => $request->headers->all()
        ]);

        return $requestData;
    }

    // Then update your store method to use this:
    public function store(Request $request)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Debug the request
        $this->debugRequest($request, 'Prize creation request received with detailed info');

        // Log the incoming request for debugging
        Log::info('Prize creation request received', [
            'request_data' => $request->except('image'),
            'has_image' => $request->hasFile('image')
        ]);

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'cost' => 'required|numeric|min:1',
            'condicio' => 'required|numeric|min:1',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            Log::error('Prize validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $prize = new Premio();
            $prize->titol = $request->titol;
            $prize->descripcio = $request->descripcio;
            $prize->cost = $request->cost;
            $prize->condicio = $request->condicio;

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();

                // Ensure directory exists - FIXED: Changed from 'prizes' to 'premios'
                $uploadPath = public_path('uploads/premios');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                $image->move($uploadPath, $imageName);
                $prize->image = 'uploads/premios/' . $imageName; // FIXED: Changed from 'prizes' to 'premios'

                Log::info('Image uploaded successfully', [
                    'path' => $prize->image
                ]);
            } else {
                $prize->image = null;
                Log::info('No image provided for prize');
            }

            $prize->save();

            Log::info('Prize created successfully', [
                'prize_id' => $prize->id,
                'prize_title' => $prize->titol
            ]);

            return response()->json($prize, 201);
        } catch (\Exception $e) {
            Log::error('Error creating prize', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al crear el premio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a prize
     */
    public function update(Request $request, $id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'cost' => 'required|numeric|min:1',
            'condicio' => 'required|numeric|min:1',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prize->titol = $request->titol;
        $prize->descripcio = $request->descripcio;
        $prize->cost = $request->cost;
        $prize->condicio = $request->condicio;

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($prize->image && file_exists(public_path($prize->image))) {
                unlink(public_path($prize->image));
            }

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            // FIXED: Changed from 'prizes' to 'premios'
            $image->move(public_path('uploads/premios'), $imageName);
            $prize->image = 'uploads/premios/' . $imageName; // FIXED: Changed from 'prizes' to 'premios'
        }

        $prize->save();

        return response()->json($prize);
    }

    /**
     * Delete a prize
     */
    public function destroy($id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        // Delete image if exists
        if ($prize->image && file_exists(public_path($prize->image))) {
            unlink(public_path($prize->image));
        }

        $prize->delete();

        return response()->json(['message' => 'Premio eliminado correctamente']);
    }

    /**
     * Get all prize redemptions
     */
    public function getRedemptions()
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        try {
            // Log the start of the method for debugging
            Log::info('Starting getRedemptions method');

            // First, let's check if the tables exist and log their structure
            $tables = ['premis_usuaris', 'usuaris', 'premis'];
            foreach ($tables as $table) {
                if (!Schema::hasTable($table)) {
                    Log::error("Table {$table} does not exist");
                    return response()->json(['message' => "Error: La tabla {$table} no existe en la base de datos"], 500);
                }

                // Log the columns of each table
                $columns = Schema::getColumnListing($table);
                Log::info("Columns in {$table} table:", $columns);
            }

            // Check if 'usat' column exists in premis_usuaris table
            $hasUsatColumn = Schema::hasColumn('premis_usuaris', 'usat');
            Log::info("'usat' column exists in premis_usuaris table: " . ($hasUsatColumn ? 'Yes' : 'No'));

            // Build the query based on available columns
            $query = DB::table('premis_usuaris')
                ->select(
                    'premis_usuaris.id',
                    'premis_usuaris.usuari_nick',
                    'premis_usuaris.premi_id',
                    'premis_usuaris.data_reclamat'
                );

            // Add data_limit if it exists, otherwise use NOW()
            if (Schema::hasColumn('premis_usuaris', 'data_limit')) {
                $query->addSelect(DB::raw('premis_usuaris.data_limit'));
            } else {
                $query->addSelect(DB::raw('NOW() as data_limit'));
            }

            // Add usat if it exists, otherwise use 0
            if ($hasUsatColumn) {
                $query->addSelect('premis_usuaris.usat as usado'); // Map 'usat' to 'usado' for frontend compatibility
            } else {
                $query->addSelect(DB::raw('0 as usado'));
            }

            // Add remaining fields
            $query->addSelect(
                'usuaris.email',
                'premis.titol as premio_titulo',
                'premis.descripcio as premio_descripcion',
                'premis.cost'
            )
            ->join('usuaris', 'premis_usuaris.usuari_nick', '=', 'usuaris.nick')
            ->join('premis', 'premis_usuaris.premi_id', '=', 'premis.id')
            ->orderBy('premis_usuaris.data_reclamat', 'desc');

            $redemptions = $query->get();

            Log::info('Successfully retrieved redemptions', ['count' => count($redemptions)]);

            // Return the data with more details for debugging
            return response()->json([
                'success' => true,
                'count' => count($redemptions),
                'data' => $redemptions,
                'hasUsatColumn' => $hasUsatColumn
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener canjes de premios: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            // Return a more detailed error message
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener canjes de premios: ' . $e->getMessage(),
                'details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Verify a prize redemption
     */
    public function verifyRedemption(Request $request, $id)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        try {
            $request->validate([
                'verified' => 'required|boolean',
            ]);

            $redemption = DB::table('premis_usuaris')->where('id', $id)->first();

            if (!$redemption) {
                return response()->json(['message' => 'Canje de premio no encontrado'], 404);
            }

            // Check if 'usat' column exists
            $hasUsatColumn = Schema::hasColumn('premis_usuaris', 'usat');

            if (!$hasUsatColumn) {
                // If column doesn't exist, try to add it
                try {
                    Schema::table('premis_usuaris', function ($table) {
                        $table->boolean('usat')->default(0);
                    });
                    Log::info("Added 'usat' column to premis_usuaris table");
                    $hasUsatColumn = true;
                } catch (\Exception $e) {
                    Log::error("Failed to add 'usat' column: " . $e->getMessage());
                    return response()->json([
                        'message' => "No se puede verificar el premio porque la columna 'usat' no existe y no se pudo crear automáticamente. Por favor, contacte al administrador del sistema.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            // Update the redemption status if column exists
            if ($hasUsatColumn) {
                DB::table('premis_usuaris')
                    ->where('id', $id)
                    ->update([
                        'usat' => $request->verified
                    ]);

                return response()->json([
                    'message' => 'Estado del canje actualizado correctamente',
                    'verified' => $request->verified
                ]);
            } else {
                return response()->json([
                    'message' => "No se puede verificar el premio porque la columna 'usat' no existe",
                    'verified' => false
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error al verificar canje de premio: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al verificar canje de premio: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handlePrizeImage(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return null;
            }

            $image = $request->file('image');

            if (!$image->isValid()) {
                return null;
            }

            $fileName = 'prize_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $path = 'uploads/prizes';

            if (!file_exists(public_path($path))) {
                mkdir(public_path($path), 0755, true);
            }

            $image->move(public_path($path), $fileName);

            return $path . '/' . $fileName;
        } catch (\Exception $e) {
            Log::error('Error al procesar la imagen del premio: ' . $e->getMessage());
            return null;
        }
    }
}