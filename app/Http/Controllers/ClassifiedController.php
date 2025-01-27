<?php
namespace App\Http\Controllers;
use App\Models\Projects;
use App\Models\Districts;
use App\Models\Classifieds;
use App\Events\TopicCreated;
use Illuminate\Http\Request;
use App\Models\Organizations;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ClassifiedController extends Controller
{
    public function getAllClassified()
    {
        $classified = Classifieds::with('city')->get();
        return response()->json([
            'status' => 200,
            'results' => $classified,
        ]);
    }

    public function getClassified_V2(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'take' => 'required', //make the number of records required since there can be many posts
            'type' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $classified = Classifieds::where('type', $request->type)
            ->skip($request->skip)
            ->take($request->take)
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        return response()->json([
            'status' => 200,
            'count' => count($classified),
            'classified' => $classified,
        ]);
    }

    public function getOtherRsources(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'take' => 'required', //make the number of records required since there can be many posts
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $grants = Classifieds::where('type', 2)
            ->skip($request->skip)
            ->take($request->take)
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        $jobs = Classifieds::where('type', 1)
            ->skip($request->skip)
            ->take($request->take)
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        $suppliers = Classifieds::where('type', 3)
            ->skip($request->skip)
            ->take($request->take)
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        return response()->json([
            'status' => 200,
            'grants' => $grants,
            'jobs' => $jobs,
            'suppliers' => $suppliers,
        ]);
    }

    public function filterClassified(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'take' => 'required', //make the number of records required since there can be many posts
            'type' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        // Start building the query for the Classifieds model
        $query = Classifieds::query()->where('type', $request->input('type'));
        // If district_id is provided, add it to the query
        if ($request->has('district_id')) {
            $query->where('district_id', $request->input('district_id'));
        }

        $query->orderBy('created_at', 'desc');

        // Get the results
        $results = $query->get();
        // Load the 'district' relationship for each result
        $results->load('district');
        return response()->json([
            'status' => 200,
            'results' => $results,
        ]);
    }

    /** Classified single page - Frontend */
    public function show($slug)
    {
        $photoList = [];
        $projects = Projects::where('slug', $slug)->first();
        $tags = $projects->tags->pluck('name');
        // $photos = json_decode($projects['photos']);
        // foreach($photos as $photo) {
        //     $photo = Fileuploads::where('id', $photo)->first();
        //     array_push($photoList, $photo);
        // }
        if ($projects) {
            return response()->json([
                'status' => 200,
                'get_data' => $projects,
                'tags' => $tags,
                //'photoList' => $photoList,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No project ID found.!',
            ]);
        }
    }

    /** All job list - Frontend */
    public function ClassifiedsJobList()
    {
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 1)
            ->get();
        $ProjectDistricts = [];
        $Organizations = [];
        foreach ($classifieds as $job) {
            $ProjectDistrict = Districts::select('name_en')
                ->where('id', $job->district_id)
                ->first();
            array_push($ProjectDistricts, $ProjectDistrict);
            //
            $Organization = DB::table('organizations')
                ->select('*')
                ->where('id', $job->organization_id)
                ->first();

            if ($Organization) {
                array_push($Organizations, $Organization);
            } else {
                array_push($Organizations, null);
            }
        }

        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
            'locations' => $ProjectDistricts,
            'organization' => $Organizations,
        ]);
    }

    public function ClassifiedsJobsMap()
    {
        $jobsMap = DB::table('classifieds')
            ->where('type', 1)
            ->select('locations', 'title')
            ->get();
        return response()->json([
            'status' => 200,
            'jobs_map' => $jobsMap,
        ]);
    }
    public function ClassifiedsProposalsMap()
    {
        $ProposalsMap = DB::table('classifieds')
            ->where('type', 2)
            ->select('locations', 'title')
            ->get();
        return response()->json([
            'status' => 200,
            'Proposals_map' => $ProposalsMap,
        ]);
    }
    public function ClassifiedsSuppliersMap()
    {
        $suppliersMap = DB::table('classifieds')
            ->where('type', 3)
            ->select('locations', 'title')
            ->get();
        return response()->json([
            'status' => 200,
            'suppliers_map' => $suppliersMap,
        ]);
    }
    public function ClassifiedsResourceSharingMap()
    {
        $resourceSharingMap = DB::table('classifieds')
            ->where('type', 4)
            ->select('locations', 'title')
            ->get();
        return response()->json([
            'status' => 200,
            'resource_sharing_map' => $resourceSharingMap,
        ]);
    }

    public function filterJobs(Request $body)
    {
        $district_id = $body->input('district');
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 1)
            ->get();

        $filteredClassifieds = $classifieds->filter(function ($classified) use (
            $district_id
        ) {
            if (
                $district_id != null &&
                $classified->district_id != $district_id
            ) {
                return false;
            }
            return true;
        });

        return response()->json([
            'status' => 200,
            'filteredJobs' => $filteredClassifieds,
        ]);
    }

    public function filterGrants(Request $body)
    {
        $district_id = $body->input('district');
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 2)
            ->get();

        $filteredClassifieds = $classifieds->filter(function ($classified) use (
            $district_id
        ) {
            if (
                $district_id != null &&
                $classified->district_id != $district_id
            ) {
                return false;
            }
            return true;
        });

        return response()->json([
            'status' => 200,
            'filteredJobs' => $filteredClassifieds,
        ]);
    }

    public function filterSuppliers(Request $body)
    {
        $district_id = $body->input('district');
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 3)
            ->get();

        $filteredClassifieds = $classifieds->filter(function ($classified) use (
            $district_id
        ) {
            if (
                $district_id != null &&
                $classified->district_id != $district_id
            ) {
                return false;
            }
            return true;
        });

        return response()->json([
            'status' => 200,
            'filteredJobs' => $filteredClassifieds,
        ]);
    }

    public function filterResources(Request $body)
    {
        $district_id = $body->input('district');
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 4)
            ->get();

        $filteredClassifieds = $classifieds->filter(function ($classified) use (
            $district_id
        ) {
            if (
                $district_id != null &&
                $classified->district_id != $district_id
            ) {
                return false;
            }
            return true;
        });

        return response()->json([
            'status' => 200,
            'filteredJobs' => $filteredClassifieds,
        ]);
    }

    /** All proposal list - Frontend */
    public function ClassifiedsProposalList()
    {
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 2)
            ->get();
        $ProjectDistricts = [];
        $ProjectDistrict = [];
        $Organizations = [];
        $Organization = [];

        foreach ($classifieds as $job) {
            $ProjectDistrict = Districts::select('name_en')
                ->where('id', $job->district_id)
                ->first();
            array_push($ProjectDistricts, $ProjectDistrict);

            // $Organization = Organizations::select('title')->where('id', $job->organization_id)->first();
            $Organization = DB::table('organizations')
                ->select('*')
                ->where('id', $job->organization_id)
                ->first();

            if ($Organization) {
                array_push($Organizations, $Organization);
            } else {
                array_push($Organizations, null);
            }
        }

        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
            'locations' => $ProjectDistricts,
            'organization' => $Organizations,
        ]);
    }

    /** All suppliers list - Frontend */
    public function ClassifiedsSupplierList()
    {
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 3)
            ->get();
        $ProjectDistricts = [];
        $Organizations = [];
        foreach ($classifieds as $job) {
            $ProjectDistrict = Districts::select('name_en')
                ->where('id', $job->district_id)
                ->first();
            array_push($ProjectDistricts, $ProjectDistrict);
            //
            $Organization = DB::table('organizations')
                ->select('*')
                ->where('id', $job->organization_id)
                ->first();

            if ($Organization) {
                array_push($Organizations, $Organization);
            } else {
                array_push($Organizations, null);
            }
        }

        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
            'locations' => $ProjectDistricts,
            'organization' => $Organizations,
        ]);
    }

    /** All resource sharing list - Frontend */
    public function ClassifiedsResourceSharingList()
    {
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('type', 4)
            ->get();
        $ProjectDistricts = [];
        $Organizations = [];
        foreach ($classifieds as $job) {
            $ProjectDistrict = Districts::select('name_en')
                ->where('id', $job->district_id)
                ->first();
            array_push($ProjectDistricts, $ProjectDistrict);
            //
            $Organization = DB::table('organizations')
                ->select('*')
                ->where('id', $job->organization_id)
                ->first();

            if ($Organization) {
                array_push($Organizations, $Organization);
            } else {
                array_push($Organizations, null);
            }
        }

        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
            'locations' => $ProjectDistricts,
            'organization' => $Organizations,
        ]);
    }

    /** All job profile data - Frontend */
    public function JobProfile($slug)
    {
        $profile = DB::table('classifieds')
            ->select('*')
            ->where('type', 1)
            ->where('slug', $slug)
            ->first();
        $district = DB::table('districts')
            ->select('*')
            ->Where('id', $profile->district_id)
            ->first();
        $organization = DB::table('organizations')
            ->select('*')
            ->Where('id', $profile->organization_id)
            ->first();
        return response()->json([
            'status' => 200,
            'profile' => $profile,
            'district' => $district,
            'organization' => $organization,
        ]);
    }

    /** All proposal profile data - Frontend */
    public function ProposalProfile($slug)
    {
        $profile = DB::table('classifieds')
            ->select('*')
            ->where('type', 2)
            ->where('slug', $slug)
            ->first();
        $district = DB::table('districts')
            ->select('*')
            ->Where('id', $profile->district_id)
            ->first();
        $organization = DB::table('organizations')
            ->select('*')
            ->Where('id', $profile->organization_id)
            ->first();
        return response()->json([
            'status' => 200,
            'profile' => $profile,
            'district' => $district,
            'organization' => $organization,
        ]);
    }

    /** All supplier profile data - Frontend */
    public function SupplierProfile($slug)
    {
        $profile = DB::table('classifieds')
            ->select('*')
            ->where('type', 3)
            ->where('slug', $slug)
            ->first();
        $district = DB::table('districts')
            ->select('*')
            ->Where('id', $profile->district_id)
            ->first();
        $organization = DB::table('organizations')
            ->select('*')
            ->Where('id', $profile->organization_id)
            ->first();
        return response()->json([
            'status' => 200,
            'profile' => $profile,
            'district' => $district,
            'organization' => $organization,
        ]);
    }

    /** All resource sharing profile data - Frontend */
    public function ResourceSharingProfile($slug)
    {
        $profile = DB::table('classifieds')
            ->select('*')
            ->where('type', 4)
            ->where('slug', $slug)
            ->first();
        $district = DB::table('districts')
            ->select('*')
            ->Where('id', $profile->district_id)
            ->first();
        $organization = DB::table('organizations')
            ->select('*')
            ->Where('id', $profile->organization_id)
            ->first();
        return response()->json([
            'status' => 200,
            'profile' => $profile,
            'district' => $district,
            'organization' => $organization,
        ]);
    }

    /** Store new classified - Dashboard */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'type' => 'required',
        ]);
        if ($validator->fails()) {
            // return response()->json([
            //     'validation_errors' => $validator->messages(),
            // ]);
            return response()->json([
                'status' => 400,
                'errors' => $validator->messages(),
            ]);
        }
        $classified = Classifieds::create([
            'user_id' => Auth::user()->id,
            'type' => $request->type,
            'title' => $request->title,
            'district_id' => $request->district_id,
            'organization_id' => $request->organization_id,
            'city_id' => $request->city_id,
            'slug' => strtolower(
                str_replace(' ', '', $request->title) . uniqid()
            ),
            'description' => $request->description,
            'overview' => $request->overview,
            'weblink' => json_encode($request->weblink),
            'uploads' => json_encode($request->uploads),
            'photos' => json_encode($request->photos),
            'status' => 1,
            'locations' => json_encode($request->locations),
        ]);
        event(new TopicCreated($classified));
        return response()->json([
            'status' => 200,
            'message' => 'Record created successfully.',
            'locations' => json_encode($request->locations),
        ]);
    }

    /** Organization profile classified list - Frontend */
    public function organizationProfileClassifiedList($org_slug)
    {
        $org = Organizations::select('user_id')
            ->where('slug', $org_slug)
            ->first();
        $classifieds = DB::table('classifieds')
            ->select('*')
            ->where('user_id', $org->user_id)
            ->get();

        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
        ]);
    }

    /** Classified list by organisation - Dashboard */
    public function getClassifiedByUser(Request $request, $id)
    {
        $classifieds = Classifieds::where('user_id', $id)
            ->orderByDesc('created_at')
            ->get();
        return response()->json([
            'status' => 200,
            'classifieds' => $classifieds,
        ]);
    }

    /** Get data for classified edit - Dashboard */
    public function edit(Classifieds $classifieds, $id)
    {
        $classifiedData = Classifieds::where('id', '=', $id)->firstOrFail();
        $photoArray = [];
        if (!($classifiedData['uploads'] == null)) {
            foreach (JSON_decode($classifiedData['uploads']) as $row) {
                array_push($photoArray, $row);
            }
            $classifiedData->images = $photoArray;
        }
        $weblinkArray = [];
        if (!($classifiedData['weblink'] == null)) {
            foreach (JSON_decode($classifiedData['weblink']) as $row) {
                array_push($weblinkArray, $row);
            }
            $classifiedData->weblink = $weblinkArray;
        }
        if ($classifiedData) {
            return response()->json([
                'status' => 200,
                'get_data' => $classifiedData,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No ID found.!',
            ]);
        }
    }

    /** classified update - Dashboard */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {
            $classifies = Classifieds::find($id);
            if ($classifies) {
                $classifies->user_id = $request->input('user_id');
                $classifies->type = $request->input('type');
                $classifies->title = $request->input('title');
                $classifies->slug = strtolower(
                    str_replace(' ', '', $request->title) . uniqid()
                );
                $classifies->description = $request->input('description');
                $classifies->weblink = $request->input('weblink');
                $classifies->uploads = json_encode($request->uploads);
                $classifies->photos = json_encode($request->photos);
                $classifies->status = $request->input('status');
                $classifies->overview = $request->input('overview');
                $classifies->district_id = $request->input('district_id');
                $classifies->city_id = $request->input('city_id');
                $classifies->locations = json_encode($request->locations);

                $classifies->save();
                return response()->json([
                    'status' => 200,
                    'message' => $classifies->title . ' successfully updated.',
                ]);
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'No ID found.',
                ]);
            }
        }
    }

    public function delete($id)
    {
        $post = Classifieds::find($id);
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

    public function addTag(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag_id' => 'required',
            'classified_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }

        $classified = Classifieds::find($request->classified_id);
        if (!$classified) {
            return response()->json([
                'status' => 404,
                'message' => 'Classified Not Found!',
            ]);
        }
        $classified->tags()->attach($request->tag_id);
        return response()->json([
            'status' => 200,
            'classified' => $classified,
        ]);
    }

    public function removeTag(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag_id' => 'required',
            'classified_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $classified = Classifieds::find($request->classified_id);
        if (!$classified) {
            return response()->json([
                'status' => 404,
                'message' => 'Classified Not Found!',
            ]);
        }
        $classified->tags()->detach($request->tag_id);
        return response()->json([
            'status' => 200,
            'classified' => $classified,
        ]);
    }
}
