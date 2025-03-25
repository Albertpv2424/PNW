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
                    $sports = $response->json();
                    
                    // Add custom sports if they don't exist in the API response
                    $customSports = [
                        [
                            'key' => 'tennis_atp_miami_open',
                            'group' => 'Tennis',
                            'title' => 'ATP Miami Open',
                            'description' => 'ATP Miami Open Tennis Tournament',
                            'active' => true,
                            'has_outrights' => false
                        ],
                        [
                            'key' => 'tennis_grand_slam_masters_1000',
                            'group' => 'Tennis',
                            'title' => 'Grand Slam & Masters 1000',
                            'description' => 'Tennis Grand Slam and Masters 1000 Tournaments',
                            'active' => true,
                            'has_outrights' => false
                        ],
                        [
                            'key' => 'baseball_mlb',
                            'group' => 'Baseball',
                            'title' => 'MLB',
                            'description' => 'Major League Baseball',
                            'active' => true,
                            'has_outrights' => false
                        ]
                    ];
                    
                    foreach ($customSports as $customSport) {
                        $exists = false;
                        foreach ($sports as $sport) {
                            if ($sport['key'] === $customSport['key']) {
                                $exists = true;
                                break;
                            }
                        }
                        
                        if (!$exists) {
                            $sports[] = $customSport;
                        }
                    }
                    
                    return $sports;
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
