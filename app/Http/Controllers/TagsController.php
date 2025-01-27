<?php

namespace App\Http\Controllers;
use App\Models\Tags;
use App\Models\Level1Tag;
use App\Models\Projects;
use App\Models\DataEducation;
use App\Models\Classifieds;
use App\Models\WhatsOn;
use App\Models\Organizations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TagsController extends Controller
{
    public function getLevel1Tags(Request $request)
    {
        $query = Level1Tag::query();
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }
        if ($request->has('parent')) {
            $query->where('parent', $request->parent);
        }
        $tags = $query->orderBy('weight')->get();
        return response()->json([
            'status' => 200,
            'tags' => $tags,
        ]);
    }

    // public function getLevel1Tags(Request $request)
    // {
    //     $where = [
    //         $request->has('level') ? ['level', '=', $request->level]  : false,
    //         $request->has('parent') ? ['parent', '=', $request->parent]  : false
    //     ];
    //     $tags = Level1Tag::where($where)->orderBy('weight')->get();
    //     return response()->json([
    //         'status' => 200,
    //         'tags' => $where,
    //     ]);
    // }

    public function addTag(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $tag = Level1Tag::create([
            'name' => $request->name,
            'slug' => $this->slugify($request->name),
            'parent' => $request->parent ? $request->parent : 0,
            'weight' => $request->weight ? $request->weight : 0,
            'level' => $request->level,
        ]);
        return response()->json([
            'status' => 200,
            'new' => $tag,
            'tag' => [
                'name' => $request->name,
                'slug' => $this->slugify($request->name),
                'level' => $request->level,
            ],
        ]);
    }

    public function updateTag(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag_id' => 'required',
            'weight' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->messages(),
            ]);
        }
        $tag = Level1Tag::find($request->tag_id);
        if (!$tag) {
            return response()->json([
                'status' => 404,
                'tags' => 'Tag ID not found!',
            ]);
        }
        $tag->weight = $request->weight;
        $tag->save();
        return response()->json([
            'status' => 200,
            'message' => 'Tag Updated succcessfully',
            'tags' => $tag,
        ]);
    }

    public function slugify($string)
    {
        return strtolower(
            trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $string), '-')
        );
    }

    public function index()
    {
        $tags = Tags::all();
        return response()->json([
            'status' => 200,
            'tags' => $tags,
        ]);
    }

    public function getProjects(Request $request)
    {
        $tag = Level1Tag::find($request->id);
        if (!$tag) {
            return response()->json([
                'status' => 404,
                'tags' => 'Tag ID not found!',
            ]);
        }
        $projects = $tag->projects;
        return response()->json([
            'status' => 200,
            'projects' => $projects,
        ]);
    }

    public function getClassifieds(Request $request)
    {
        $tag = Level1Tag::find($request->id);
        if (!$tag) {
            return response()->json([
                'status' => 404,
                'tags' => 'Tag ID not found!',
            ]);
        }
        $classified = $tag->classifieds;
        return response()->json([
            'status' => 200,
            'classified' => $classified,
        ]);
    }

    public function getL3TagsByL1(Request $request)
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
        // get the distint l2 parent list from the given l1
        $parents = Level1Tag::where([
            ['level', '=', 2],
            ['parent', '=', $request->level1],
        ])
            ->distinct()
            ->pluck('id');
        // for each parent load
        $l3Tags = Level1Tag::whereIn('parent', $parents)
            ->orderBy('name')
            ->get();
        return response()->json([
            'status' => 404,
            'tags' => $l3Tags,
        ]);
    }

    public function filterTopics(Request $request)
    {
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);

        if ($request->has('take')) {
            //projects
            // $projects = Projects::whereHas('tags', function ($query) use ($tags) {
            //     $query->whereIn('id', $tags);
            // }, '=', count($tags))->take($request->take)->with('tags')->orderByRaw('created_at DESC')->get();
            $projects = Projects::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->take($request->take)
                ->get();

            //data
            $dataType = 1;
            $data = DataEducation::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->when(!empty($dataType), function ($query) use ($dataType) {
                    $query->where('type', $dataType);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->take($request->take)
                ->get();

            //elearning
            $eLearningType = 2;
            $elearning = DataEducation::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->when(!empty($eLearningType), function ($query) use (
                    $eLearningType
                ) {
                    $query->where('type', $eLearningType);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->take($request->take)
                ->get();

            // resources
            $resources = Classifieds::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->take($request->take)
                ->get();

            // Whatson
            $whatson = WhatsOn::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->take($request->take)
                ->get();

            return response()->json([
                'status' => 200,
                'project_count' => count($projects),
                'data_count' => count($data),
                'projects' => $projects,
                'elearning' => $elearning,
                'data' => $data,
                'resources' => $resources,
                'whatson' => $whatson,
                'tags' => $tags,
            ]);
        }

        // projects
        // $projects = Projects::whereHas('tags', function ($query) use ($tags) {
        //     $query->whereIn('id', $tags);
        // }, '=', count($tags))->with('tags')->orderByRaw('created_at DESC')->get();
        $projects = Projects::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->whereNull('deleted_at')
            ->get();

        // data
        $dataType = 1;
        $data = DataEducation::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->when(!empty($dataType), function ($query) use ($dataType) {
                $query->where('type', $dataType);
            })
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->whereNull('deleted_at')
            ->get();

        //elearning
        $eLearningType = 2;
        $elearning = DataEducation::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->when(!empty($eLearningType), function ($query) use (
                $eLearningType
            ) {
                $query->where('type', $eLearningType);
            })
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->whereNull('deleted_at')
            ->get();

        return response()->json([
            'status' => 200,
            'project_count' => count($projects),
            'data_count' => count($data),
            'projects' => $projects,
            'elearning' => $elearning,
            'resources' => [],
            'whatson' => [],
            'tags' => $tags,
            'data' => $data,
        ]);

        /**
         $posts = Post::where('published', true) // Additional filter
            ->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('name', $tags);
            }, '>=', count($tags)) // Filter based on tags
            ->paginate(10); // Assuming 10 posts per page
         */
    }

    public function filterEvents(Request $request)
    {
        $filters = $request->filters;
        $tags = array_filter($filters);
        if ($request->has('take')) {
            //projects
            $events = Projects::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->take($request->take)
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->get();

            //data
            $data = DataEducation::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->get();

            return response()->json([
                'status' => 200,
                'project_count' => count($projects),
                'data_count' => count($data),
                'projects' => $projects,
                'data' => $data,
                'tags' => $tags,
            ]);
        }

        // projects
        $projects = Projects::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->get();
        //data
        $data = DataEducation::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->get();

        return response()->json([
            'status' => 200,
            'project_count' => count($projects),
            'data_count' => count($data),
            'projects' => $projects,
            'tags' => $tags,
            'data' => $data,
        ]);

        /**
         $posts = Post::where('published', true) // Additional filter
            ->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('name', $tags);
            }, '>=', count($tags)) // Filter based on tags
            ->paginate(10); // Assuming 10 posts per page
         */
    }

    public function filterResources(Request $request)
    {
        /**
         * For now filtering is only done by district_id
         */
        $type = $request->type;
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);

        if ($request->has('take')) {
            $resources = Classifieds::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->when(!empty($type), function ($query) use ($type) {
                    $query->where('type', $type);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();

            return response()->json([
                'status' => 200,
                'resources' => $resources,
            ]);
        }

        $resources = Classifieds::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->when(!empty($type), function ($query) use ($type) {
                $query->where('type', $type);
            })
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->take($request->take)
            ->get();

        return response()->json([
            'status' => 200,
            'resources' => $resources,
        ]);
    }

    public function filterWhatsOn(Request $request)
    {
        $type = $request->type;
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);

        if ($request->has('take')) {
            $whatson = WhatsOn::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->when(!empty($type), function ($query) use ($type) {
                    $query->where('type', $type);
                })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            return response()->json([
                'status' => 200,
                'whatson' => $whatson,
            ]);
        }

        $whatson = WhatsOn::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->when(!empty($type), function ($query) use ($type) {
                $query->where('type', $type);
            })
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->get();

        return response()->json([
            'status' => 200,
            'whatson' => $whatson,
        ]);
    }

    public function filterOrganizations(Request $request)
    {
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);
        if ($request->has('take')) {
            $organizations = Organizations::whereHas(
                'tags',
                function ($query) use ($tags) {
                    $query->whereIn('id', $tags);
                },
                '=',
                count($tags)
            )
                ->when(!empty($districtId), function ($query) use (
                    $districtId
                ) {
                    $query->where('district_id', $districtId);
                })
                ->where('status', 1)
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            return response()->json([
                'status' => 200,
                'organizations' => $organizations,
            ]);
        }

        $organizations = Organizations::whereHas(
            'tags',
            function ($query) use ($tags) {
                $query->whereIn('id', $tags);
            },
            '=',
            count($tags)
        )
            ->when(!empty($districtId), function ($query) use ($districtId) {
                $query->where('district_id', $districtId);
            })
            ->where('status', 1)
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->get();
        return response()->json([
            'status' => 200,
            'organizations' => $organizations,
        ]);
    }
}
