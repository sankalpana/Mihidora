<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projects;
use App\Models\DataEducation;
use App\Models\WhatsOn;
use App\Models\Classifieds;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Mail\Message;
use SendGrid\Mail\Mail;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    public function getNewletterItems()
    {
        // Query the latest topics
        $projects = $this->getProjects();
        $data = $this->getEducationData(1); // Data
        $elearning = $this->getEducationData(2); // E-Learning
        $events = $this->getWhatOn(1);
        $media_advocacy = $this->getWhatOn(2);
        $volunteer = $this->getWhatOn(3);
        $jobs = $this->getResources(1);
        $grants = $this->getResources(2);
        $supplies = $this->getResources(3);
        $resources = $this->getResources(4);

        //Get subscribers
        $subscribers = $this->getUserSubscriptions();
        $users = [];

        // return response()->json([
        //     'status' => 200,
        //     'topics' => $subscribers
        // ]);

        foreach ($subscribers as $subscriber) {
            $topics = [];
            $subscribedTopics = $subscriber['topics'];
            // Check if the user has subscribed to each topic and add it to $topics array
            if (in_array('projects', $subscribedTopics)) {
                if (count($projects['post']) > 0) {
                    $topics[] = $projects;
                }
            }
            if (in_array('data', $subscribedTopics)) {
                if (count($data['post']) > 0) {
                    $topics[] = $data;
                }
            }
            if (in_array('elearning', $subscribedTopics)) {
                if (count($elearning['post']) > 0) {
                    $topics[] = $elearning;
                }
                
            }
            if (in_array('events', $subscribedTopics)) {
                if (count($events['post']) > 0) {
                    $topics[] = $events;
                }
            }
            if (in_array('jobs', $subscribedTopics)) {
                if (count($jobs['post']) > 0) {
                    $topics[] = $jobs;
                }
            }
            if (in_array('grants', $subscribedTopics)) {
                if (count($grants['post']) > 0) {
                    $topics[] = $grants;
                }
            }
            if (in_array('suppliers', $subscribedTopics)) {
                if (count($supplies['post']) > 0) {
                    $topics[] = $supplies;
                }
            }
            if (in_array('resources', $subscribedTopics)) {
                if (count($resources['post']) > 0) {
                    $topics[] = $resources;
                }
            }
            if (in_array('volunteer', $subscribedTopics)) {
                if (count($volunteer['post']) > 0) {
                    $topics[] = $volunteer;
                }
            }
            if (in_array('media', $subscribedTopics)) {
                if (count($media_advocacy['post']) > 0) {
                    $topics[] = $media_advocacy;
                }
            }

            $emailParams = [
                'user' => $subscriber,
                'topic' => $topics,
            ];
            $users[] = $emailParams;
            // Send email here, only send if there are new topics
            if(count($topics) > 0){
                $this->sendEmailWithSendGrid($emailParams);
            }
        }
        return response()->json([
            'status' => 200,
            'topics' => $users,
        ]);
    }

    public function getProjects()
    {
        $sevenDaysAgo = Carbon::now()
            ->subDays(8)
            ->toDateString();
        // $projects = Projects::where('created_at', '>=', $sevenDaysAgo)
        $projects = Projects::select(
            'id',
            'project_title as title',
            'overview',
            'slug',
            'photos'
        )
            ->whereNull('deleted_at')
            ->where('created_at', '>=', $sevenDaysAgo)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
        $totalCount = Projects::where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->count();
        $transformedProjects = $projects->map(function ($project) {
            $project->project_url =
                'https://mihidora.lk/project/' . $project->slug;
            $photosArray = json_decode($project->photos, true);
            $project->image = 'https://mihidora.lk/images/project-default.jpg';
            if (!empty($photosArray)) {
                $firstPhoto = $photosArray[0];
                $firstPhoto = 'https://mihidora.lk/storage/' . $firstPhoto;
                $project->image = $firstPhoto;
            }
            return $project;
        });
        return [
            'remainig' => $totalCount - 3,
            'title' => 'Projects',
            'link' => 'https://mihidora.lk/projects',
            'post' => $transformedProjects,
        ];
    }

    public function getEducationData($type)
    {
        //TODO:- change the number of days to 7 after initial
        $sevenDaysAgo = Carbon::now()
            ->subDays(8)
            ->toDateString();
        $educationData = DataEducation::select(
            'id',
            'title',
            'slug',
            'overview',
            'photos'
        )
            ->where('type', $type)
            ->where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
        $totalCount = DataEducation::where('type', $type)
            ->where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->count();
        $transformedEducationData = $educationData->map(function (
            $education
        ) use ($type) {
            // Combine the URL using a unique identifier (e.g., ID)
            if ($type == 1) {
                $education->project_url =
                    'https://mihidora.lk/datahub/' . $education->slug;
            } else {
                $education->project_url =
                    'https://mihidora.lk/elearning-material/' .
                    $education->slug;
            }
            $photosArray = json_decode($education->photos, true);
            $education->image = 'https://mihidora.lk/images/project-default.jpg';
            if (!empty($photosArray)) {
                $firstPhoto = $photosArray[0];
                $firstPhoto = 'https://mihidora.lk/storage/' . $firstPhoto;
                $education->image = $firstPhoto;
            }
            return $education;
        });
        return [
            'remaining' => $totalCount - 3,
            'title' => $type == 1 ? 'Data' : 'E-Learning',
            'link' =>
                $type == 1
                    ? 'https://mihidora.lk/data'
                    : 'https://mihidora.lk/elearning-materials',
            'post' => $transformedEducationData,
        ];
    }

    public function getWhatOn($type)
    {
        $sectionTitle = '';
        $sectionLink = '';
        //TODO:- change the number of days to 7 after initial
        $sevenDaysAgo = Carbon::now()
            ->subDays(8)
            ->toDateString();
        $data = WhatsOn::select('id', 'title', 'slug', 'overview', 'photos')
            ->where('type', $type)
            ->where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
        $totalCount = WhatsOn::where('type', $type)
            ->where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->count();
        $transformedData = $data->map(function ($record) use (
            $type,
            $sectionTitle,
            $sectionLink
        ) {
            // Combine the URL using a unique identifier (e.g., ID)
            if ($type == 1) {
                // Events
                $record->project_url =
                    'https://mihidora.lk/whatson-event/' . $record->slug;
            } elseif ($type == 2) {
                // Media & Advocacy
                $record->project_url =
                    'https://mihidora.lk/whatson-volunteer-opportunity/' .
                    $record->slug;
            } else {
                // Volunteer Opportunities
                $record->project_url =
                    'https://mihidora.lk/whatson-media-and-advocacy/' .
                    $record->slug;
            }
            $photosArray = json_decode($record->photos, true);
            $record->image = 'https://mihidora.lk/images/project-default.jpg';
            if (!empty($photosArray)) {
                $firstPhoto = $photosArray[0];
                $firstPhoto = 'https://mihidora.lk/storage/' . $firstPhoto;
                $record->image = $firstPhoto;
            }
            return $record;
        });

        if ($type == 1) {
            $sectionTitle = 'Events';
            $sectionLink = 'https://mihidora.lk/whatson/events/';
        } elseif ($type == 2) {
            $sectionTitle = 'Media & Advocacy';
            $sectionLink = 'https://mihidora.lk/whatson/media-and-advocacy/';
        } else {
            $sectionTitle = 'Volunteer Opportunities';
            $sectionLink =
                'https://mihidora.lk/whatson/volunteer-opportunities/';
        }

        return [
            'remaining' => $totalCount - 3,
            'title' => $sectionTitle,
            'link' => $sectionLink,
            'post' => $transformedData,
        ];
    }

    public function getResources($type)
    {
        $sectionTitle = '';
        $sectionLink = '';
        //TODO:- change the number of days to 7 after initial
        $sevenDaysAgo = Carbon::now()
            ->subDays(8)
            ->toDateString();
        $data = Classifieds::select('id', 'title', 'slug', 'overview', 'photos')
            ->where('type', $type)
            ->whereNull('deleted_at')
            ->where('created_at', '>=', $sevenDaysAgo)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
        $totalCount = Classifieds::where('type', $type)
            ->where('created_at', '>=', $sevenDaysAgo)
            ->whereNull('deleted_at')
            ->count();
        $transformedData = $data->map(function ($record) use (
            $type,
            $sectionTitle,
            $sectionLink
        ) {
            // Combine the URL using a unique identifier (e.g., ID)
            if ($type == 1) {
                // Job Advert
                $record->project_url =
                    'https://mihidora.lk/resource-exchange-job/' . $record->slug;
            } elseif ($type == 2) {
                // Grants & RFPs
                $record->project_url =
                    'https://mihidora.lk/resource-exchange-proposal/' .
                    $record->slug;
            } elseif ($type == 3) {
                // Green / Sustainable Suppliers
                $record->project_url =
                    'https://mihidora.lk/resource-exchange-supplier/' .
                    $record->slug;
            } else {
                // Resource Pool
                $record->project_url =
                    'https://mihidora.lk/resource-exchange-resource-sharing/' .
                    $record->slug;
            }
            $photosArray = json_decode($record->photos, true);
            $record->image = 'https://mihidora.lk/images/project-default.jpg';
            if (!empty($photosArray)) {
                $firstPhoto = $photosArray[0];
                $firstPhoto = 'https://mihidora.lk/storage/' . $firstPhoto;
                $record->image = $firstPhoto;
            }
            return $record;
        });

        if ($type == 1) {
            $sectionTitle = 'Job Advert';
            $sectionLink = 'https://mihidora.lk/resource-exchange/jobs/';
        } elseif ($type == 2) {
            $sectionTitle = 'Grants & RFPs';
            $sectionLink =
                'https://mihidora.lk/resource-exchange/grants-and-proposals/';
        } elseif ($type == 3) {
            $sectionTitle = 'Green / Sustainable Suppliers';
            $sectionLink = 'https://mihidora.lk/resource-exchange/suppliers/';
        } else {
            $sectionTitle = 'Resource Pool';
            $sectionLink =
                'https://mihidora.lk/resource-exchange/resource-sharing/';
        }

        return [
            'remaining' => $totalCount - 3,
            'title' => $sectionTitle,
            'link' => $sectionLink,
            'post' => $transformedData,
        ];
    }

    public function getUserSubscriptions()
    {
        // Query subscriptions, group by user_id, and select necessary fields
        $subscriptions = Subscription::select(
            'user_id',
            'email',
            'topic',
            'name'
        )
            ->groupBy('email', 'topic', 'name', 'user_id')
            ->get();

        // return $subscriptions;
        // Structure the data for easy looping
        $userSubscriptions = [];

        foreach ($subscriptions as $subscription) {
            $userId = $subscription->user_id;
            $email = $subscription->email;
            $name = $subscription->name;
            $topic = $subscription->topic;

            // Create an array entry for the user if not already present
            if (!isset($userSubscriptions[$email])) {
                $userSubscriptions[$email] = [
                    'user_id' => $userId,
                    'email' => $email,
                    'name' => $name,
                    'topics' => [],
                ];
            }

            // Add the subscribed topic to the user's array
            $userSubscriptions[$email]['topics'][] = $topic;
        }

        // Convert the associative array to indexed array
        $userSubscriptions = array_values($userSubscriptions);

        return $userSubscriptions;
    }


    private function sendEmailWithSendGrid($emailParams)
    {
        $user = $emailParams['user'];
        $topics = $emailParams['topic'];
        $name = $user['name'];
        Log::info(json_encode($user));
        // Customize the SendGrid template ID
        $templateId = 'd-7ee6afe8cc56428b85766f34875acd39';

        // Use your SendGrid API key
        $apiKey = env('SENDGRID_API_KEY');

        // Create a JSON object with dynamic content
        $dynamicContent = [
                'user_name' => $name,
                'topic' => $topics,
        ];
        // Send email using SendGrid
        $email = new Mail();

        $email->setFrom('mihidorafeo@gmail.com', 'Mihidora');
        $email->setSubject('Mihidora Weekly Newsletter');
        $email->addTo($user['email'], $name );

        // Set the dynamic template ID
        $email->setTemplateId($templateId);

        // Set dynamic content as personalization data
        $email->addDynamicTemplateData('result', $dynamicContent);
        Log::info(json_encode($dynamicContent));
        // Use the SendGrid API key
        $sendgrid = new \SendGrid($apiKey);

        // Send the email
        try {
            $response = $sendgrid->send($email);
            Log::info($response->body());
            Log::info($response->headers());
            Log::info($response->statusCode());
            // Log::info('Newsletter Sent', [
            //     'response' => $response,
            //     'user' => $user,
            //     'content' => $topics,
            // ]);
            // Handle the response as needed
            // $response->statusCode()
            // $response->headers()
            // $response->body()
        } catch (\Exception $e) {
            // Handle exceptions
            // $e->getMessage()
            // Log:errror('Error occured for user: ', $user['email']);
            Log::error($e->getMessage());
        }
    }

    private function buildSendGridPayload($user, $topics, $templateId)
    {
        // Customize the payload based on your SendGrid template
        return json_encode([
            'personalizations' => [
                [
                    'to' => [['email' => $user['email']]],
                    'dynamic_template_data' => [
                        'user_name' => $user['name'], // Assuming you have a 'name' field in your user data
                        'topics' => $topics,
                        // Add other dynamic fields based on your SendGrid template
                    ],
                ],
            ],
            'from' => [
                'email' => 'charith@encyteus.com',
                'name' => 'Charith De Silva',
            ],
            'template_id' => $templateId,
        ]);
    }
}
