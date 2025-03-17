<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OddsApiService;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    protected $oddsApiService;
    
    public function __construct()
    {
        $this->oddsApiService = new OddsApiService();
    }
    
    public function search(Request $request)
    {
        $query = $request->input('q');
        Log::info('Search query received: ' . $query);
        
        if (empty($query) || strlen($query) < 3) {
            return response()->json([
                'message' => 'La búsqueda debe tener al menos 3 caracteres',
                'results' => []
            ]);
        }
        
        try {
            // Get all sports
            $sports = $this->oddsApiService->getSports();
            $results = [];
            
            // For each sport, get odds and filter by search query
            foreach ($sports as $sport) {
                $sportKey = $sport['key'];
                try {
                    $odds = $this->oddsApiService->getOdds($sportKey);
                    
                    // Filter events that match the search query
                    foreach ($odds as $event) {
                        $homeTeam = $event['home_team'] ?? '';
                        $awayTeam = $event['away_team'] ?? '';
                        
                        // Case-insensitive search
                        if (stripos($homeTeam, $query) !== false || 
                            stripos($awayTeam, $query) !== false) {
                            
                            // Add sport information to the event
                            $event['sport_key'] = $sportKey;
                            $event['sport_title'] = $sport['title'];
                            $results[] = $event;
                            
                            // Limit to 10 results for performance
                            if (count($results) >= 10) {
                                break 2; // Break both loops
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // Log error but continue with other sports
                    Log::error("Error fetching odds for sport {$sportKey}: " . $e->getMessage());
                    continue;
                }
            }
            
            Log::info('Search results found: ' . count($results));
            return response()->json([
                'results' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Search error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error en la búsqueda',
                'results' => []
            ], 500);
        }
    }
}