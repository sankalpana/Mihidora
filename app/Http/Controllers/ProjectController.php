<?php

namespace App\Http\Controllers;
use App\Upload;
use Spatie\Tags\Tag;
use App\Models\Cities;
use App\Models\Districts;
use App\Models\DataEducation;
use App\Models\Classifieds;
use Nette\Utils\Image;
use App\Models\Projects;
use App\Models\Fileuploads;
use Illuminate\Http\Request;
use App\Models\Organizations;
use App\Models\OrganizationType;
use App\Models\OrganizationUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProjectController extends Controller
{
    /** All project list - Frontend */
    public function index()
    {
        $projects = Projects::where('id', '>', 1)
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();
        $tags = [];
        foreach ($projects as $project) {
            $tag = $project->tags->pluck('name', 'type', 'id');
            array_push($tags, $tag);
        }

        return response()->json([
            'status' => 200,
            'projects' => $projects,
            'tags' => $tags,
        ]);
    }

    //     public function projectMap()
    //         {
    //             $projectMap = Projects::select('locations', 'org_name')
    //                 ->get();
    //             return response()->json([
    //                 'status'=>200,
    //                 'project_map'=>$organizationMap
    //             ]);
    //         }
    public function filterProjects(Request $body)
    {
        $district_id = $body->input('district');
        $tag_names = $body->input('tags');
        $projects = Projects::where('id', '>', 1)
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();
        $tags = [];
        foreach ($projects as $project) {
            $tag = $project->tags->pluck('name', 'type', 'id');
            array_push($tags, $tag);
        }

        $filteredProjects = $projects->filter(function ($project) use (
            $district_id
        ) {
            if ($district_id != null && $project->district_id != $district_id) {
                return false;
            }
            return true;
        });

        $filteredProjects = $filteredProjects->filter(function ($project) use (
            $tag_names
        ) {
            if ($tag_names != null) {
                $projectTags = $project->tags->pluck('name')->toArray();
                if (count(array_intersect($projectTags, $tag_names)) == 0) {
                    return false;
                }
            }
            return true;
        });
        return response()->json([
            'status' => 200,
            'filteredProjects' => $filteredProjects,
        ]);
    }

    public function projectMap()
    {
        $projectMap = DB::table('projects')
            ->where('id', '>', 1)
            ->select('locations', 'project_title')
            ->whereNull('deleted_at')
            ->get();
        return response()->json([
            'status' => 200,
            'project_map' => $projectMap,
        ]);
    }

    public function listProjectsForDashboard()
    {
        $user_id = Auth::user()->id;
        $projects = DB::table('projects')
            ->select('id', 'project_title', 'slug', 'start_date', 'end_date')
            ->where('user_id', 1)
            ->whereNull('deleted_at')
            ->orWhere('user_id', $user_id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 200,
            'projects' => $projects,
        ]);
    }

    /** Project single page - Frontend */
    public function show($slug)
    {
        $photoList = [];
        $projects = Projects::where('slug', $slug)->first();
        $projectCity = Cities::select('name_en')
            ->where('id', $projects->city_id)
            ->first();
        $ProjectDistrict = Districts::select('name_en')
            ->where('id', $projects->district_id)
            ->first();

        if ($projectCity == null) {
            $city = 1;
        } else {
            $city = $projectCity;
        }
        if ($ProjectDistrict == null) {
            $district = 1;
        } else {
            $district = $ProjectDistrict;
        }

        $organization = Organizations::select(
            'org_name',
            'slug',
            'org_type',
            'city_id'
        )
            ->where('id', $projects->organization_id)
            ->first();
        $organizationCity = Cities::select('name_en')
            ->where('id', $organization->city_id)
            ->first();

        if ($organizationCity == null) {
            $Orgdistrict = 1;
        } else {
            $Orgdistrict = $organizationCity;
        }

        $organizationType = OrganizationType::select('type')
            ->where('id', $organization->org_type)
            ->first();

        $tags = $projects->tags->pluck('name');
        $collborators = $projects->collaborators;
        $photoArray = [];
        $projects->images = [];
        if (!($projects['photos'] == 'null')) {
            foreach (JSON_decode($projects['photos']) as $row) {
                array_push($photoArray, $row);
            }
            $projects->images = $photoArray;
        }
        if ($projects) {
            return response()->json([
                'status' => 200,
                'get_data' => $projects,
                'tags' => $tags,
                'project_org' => $organization,
                'project_city' => $city,
                'project_district' => $district,
                'organization_city' => $Orgdistrict,
                'organization_type' => $organizationType,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No project ID found.!',
            ]);
        }
    }

    /** Organization profile project list - Frontend */
    public function organizationProfileProjectList($org_slug)
    {
        $org = Organizations::select('user_id')
            ->where('slug', $org_slug)
            ->first();
        $projects = DB::table('projects')
            ->select('*')
            ->where('user_id', $org->user_id)
            ->whereNull('deleted_at')
            ->get();

        return response()->json([
            'status' => 200,
            'projects' => $projects,
        ]);
    }

    /** Get projects by org - Dashboard */
    //change so that the where is based on users org ID and not usersID
    public function projectsByOrganization()
    {
        $user_id = Auth::user()->id;
        $projects = DB::table('projects')
            ->select('id', 'project_title', 'slug', 'start_date', 'end_date')
            ->where('user_id', $user_id)
            ->whereNull('deleted_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 200,
            'projects' => $projects,
        ]);
    }

    /** Project store - Dashboard */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_title' => 'required',
            'level1' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->messages(),
            ]);
        } else {
            //$orgType = OrganizationUser::select('organization_id')->where('user_id', $request->user_id)->first();
            //dd($orgType['organization_id']);
            $project = Projects::create([
                'user_id' => $request->user_id,
                'project_title' => $request->project_title,
                'slug' => strtolower(
                    str_replace(' ', '', $request->project_title) . uniqid()
                ),
                'overview' => $request->overview,
                'description' => $request->description,
                'locations' => json_encode($request->locations),
                'uploads' => json_encode($request->uploads),
                'photos' => json_encode($request->photos),
                'start_date' => $request->start_date,
                'ongoing' => $request->ongoing,
                'end_date' => $request->end_date,
                'city_id' => $request->city_id,
                'district_id' => $request->district_id,
                'linked_content' => json_encode($request->linked_content),
                'organization_id' => $request->organization_id,
            ]);

            // $tags = $request->input('tags_thematic');
            // $tagsSubject = $request->input('tags_subject');
            // $tagsExtra = $request->input('tags_extra');
            // $project->attachTags($tags, 1);
            // $project->attachTags($tagsSubject, 2);
            // $project->attachTags($tagsExtra, 3);

            // adding thematic tags
            $project->tags()->attach($request->level1); // level 1 is mandatory
            if ($request->has('level2')) {
                $project->tags()->attach($request->level2);
            }
            if ($request->has('level3')) {
                $project->tags()->attach($request->level3);
            }
            if ($request->has('level4')) {
                $project->tags()->attach($request->level4);
            }

            // adding other tags
            if ($request->has('other_tags_subject')) {
                foreach ($request->other_tags_subject as $tag) {
                    $project->tags()->attach($tag);
                }
            }
            if ($request->has('other_tags_extra')) {
                foreach ($request->other_tags_extra as $tag) {
                    $project->tags()->attach($tag);
                }
            }
            // adding collaborators
            if ($request->has('collborators')) {
                foreach ($request->collborators as $collab) {
                    $project->collaborators()->attach($collab);
                }
            }
            return response()->json([
                'status' => 200,
                'message' => $request->project_title . ' successfully added.',
            ]);
        }
    }

    public function validateTags(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'level1' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $thematics = $request->thematics;
        $tags = [];
        $tags[] = $request->level1;
        if ($request->has('level2')) {
            $project->tags()->attach($request->level2);
        }
        if ($request->has('level3')) {
            $project->tags()->attach($request->level3);
        }
        if ($request->has('level4')) {
            $project->tags()->attach($request->level4);
        }
        return response()->json([
            'status' => 200,
            'message' => $tags,
        ]);
    }

    /** Get data for project update - Dashboard */
    public function edit(Projects $projects, $id)
    {
        // $data = Projects::where('id', '=', $id)->firstOrFail();
        $data = Projects::with('collaborators')
            ->where('id', '=', $id)
            ->firstOrFail();
        $photoArray = [];
        $data->images = [];
        if (!($data['photos'] == 'null')) {
            foreach (JSON_decode($data['photos']) as $row) {
                array_push($photoArray, $row);
            }
            $data->images = $photoArray;
        }
        $tags[] = $data->tags->pluck('name', 'type');

        if ($data) {
            return response()->json([
                'status' => 200,
                'get_data' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No project ID found.!',
            ]);
        }
    }

    /** Project update - Dashboard */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'project_title' => 'required',
            'level1' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {
            $project = Projects::find($id);
            if ($project) {
                $project->project_title = $request->input('project_title');
                $project->overview = $request->input('overview');
                $project->description = $request->input('description');
                $project->locations = json_encode($request->locations);
                $project->uploads = json_encode($request->uploads);
                $project->photos = json_encode($request->photos);
                $project->start_date = $request->input('start_date');
                $project->end_date = $request->input('end_date');
                //$project->ongoing = $request->input('ongoing');
                $project->city_id = $request->input('city_id');
                $project->district_id = $request->input('district_id');
                $project->linked_content = json_encode(
                    $request->linked_content
                );

                // $project->delete(); //deleting the tags and re adding

                $tagsThematic = $request->input('tags_thematic');
                $tagsSubject = $request->input('tags_subject');
                $tagsExtra = $request->input('tags_extra');
                // $project->attachTags($tagsThematic, 1);
                // $project->attachTags($tagsSubject, 2);
                // $project->attachTags($tagsExtra, 3);

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
                $project->tags()->detach();

                foreach ($arrayWithoutNulls as $tag) {
                    $project->tags()->attach($tag);
                }

                // adding collborators
                $newCollabs = [];
                if ($request->has('collborators')) {
                    $collabs = $request->input('collborators');
                    $project->collaborators()->detach();
                    foreach ($collabs as $collab) {
                        $project->collaborators()->attach($collab);
                    }
                }

                $project->save();

                return response()->json([
                    'status' => 200,
                    'tags' => $arrayWithoutNulls,
                    'message' =>
                        $project->project_title . ' successfully updated.',
                ]);
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'No project ID found.',
                ]);
            }
        }
    }

    public function delete($id)
    {
        $project = Projects::find($id);
        if ($project) {
            //$post->delete();
            $project->deleted_at = \Carbon\Carbon::now()->toDateTimeString();
            $project->save();

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

    public function getProjectTags(Request $request)
    {
        $project = Projects::find($request->id);
        return response()->json([
            'status' => 200,
            'tags' => $project->tags,
        ]);
    }

    public function addProjectTag(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag_id' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }

        $project = Projects::find($request->project_id);
        if (!$project) {
            return response()->json([
                'status' => 404,
                'message' => 'Project Not Found!',
            ]);
        }
        $project->tags()->attach($request->tag_id);
        return response()->json([
            'status' => 200,
            'project' => $project,
        ]);
    }

    public function getProjects(Request $request)
    {
        $projects = [];
        if ($request->has('take')) {
            $projects = Projects::skip($request->skip)
                ->take($request->take)
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->get();
            return response()->json([
                'status' => 200,
                'count' => count($projects),
                'projects' => $projects,
            ]);
        }
        $projects = Projects::orderByRaw('created_at DESC')
            ->whereNull('deleted_at')
            ->get();
        $projects->load('tags');
        return response()->json([
            'status' => 200,
            'count' => count($projects),
            'projects' => $projects,
        ]);
    }

    public function addProjectCollaborator(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'org_id' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $project = Projects::find($request->project_id);
        if (!$project) {
            return response()->json([
                'status' => 404,
                'message' => 'Project Not Found!',
            ]);
        }
        $project->collaborators()->attach($request->org_id);
        return response()->json([
            'status' => 200,
            'project' => $project,
        ]);
    }

    public function getProjectCollborators(Request $request)
    {
        $project = Projects::find($request->id);
        return response()->json([
            'status' => 200,
            'collborators' => $project->collaborators,
        ]);
    }

    /**
     * Removing projects
     */
    public function detachTags(Request $request)
    {
        // Validate the request
        $request->validate([
            'slug' => 'required',
        ]);

        // Query the project using the provided slug
        $project = Projects::where('slug', $request->slug)->firstOrFail();

        // Detach all tags from the project
        $project->collaborators()->detach();
        $project->tags()->detach();
        $project->delete();

        // Return a JSON response for successful detachment
        return response()->json(['message' => 'Tags detached successfully']);
    }

    /**
     * Removing data
     */
    public function removeDataEdu(Request $request)
    {
        // Validate the request
        $request->validate([
            'slug' => 'required',
        ]);

        // Query the project using the provided slug
        $data = DataEducation::where('slug', $request->slug)->firstOrFail();

        // Detach all tags from the project
        // $data->collaborators()->detach();
        $data->tags()->detach();
        $data->delete();

        // Return a JSON response for successful detachment
        return response()->json([
            'data' => $data,
            'message' => 'Tags detached successfully',
        ]);
    }

    /**
     * Removing Jobs
     */
    public function removeClassifieds(Request $request)
    {
        // Validate the request
        $request->validate([
            'id' => 'required',
        ]);

        // Query the project using the provided slug
        // $data = Classifieds::where('slug', $request->slug)->firstOrFail();
        $record = Classifieds::find($request->id);

        // Detach all tags from the project
        // $data->collaborators()->detach();
        $record->tags()->detach();
        $record->delete();

        // Return a JSON response for successful detachment
        return response()->json([
            'data' => $record,
            'message' => 'Record deleted successfully',
        ]);
    }

    public function removeWhatsOn(Request $request)
    {
        // Validate the request
        $request->validate([
            'id' => 'required',
        ]);

        // Query the project using the provided slug
        // $data = Classifieds::where('slug', $request->slug)->firstOrFail();
        $record = WhatsOn::find($request->id);
        
        // Detach all tags from the project
        // $data->collaborators()->detach();
        $record->tags()->detach();
        $record->delete();

        // Return a JSON response for successful detachment
        return response()->json([
            'data' => $record,
            'message' => 'Record deleted successfully',
        ]);
    }
}
