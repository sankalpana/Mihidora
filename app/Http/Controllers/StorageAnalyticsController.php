<?php

namespace App\Http\Controllers;
use App\Models\Fileuploads;
use App\Models\User;
use App\Models\Organizations;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StorageAnalyticsController extends Controller
{
    //get storage used by users
    public function getUserCounts()
    {
        // Retrieve the fileuploads data
        $fileUploads = Fileuploads::all();
        // dd($fileUploads);
        // Calculate storage usage for each user
        $usersStorageUsage = [];
        foreach ($fileUploads as $fileUpload) {
            $fullPath = storage_path('app/public/' . $fileUpload->file_path);
            // $filePath = 'storage/app/public/' . $fileUpload->file_path; // Adjust the path as needed

            if (file_exists($fullPath)) {
                // $fileSize = Storage::disk('public')->size($filePath);
                $fileSize = filesize($fullPath);

                if (!isset($usersStorageUsage[$fileUpload->user_id])) {
                    $usersStorageUsage[$fileUpload->user_id] = 0;
                }

                $usersStorageUsage[$fileUpload->user_id] = (int) $fileSize;
            }
        }

        $path = Storage::disk('public');
        // dd($path);
        // Format the results as an array
        $resultArray = [];
        foreach ($usersStorageUsage as $userId => $totalStorage) {
            $resultArray[] = [
                'user_id' => $userId,
                'total_storage' => $totalStorage,
            ];
        }

        return response()->json([
            'status' => 200,
            'usage' => $resultArray,
        ]);
    }

    public function returnAllUserswithFiles()
    {
        // Retrieve the fileuploads data
        $fileUploads = Fileuploads::all();
        // Initialize storage usage for all user IDs
        $usersStorageUsage = [];
        foreach ($fileUploads as $fileUpload) {
            $usersStorageUsage[$fileUpload->user_id] = 0;
        }
        // Calculate storage usage for each user
        foreach ($fileUploads as $fileUpload) {
            // $filePath = 'doc/' . $fileUpload->file_path; // Adjust the path as needed
            $fullPath = storage_path('app/public/' . $fileUpload->file_path);

            if (file_exists($fullPath)) {
                // $fileSize = Storage::disk('public')->size($filePath);
                $fileSize = filesize($fullPath);

                $usersStorageUsage[$fileUpload->user_id] += $fileSize;
            }
        }
        // Format the results as an array
        $resultArray = [];
        foreach ($usersStorageUsage as $userId => $totalStorage) {
            $user = User::find($userId);
            if ($user) {
                // Convert storage from bytes to megabytes (MB)
                $totalStorageMB = round($totalStorage / (1024 * 1024), 2);

                $resultArray[] = [
                    'user_id' => $userId,
                    'name' => $user->name,
                    'email' => $user->email,
                    'total_storage_mb' => $totalStorageMB,
                ];
            }
        }
        // Sort the result array by storage in descending order
        usort($resultArray, function ($a, $b) {
            return $b['total_storage_mb'] - $a['total_storage_mb'];
        });
        return response()->json([
            'status' => 200,
            'usage' => $resultArray,
        ]);
    }

    /**
     * Return storage usage by all organizations
     */
    public function getStorageUsageByOrganization()
    {
        // Retrieve all organizations
        $organizations = Organizations::all();

        // Initialize storage usage for all organizations
        $organizationsStorageUsage = [];
        $glbalTotal = 0;
        foreach ($organizations as $organization) {
            // $users = $organization->users;
            $users = DB::table('organization_users')
                ->where('organization_id', $organization->id)
                ->get();
            $totalOrganizationStorage = 0;
            $usersStorage = [];

            foreach ($users as $user) {
                $userStorage = 0;
                $fileUploads = Fileuploads::where(
                    'user_id',
                    $user->user_id
                )->get();

                foreach ($fileUploads as $fileUpload) {
                    $filePath = storage_path(
                        'app/public/' . $fileUpload->file_path
                    );
                    if (file_exists($filePath)) {
                        $fileSize = filesize($filePath);
                        $userStorage += $fileSize / (1024 * 1024);
                        $totalOrganizationStorage += $fileSize / (1024 * 1024);
                        $glbalTotal += $fileSize / (1024 * 1024);
                    }
                }
                $userDetails = User::find($user->user_id);
                $usersStorage[] = [
                    'user_id' => $userDetails->id,
                    'name' => $userDetails->name,
                    'email' => $userDetails->email,
                    'total_storage_mb' => $userStorage,
                ];
            }

            $organizationsStorageUsage[] = [
                'organization_id' => $organization->id,
                'name' => $organization->org_name,
                'total_storage_mb' => $totalOrganizationStorage,
                'users' => $usersStorage,
            ];
        }

        // Sort the organizations by total storage in descending order
        usort($organizationsStorageUsage, function ($a, $b) {
            return $b['total_storage_mb'] - $a['total_storage_mb'];
        });

        return response()->json([
            'status' => 200,
            'total' => $glbalTotal,
            'usage_by_organization' => $organizationsStorageUsage,
        ]);
    }

    /**
     * Return the storage usage for a given organization
     */
    public function filterStorageByOrganization(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        //Retriew all organizational users;
        $users = DB::table('organization_users')
            ->where('organization_id', $request->organization_id)
            ->get();

        // Initialize storage usage for all organizations
        $organizationsStorageUsage = [];
        $glbalTotal = 0;
        foreach ($users as $user) {
            $userStorage = 0;
            $fileUploads = Fileuploads::where('user_id', $user->user_id)->get();

            foreach ($fileUploads as $fileUpload) {
                $filePath = storage_path(
                    'app/public/' . $fileUpload->file_path
                );
                if (file_exists($filePath)) {
                    $fileSize = filesize($filePath);
                    $userStorage += $fileSize / (1024 * 1024);
                    // $totalOrganizationStorage += $fileSize / (1024 * 1024);
                    $glbalTotal += $fileSize / (1024 * 1024);
                }
            }
            $userDetails = User::find($user->user_id);
            $usersStorage[] = [
                'user_id' => $userDetails->id,
                'name' => $userDetails->name,
                'email' => $userDetails->email,
                'total_storage_mb' => $userStorage,
            ];
        }
        // Sort the organizations by total storage in descending order
        usort($usersStorage, function ($a, $b) {
            return $b['total_storage_mb'] - $a['total_storage_mb'];
        });
        return response()->json([
            'status' => 200,
            'total' => $glbalTotal,
            'user_list' => $usersStorage,
        ]);
    }

    /**
     * Return and record storage usage by all organizations
     */
    public function recordStorageByOrganization()
    {
        // Retrieve all organizations
        $organizations = DB::table('organizations')->get();

        // Initialize storage usage for all organizations
        $organizationsStorageUsage = [];
        $globalTotal = 0;
        $lastMonth = Carbon::now()->subMonth();
        $year = $lastMonth->year;
        $month = $lastMonth->month;

        foreach ($organizations as $organization) {
            $users = DB::table('organization_users')
                ->where('organization_id', $organization->id)
                ->get();
            $totalOrganizationStorage = 0;
            $usersStorage = [];

            foreach ($users as $user) {
                $userStorage = 0;
                $fileUploads = DB::table('fileuploads')
                    ->where('user_id', $user->user_id)
                    ->get();

                foreach ($fileUploads as $fileUpload) {
                    $filePath = storage_path(
                        'app/public/' . $fileUpload->file_path
                    );
                    if (file_exists($filePath)) {
                        $fileSize = filesize($filePath);
                        $userStorage += $fileSize / (1024 * 1024);
                        $totalOrganizationStorage += $fileSize / (1024 * 1024);
                        $globalTotal += $fileSize / (1024 * 1024);
                    }
                }

                $userDetails = DB::table('users')
                    ->where('id', $user->user_id)
                    ->first();
                if ($userDetails) {
                    $usersStorage[] = [
                        'user_id' => $userDetails->id,
                        'name' => $userDetails->name,
                        'email' => $userDetails->email,
                        'total_storage_mb' => $userStorage,
                    ];
                }
            }

            // Record the storage usage to the database
            DB::table('organization_storage_consumptions')->updateOrInsert(
                [
                    'organization_id' => $organization->id,
                    'year' => $year,
                    'month' => $month,
                    'organization_name' => $organization->org_name,
                ],
                [
                    'storage_mb' => $totalOrganizationStorage,
                ]
            );

            $organizationsStorageUsage[] = [
                'organization_id' => $organization->id,
                'name' => $organization->org_name,
                'total_storage_mb' => $totalOrganizationStorage,
                'users' => $usersStorage,
            ];
        }

        // Sort the organizations by total storage in descending order
        usort($organizationsStorageUsage, function ($a, $b) {
            return $b['total_storage_mb'] - $a['total_storage_mb'];
        });

        return response()->json([
            'status' => 200,
            'total' => $globalTotal,
            'usage_by_organization' => $organizationsStorageUsage,
        ]);
    }

    /**
     * Return monthly data consumption for each organization for a given year.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMonthlyConsumptionByYear(Request $request)
    {
        $year = $request->input('year');

        // Fetch consumption records for the given year
        $consumptionRecords = DB::table('organization_storage_consumptions')
            ->where('year', $year)
            ->get();

        // Prepare results for all organizations
        $results = [];

        foreach ($consumptionRecords as $record) {
            // Check if organization is already in results
            if (!isset($results[$record->organization_id])) {
                $results[$record->organization_id] = [
                    'organization_id' => $record->organization_id,
                    'organization_name' => $record->organization_name,
                    'january' => 0,
                    'february' => 0,
                    'march' => 0,
                    'april' => 0,
                    'may' => 0,
                    'june' => 0,
                    'july' => 0,
                    'august' => 0,
                    'september' => 0,
                    'october' => 0,
                    'november' => 0,
                    'december' => 0,
                ];
            }

            // Convert month number to month name
            $monthName = strtolower(
                Carbon::createFromFormat(
                    'm',
                    str_pad($record->month, 2, '0', STR_PAD_LEFT)
                )->format('F')
            );
            // Assign the storage value to the correct month
            $results[$record->organization_id][$monthName] =
                (float) $record->storage_mb;
        }

        // Convert results to indexed array
        $finalResults = array_values($results);

        return response()->json($finalResults);
    }
}
