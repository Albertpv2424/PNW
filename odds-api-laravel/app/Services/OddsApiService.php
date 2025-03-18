<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OddsApiService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.the-odds-api.com/v4';
    
    public function __construct()
    {
        $this->apiKey = env('ODDS_API_KEY');
    }
    
    public function getSports()
    {
        // Cache sports data for 1 hour to reduce API calls
        return Cache::remember('sports_data', 3600, function () {
            try {
                $response = Http::get("{$this->baseUrl}/sports", [
                    'api_key' => $this->apiKey
                ]);
                
                if ($response->successful()) {
                    return $response->json();
                } else {
                    Log::error('Error fetching sports data: ' . $response->body());
                    return [];
                }
            } catch (\Exception $e) {
                Log::error('Exception fetching sports data: ' . $e->getMessage());
                return [];
            }
        });
    }
    
    public function getOdds($sportKey)
    {
        // Cache odds data for 15 minutes
        return Cache::remember("odds_{$sportKey}", 900, function () use ($sportKey) {
            try {
                $response = Http::get("{$this->baseUrl}/sports/{$sportKey}/odds", [
                    'api_key' => $this->apiKey,
                    'regions' => 'eu',
                    'markets' => 'h2h'
                ]);
                
                if ($response->successful()) {
                    return $response->json();
                } else {
                    Log::error("Error fetching odds for {$sportKey}: " . $response->body());
                    return [];
                }
            } catch (\Exception $e) {
                Log::error("Exception fetching odds for {$sportKey}: " . $e->getMessage());
                return [];
            }
        });
    }
    public function getScores($sportKey)
{
    // Cache scores data for 5 minutes (scores change more frequently)
    return Cache::remember("scores_{$sportKey}", 300, function () use ($sportKey) {
        try {
            $response = Http::get("{$this->baseUrl}/sports/{$sportKey}/scores", [
                'api_key' => $this->apiKey,
                'daysFrom' => 1  // Get scores from the last day
            ]);
            
            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Error fetching scores for {$sportKey}: " . $response->body());
                return [];
            }
        } catch (\Exception $e) {
            Log::error("Exception fetching scores for {$sportKey}: " . $e->getMessage());
            return [];
        }
    });
}
}
