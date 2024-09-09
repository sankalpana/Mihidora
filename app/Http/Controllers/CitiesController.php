<?php

namespace App\Http\Controllers;

use App\Models\Cities;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class CitiesController extends Controller
{
    /** All districts list - Frontend */
    public function index()
    {
        $cities = Cities::select('*')
            ->orderBy('name_en', 'asc')
            ->get();

        return response()->json([
            'status' => 200,
            'cities' => $cities,
        ]);
    }

    public function updateCityList()
    {
        
    }

    public function geocodeCity($city)
    {
        $cityName = $city;
        //$apiKey = config('services.google.maps_api_key');
        $apiKey = env('GOOGLE_MAP_API_KEY');
        $client = new Client();

        $response = $client->get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            [
                'query' => [
                    'address' => $cityName,
                    'key' => $apiKey,
                ],
            ]
        );

        $data = json_decode($response->getBody(), true);

        if (
            $data['status'] === 'OK' &&
            isset($data['results'][0]['geometry']['location'])
        ) {
            $location = $data['results'][0]['geometry']['location'];
            $latitude = $location['lat'];
            $longitude = $location['lng'];

            return [
                'latitude' => $latitude,
                'longitude' => $longitude,
            ];
            return response()->json([
                'status' => 200,
                'cords' => [
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                ],
            ]);
        } else {
            // Handle the error (e.g., city not found)
            // return null;
            return response()->json([
                'status' => 200,
                'cords' => [],
            ]);
        }
    }
}
