<?php

namespace App\Http\Controllers;

use App\Services\OddsApiService;
use Illuminate\Http\Request;

class OddsController extends Controller
{
    protected $oddsApi;

    public function __construct(OddsApiService $oddsApi)
    {
        $this->oddsApi = $oddsApi;
    }

    public function index()
    {
        $sports = $this->oddsApi->getSports();
        return view('sports', compact('sports'));
    }

    public function show($sportKey)
    {
        $odds = $this->oddsApi->getOdds($sportKey);
        
        if (empty($odds)) {
            return redirect()->route('sports.index')->with('error', 'No hay odds disponibles para este deporte.');
        }

        return view('odds', compact('odds'));
    }
    public function getSportsJson()
{
    return response()->json($this->oddsApi->getSports());
}

    public function getOddsJson($sportKey)
    {
    return response()->json($this->oddsApi->getOdds($sportKey));
}

}
