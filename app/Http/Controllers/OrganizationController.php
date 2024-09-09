<?php

namespace App\Http\Controllers;
use App\Models\Cities;
use App\Models\Districts;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Organizations;
use App\Models\OrganizationType;
use App\Models\OrganizationUser;
use App\Models\Projects;
use App\Models\WhatsOn;
use App\Models\DataEducation;
use App\Models\Classifieds;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrganizationController extends Controller
{
    /** All organization list - Frontend */
    public function index()
    {
        $organizations = Organizations::where('id', '>', 1)
            ->orderBy('id', 'desc')
            ->get();
        return response()->json([
            'status' => 200,
            'organizations' => $organizations,
        ]);
    }

    /**
     * Get a list of organizations order by name
     */
    public function getOrganizationList()
    {
        $organizations = Organizations::orderBy('org_name', 'asc')->get();
        return response()->json([
            'status' => 200,
            'organizations' => $organizations,
        ]);
    }

    public function filterOrganizations(Request $body)
    {
        $district_id = $body->input('district');
        $tag_names = $body->input('tags');
        $organizations = Organizations::where('id', '>', 1)
            ->orderBy('id', 'desc')
            ->get();
        $tags = [];
        foreach ($organizations as $organization) {
            $tag = $organization->tags->pluck('name', 'type', 'id');
            array_push($tags, $tag);
        }

        $filteredOrganizations = $organizations->filter(function (
            $organization
        ) use ($district_id) {
            if (
                $district_id != null &&
                $organization->district_id != $district_id
            ) {
                return false;
            }
            return true;
        });

        $filteredOrganizations = $filteredOrganizations->filter(function (
            $organization
        ) use ($tag_names) {
            if ($tag_names != null) {
                $organizationTags = $organization->tags
                    ->pluck('name')
                    ->toArray();
                if (
                    count(array_intersect($organizationTags, $tag_names)) == 0
                ) {
                    return false;
                }
            }
            return true;
        });

        $ProjectDistricts = [];
        foreach ($filteredOrganizations as $job) {
            $ProjectDistrict = Districts::select('name_en')
                ->where('id', $job->district_id)
                ->first();
            array_push($ProjectDistricts, $ProjectDistrict);
        }

        return response()->json([
            'status' => 200,
            'filteredOrganizations' => $filteredOrganizations,
            'locations' => $ProjectDistricts,
        ]);
    }

    /** All organization list - Frontend */
    public function organizationMap()
    {
        $organizationMap = DB::table('organizations')
            ->select('locations', 'org_name')
            //->where('locations','!=', [])
            ->get();
        return response()->json([
            'status' => 200,
            'organization_map' => $organizationMap,
        ]);
    }

    /** Organization single page - Frontend */
    public function show($slug)
    {
        $organization = Organizations::where('slug', $slug)->first();
        $organizationCity = Cities::select('name_en')
            ->where('id', $organization->city_id)
            ->first();
        $organizationDistrict = Cities::select('name_en')
            ->where('id', $organization->district_id)
            ->first();

        if ($organizationCity == null) {
            $city = 1;
        } else {
            $city = $organizationCity;
        }
        if ($organizationDistrict == null) {
            $district = 1;
        } else {
            $district = $organizationDistrict;
        }

        $tags = $organization->tags->pluck('name');
        $orgType = OrganizationType::select('type')
            ->where('id', $organization->org_type)
            ->first();
        $organization['type'] = $orgType->type;
        if ($organization) {
            return response()->json([
                'status' => 200,
                'get_data' => $organization,
                'tags' => $tags,
                'organization_city' => $city,
                'organization_district' => $district,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Organisation ID found.!',
            ]);
        }
    }

    /** Organization function */
    public function getUserOrganisations($slug)
    {
        if (Auth::user()) {
            $user_id = Auth::user()->id;
            $org_id = DB::table('organizations')
                ->select('id')
                ->where('slug', $slug)
                ->first();

            if ($user_id) {
                $organizations = Organizations::with([
                    'organizationUser' => function ($query) use ($user_id) {
                        $query->where('user_id', $user_id);
                    },
                ])
                    //->where('id','>',1)
                    ->where('id', $org_id->id)
                    ->first();
            }
        }
        return response()->json([
            'status' => 200,
            'organizations' => $organizations,
        ]);
    }

    public function getUserOrganisationsByUserId($user_id)
    {
        $organizationUser = DB::table('organization_users')
            ->select('*')
            ->where('user_id', $user_id)
            ->get();
        $organization = DB::table('organizations')
            ->select('*')
            ->where('id', $organizationUser[0]->organization_id)
            ->get();
        return response()->json([
            'status' => 200,
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $profileData = Organizations::where('id', '=', $id)->firstOrFail();
        $array1 = $profileData->tags->pluck('name');
        foreach ($array1 as $key => $arg) {
            $results[] = $arg;
        }
        if (isset($results)) {
            $tags = implode(',', $results);
        } else {
            $tags = null;
        }

        // Check if 'description' is a JSON or a plain string
        $description = $profileData['description'];
        $isJson = $this->isJson($description);

        // if (!$isJson) {
        //     // Convert plain string to JSON structure
        //     $profileData['description'] = $this->convertToJSON($description);
        // }

        if ($profileData) {
            return response()->json([
                'status' => 200,
                'get_data' => $profileData,
                'tags' => $tags,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No user ID found.!',
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $profile = Organizations::find($id);
        if ($profile) {
            $profile->org_name = $request->input('org_name');
            $profile->org_size = $request->input('org_size');
            $profile->reg_number = $request->input('reg_number');
            $profile->org_type = $request->input('org_type');
            $profile->description = $request->input('description');
            $profile->org_logo = json_encode($request->input('org_logo'));
            $profile->photos = json_encode($request->input('banner'));
            $profile->delete(); //deleting the tags and re adding

            $tagsThematic = $request->input('tags_thematic');
            $tagsSubject = $request->input('tags_subject');
            $tagsExtra = $request->input('tags_extra');
            // $profile->attachTags($tagsThematic, 1);
            // $profile->attachTags($tagsSubject, 2);
            // $profile->attachTags($tagsExtra, 3);

            // New tagging system
            $newTags = [];
            if ($request->has('level1')) {
                $newTags = [...$newTags, $request->input('level1')];
            }
            if ($request->has('level2')) {
                $newTags = [...$newTags, $request->input('level2')];
            }
            if ($request->has('level3')) {
                $newTags = [...$newTags, $request->input('level3')];
            }
            if ($request->has('level4')) {
                $newTags = [...$newTags, $request->input('level4')];
            }
            if ($request->has('other_tags_subject')) {
                $subjects = $request->input('other_tags_subject');
                $newTags = [...$newTags, ...$subjects];

                // $newTags[] = $newArray;
            }
            if ($request->has('other_tags_extra')) {
                $extras = $request->input('other_tags_extra');
                $newTags = [...$newTags, ...$extras];
            }
            $arrayWithoutNulls = array_values(
                array_filter($newTags, function ($value) {
                    return $value !== null;
                })
            );

            //$project->tags()->sync($arrayWithoutNulls);
            $profile->tags()->detach();

            foreach ($arrayWithoutNulls as $tag) {
                $profile->tags()->attach($tag);
            }

            $profile->save();
            return response()->json([
                'status' => 200,
                'message' => 'Profile updated successfully.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Profile update failed.',
            ]);
        }
    }

    public function updateContactData(Request $request, $id)
    {
        $profile = Organizations::find($id);
        if ($profile) {
            $profile->contact_number = $request->input('contact_number');
            $profile->contact_person = $request->input('contact_person');
            $profile->email = $request->input('email');
            $profile->website = $request->input('website');
            $profile->address = $request->input('address');
            $profile->social_media = json_encode(
                $request->input('social_media')
            );
            $profile->contact_nos_hod = $request->input('contact_nos_hod');
            $profile->contact_name_hod = $request->input('contact_name_hod');
            $profile->contact_designation_hod = $request->input(
                'contact_designation_hod'
            );
            $profile->contact_no_focalpoint = $request->input(
                'contact_no_focalpoint'
            );
            $profile->contact_nos_focalpoint = $request->input(
                'contact_nos_focalpoint'
            );
            $profile->contact_name_focalpoint = $request->input(
                'contact_name_focalpoint'
            );
            $profile->contact_designation_focalpoint = $request->input(
                'contact_designation_focalpoint'
            );
            $profile->contact_email_focalpoint = $request->input(
                'contact_email_focalpoint'
            );
            $profile->contact_linkedin_focalpoint = $request->input(
                'contact_linkedin_focalpoint'
            );
            $profile->save();
            return response()->json([
                'status' => 200,
                'message' => 'Contact data updated successfully.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Contact data update is failed.',
            ]);
        }
    }

    public function updateStaffProfile(Request $request, $id)
    {
        $profile = Organizations::find($id);
        if ($profile) {
            $profile->staffprofile_active_no = $request->input(
                'staffprofile_active_no'
            );
            $profile->staffprofile_percentage_paid_staff = $request->input(
                'staffprofile_percentage_paid_staff'
            );
            $profile->staffprofile_volunteers_no = $request->input(
                'staffprofile_volunteers_no'
            );
            $profile->primary_activities = $request->input(
                'primary_activities'
            );
            $profile->main_delivery_mode = $request->input(
                'main_delivery_mode'
            );
            $profile->existing_profiles = $request->input('existing_profiles');
            $profile->locations = $request->input('locations');
            $profile->save();
            return response()->json([
                'status' => 200,
                'message' => 'Staff data updated successfully.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Staff data update is failed.',
            ]);
        }
    }

    public function delete($id)
    {
        $post = Organizations::find($id);
        if ($post) {
            $post->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Record deleted',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No ID found.',
            ]);
        }
    }

    public function getInactiveOrganizations(Request $request)
    {
        $organizations = [];
        if ($request->has('take')) {
            $organizations = Organizations::where('status', 0)
                ->where('id', '<>', 1)
                ->skip($request->skip)
                ->take($request->take)
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->get();
            return response()->json([
                'status' => 200,
                'count' => count($organizations),
                'organizations' => $organizations,
            ]);
        }
        $organizations = Organizations::where('status', 0)
            ->orderByRaw('created_at DESC')
            ->where('id', '<>', 1)
            ->get();
        $organizations->load('tags');
        return response()->json([
            'status' => 200,
            'count' => count($organizations),
            'organizations' => $organizations,
        ]);
    }

    // return active organizations
    public function getOrganizations(Request $request)
    {
        $organizations = [];
        if ($request->has('take')) {
            $organizations = Organizations::where('status', 1)
                ->where('id', '<>', 1)
                ->skip($request->skip)
                ->take($request->take)
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->get();
            return response()->json([
                'status' => 200,
                'count' => count($organizations),
                'organizations' => $organizations,
            ]);
        }
        $organizations = Organizations::where('status', 1)
            ->orderByRaw('created_at DESC')
            ->where('id', '<>', 1)
            ->get();
        $organizations->load('tags');
        return response()->json([
            'status' => 200,
            'count' => count($organizations),
            'organizations' => $organizations,
        ]);
    }

    private function isJson($value)
    {
        // Attempt to decode the value
        $decodedValue = json_decode($value);
        // Check if json_decode was successful and if the result is an array or an object
        return json_last_error() === JSON_ERROR_NONE &&
            (is_array($decodedValue) || is_object($decodedValue));
    }

    private function convertToJSON($plainString)
    {
        // Convert plain string to JSON structure
        return json_encode([
            'root' => [
                'children' => [
                    [
                        'children' => [
                            [
                                'detail' => 0,
                                'format' => 0,
                                'mode' => 'normal',
                                'style' => '',
                                'text' => $plainString,
                                'type' => 'text',
                                'version' => 1,
                            ],
                        ],
                        'direction' => 'ltr',
                        'format' => '',
                        'indent' => 0,
                        'type' => 'paragraph',
                        'version' => 1,
                    ],
                ],
                'direction' => 'ltr',
                'format' => '',
                'indent' => 0,
                'type' => 'root',
                'version' => 1,
            ],
        ]);
    }

    public function getOrganizationsWithUsersInfo(Request $request)
    {
        $organizations = Organizations::join(
            'users',
            'organizations.user_id',
            '=',
            'users.id'
        )
            ->where([['users.status', '=', $request->status]])
            ->select(
                'organizations.id as org_id',
                'organizations.org_name as org_name',
                'organizations.user_id as user_id',
                'organizations.status as org_status',
                'users.id as u_id',
                'users.email as email',
                'users.status as user_status'
            )
            ->get();

        return response()->json([
            'count' => count($organizations),
            'organizations' => $organizations,
        ]);
    }

    public function matchOrgStatus(Request $request)
    {
        // Get organizations filtered by status
        $organizations = Organizations::where(
            'status',
            $request->status
        )->get();

        // Loop through organizations and update the status based on the corresponding user's status
        foreach ($organizations as $org) {
            $user = User::find($org->user_id);

            if ($user) {
                // Update organization status with user status
                $org->update(['status' => $user->status]);
            }
        }

        return response()->json([
            'message' => 'Organization statuses updated successfully',
            // 'orgList' => $organizations,
        ]);
    }

    public function getOrganizationsByType()
    {
        // Get all organization types
        $organizationTypes = OrganizationType::all();

        // Initialize an array to store the grouped results
        $groupedResults = [];

        // Loop through each organization type
        foreach ($organizationTypes as $type) {
            // Query organizations for the current type and order by org_name
            $organizations = Organizations::where('org_type', $type->id)
                ->where('status', 1)
                ->orderBy('org_name')
                ->where('id', '<>', 1)
                ->get();

            // Build the grouped result array
            $groupedResult = [
                'id' => $type->id,
                'type' => $type->type,
                'organizations' => $organizations,
            ];

            // Add the grouped result to the main array
            $groupedResults[] = $groupedResult;
        }

        // Return the grouped results as JSON
        // return response()->json($groupedResults);
        return response()->json([
            'status' => 200,
            'organizations' => $groupedResults,
        ]);
    }

    public function disableOrganizationProfile(Request $request)
    {
        // Create a validator for the request
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|integer',
        ]);

        // Check if the validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Retrieve the organization_id from the validated data
        $organization_id = $validator->validated()['organization_id'];

        try {
            // Start a transaction
            DB::beginTransaction();

            // Soft delete related records
            Projects::where('organization_id', $organization_id)->update([
                'deleted_at' => now(),
            ]);
            WhatsOn::where('organization_id', $organization_id)->update([
                'deleted_at' => now(),
            ]);
            DataEducation::where('organization_id', $organization_id)->update([
                'deleted_at' => now(),
            ]);
            Classifieds::where('organization_id', $organization_id)->update([
                'deleted_at' => now(),
            ]);

            // Update the Organization's status
            $organization = Organizations::find($organization_id);
            if (!$organization) {
                return response()->json(
                    ['error' => 'Organization not found'],
                    404
                );
            }
            $organization->status = 0;
            $organization->save();

            // Commit the transaction
            DB::commit();

            // Return a successful response
            return response()->json(
                ['success' => 'Models updated successfully'],
                200
            );
        } catch (\Exception $e) {
            // Rollback the transaction on any error
            DB::rollBack();
            return response()->json(
                [
                    'error' => 'Failed to update models',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getOrganizationReport()
    {
        // Join the tables
        $data = DB::table('organizations')
            ->join('users', 'organizations.user_id', '=', 'users.id')
            ->join('organization_types', 'organizations.org_type', '=', 'organization_types.id')
            ->where('organizations.status', '!=', 3)
            ->select(
                'organizations.*',
                'users.name as user_name',
                'users.email as user_email',
                'organization_types.type as organization_type'
            )
            ->get();

        // Convert data to array
        $dataArray = $data->map(function($item) {
            return (array) $item;
        })->toArray();

        // Check if data is correctly fetched
        if (empty($dataArray)) {
            return response()->json([
                'message' => 'No data found to export',
            ], 404);
        }

        // Create CSV file
        $filename = 'organizations_export_' . date('Y_m_d_H_i_s') . '.csv';
        $filepath = public_path($filename);

        $file = fopen($filepath, 'w');

        // Add headers
        if (count($dataArray) > 0) {
            fputcsv($file, array_keys($dataArray[0]));
        }

        // Add rows
        foreach ($dataArray as $row) {
            fputcsv($file, $row);
        }

        fclose($file);

        return response()->json([
            'message' => 'CSV file created successfully',
            'file' => $filename
        ], 200);
    }

    public function reActivateProfile(Request $request)
    {
        // Create a validator for the request
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|integer',
        ]);

        // Check if the validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Retrieve the organization_id from the validated data
        $organization_id = $validator->validated()['organization_id'];

        try {
            // Start a transaction
            DB::beginTransaction();

            // Soft delete related records
            Projects::where('organization_id', $organization_id)->update([
                'deleted_at' => null,
            ]);
            WhatsOn::where('organization_id', $organization_id)->update([
                'deleted_at' => null,
            ]);
            DataEducation::where('organization_id', $organization_id)->update([
                'deleted_at' => null,
            ]);
            Classifieds::where('organization_id', $organization_id)->update([
                'deleted_at' => null,
            ]);

            // Update the Organization's status
            $organization = Organizations::find($organization_id);
            if (!$organization) {
                return response()->json(
                    ['error' => 'Organization not found'],
                    404
                );
            }
            $organization->status = 1;
            $organization->save();

            // Commit the transaction
            DB::commit();

            // Return a successful response
            return response()->json(
                ['success' => 'Models updated successfully'],
                200
            );
        } catch (\Exception $e) {
            // Rollback the transaction on any error
            DB::rollBack();
            return response()->json(
                [
                    'error' => 'Failed to update models',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
