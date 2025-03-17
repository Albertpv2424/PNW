<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OddsApiService
{
    protected $baseUrl = 'https://api.the-odds-api.com/v4/';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.odds_api.key');
    }

    public function getSports()
    {
        try {
            $response = Http::get("{$this->baseUrl}sports", [
                'apiKey' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('API Error: ' . $response->body());
            return [];

        } catch (\Exception $e) {
            Log::error('API Request Failed: ' . $e->getMessage());
            return [];
        }
    }
    public function getOdds($sportKey, $regions = 'us', $markets = 'h2h')
    {
        try {
            $response = Http::get("{$this->baseUrl}sports/{$sportKey}/odds", [
                'apiKey' => $this->apiKey,
                'regions' => $regions,
                'markets' => $markets,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // For debugging - log the raw data
                Log::info('Raw odds data: ' . json_encode(array_slice($data, 0, 2)));
                
                // Either remove the filtering completely
                return $data;
            }

            Log::error('API Error: ' . $response->body());
            return [];

        } catch (\Exception $e) {
            Log::error('API Request Failed: ' . $e->getMessage());
            return [];
        }
    }
}