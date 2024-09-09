<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use Illuminate\Support\Facades\Validator;
use App\Enums\Topics;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    //

    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic' => ['required', 'in:' . implode(',', Topics::getValues())],
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $user_id = $request->user_id;
        $topic = $request->topic;

        $subscription = Subscription::where([
            ['user_id', '=', $user_id],
            ['topic', '=', $topic],
        ])->get();

        if (!$subscription->isEmpty()) {
            return response()->json([
                'status' => 400,
                'message' => 'Suscription already exists',
            ]);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found!',
            ]);
        }
        Subscription::create([
            'user_id' => $user_id,
            'topic' => $topic,
            'name' => $user->name,
            'email' => $user->email,
        ]);
        return response()->json([
            'status' => 200,
            'message' => 'Success!',
        ]);
    }

    public function subscribeToAllTopics(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
    
        $email = $request->email;
        $name = $request->name;
    
        $topics = Topics::getValues();
        $subscribedTopics = 0;
    
        foreach ($topics as $topic) {
            $existingSubscription = Subscription::where([
                ['email', '=', $email],
                ['topic', '=', $topic],
            ])->exists();
    
            if (!$existingSubscription) {
                Subscription::create([
                    'email' => $email,
                    'topic' => $topic,
                    'name' => $name,
                    'user_id' => 1, // A default user_id is added here, this is not required.
                ]);
                $subscribedTopics++;
            }
        }
    
        if ($subscribedTopics > 0) {
            return response()->json([
                'status' => 200,
                'message' => "Successfully subscribed to {$subscribedTopics} new topics.",
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'You are already subscribed to all topics.',
            ]);
        }
    }

    public function subscribePublic(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic' => ['required', 'in:' . implode(',', Topics::getValues())],
            'email' => 'required',
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $email = $request->email;
        $topic = $request->topic;
        $name = $request->name;

        $subscription = Subscription::where([
            ['email', '=', $email],
            ['topic', '=', $topic],
        ])->get();

        if (!$subscription->isEmpty()) {
            return response()->json([
                'status' => 400,
                'message' => 'You have already subscribed to this topic',
            ]);
        }

        Subscription::create([
            'email' => $email,
            'topic' => $topic,
            'name' => $name,
            'user_id' => 1,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Success!',
        ]);
    }

    public function unsubscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic' => ['required', 'in:' . implode(',', Topics::getValues())],
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        $user_id = $request->user_id;
        $topic = $request->topic;
        $subscription = Subscription::where([
            ['user_id', '=', $user_id],
            ['topic', '=', $topic],
        ])->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Success!',
        ]);
    }

    public function getSubscriptions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        $user_id = $request->user_id;
        $subscription = Subscription::where('user_id', $user_id)->get();
        $subscribed_topics = [];
        foreach ($subscription as $object) {
            $subscribed_topics[] = $object['topic'];
        }
        $topics = Topics::getValues(); //implode(',', Topics::getValues());
        $subscription_list = [];
        foreach ($topics as $topic) {
            if (in_array($topic, $subscribed_topics)) {
                $subscription_list[] = [
                    'topic' => $topic,
                    'subscribed' => true,
                ];
            } else {
                $subscription_list[] = [
                    'topic' => $topic,
                    'subscribed' => false,
                ];
            }
        }
        return response()->json([
            'status' => 200,
            'subscription' => $subscription_list,
        ]);
    }

    public function subscribeToEmail(Request $request)
    {
        // TODO: - Add API key here
        $client = new Client();

        $response = $client->post(
            'https://api.hubapi.com/contacts/v1/contact',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . 'api',
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'properties' => [
                        [
                            'property' => 'email',
                            'value' => $request->input('email'),
                        ],
                        // Add other contact properties as needed
                    ],
                ],
            ]
        );

        // Handle the response as needed (e.g., check for success or errors)
        return response()->json([
            'status' => 200,
            'response' => $response,
        ]);
    }
}
