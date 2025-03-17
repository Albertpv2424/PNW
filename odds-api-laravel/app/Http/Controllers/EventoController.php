// Look for any method that fetches odds and make sure it's using the correct API key
// For example:

public function getOdds($sportKey)
{
    $apiKey = config('services.odds_api.key');
    // or
    $apiKey = env('ODDS_API_KEY');
    
    // Make sure this is being used correctly in the API requests
}