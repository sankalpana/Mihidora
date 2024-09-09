<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Organizations;
use App\Models\Projects;
use App\Models\DataEducation;
use App\Models\WhatsOn;
use App\Models\Classifieds;
use Spatie\Tags\Tag;
use Illuminate\Support\Facades\DB;
//use Nette\Utils\Image;

class SearchController extends Controller
{
    public function searchAll(Request $request)
    {
        $searchTerm = $request->input('term');
        $organizations = SearchController::orgHelper($searchTerm, 4);
        $projects = SearchController::projHelper($searchTerm, 4);
        $data = SearchController::dataHelper($searchTerm, 1, 4);
    $elearning = SearchController::dataHelper($searchTerm, 2, 4);
        $resources = SearchController::resourceHelper($searchTerm, -1, 4);
        $whatsOn = SearchController::whatsOnHelper($searchTerm, -1, 4);
        // $data = SearchController::searchData($request);

        return response()->json([
            'status' => 200,
            'results' => [
                'organizations' => $organizations,
                'projects' => $projects,
                'data' => $data,
                'elearning' => $elearning,
                'resources' => $resources,
                'whatson' => $whatsOn,
            ],
        ]);
    }

    public function orgHelper($searchTerm, $numResults)
    {
        try {
            $query = Organizations::where(function ($query) use (
                $searchTerm
            ) {
                $query->whereRaw('MATCH(org_name) AGAINST(? IN BOOLEAN MODE)', [
                    '+' . $searchTerm . '*',
                ]);
                $query->orWhereRaw(
                    'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhere('overview', 'LIKE', '%' . $searchTerm . '%');
            })->with('tags');

            if ($numResults !== null) {
                $query->take($numResults);
            }
            $matchingRecords = $query->latest()->get();

            return $matchingRecords;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function projHelper($searchTerm, $numResults)
    {
        try {
            $query = Projects::where(function ($query) use (
                $searchTerm
            ) {
                $query->whereRaw(
                    'MATCH(project_title) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhereRaw(
                    'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhere('overview', 'LIKE', '%' . $searchTerm . '%');
            })->with('tags');
            if ($numResults !== null) {
                $query->take($numResults);
            }
            $matchingRecords = $query->latest()->get();
            return $matchingRecords;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function dataHelper($searchTerm, $typeFilter, $numResults)
    {
        try {
            $query = DataEducation::when($typeFilter, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags');
            if ($numResults !== null) {
                $query->take($numResults);
            }
            $matchingRecords = $query->latest()->get();
            return $matchingRecords;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function resourceHelper($searchTerm, $typeFilter, $numResults)
    {
        // if the typeFilter value is -1, it will skip the filter by type. If not it will apply the filter
        try {
            $query = Classifieds::when($typeFilter !== -1, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags');
            if ($numResults !== null) {
                $query->take($numResults);
            }
            $matchingRecords = $query->latest()->get();
            return $matchingRecords;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function whatsOnHelper($searchTerm, $typeFilter, $numResults)
    {
        try {
            $query = WhatsOn::when($typeFilter !== -1, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags');
            if ($numResults !== null) {
                $query->take($numResults);
            }
            $matchingRecords = $query->latest()->get();
            return $matchingRecords;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function searchOrganizations(Request $request)
    {
        $searchTerm = $request->input('term');
        try {
            $matchingRecords = Organizations::where(function ($query) use (
                $searchTerm
            ) {
                $query->whereRaw('MATCH(org_name) AGAINST(? IN BOOLEAN MODE)', [
                    '+' . $searchTerm . '*',
                ]);
                $query->orWhereRaw(
                    'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhere('overview', 'LIKE', '%' . $searchTerm . '%');
            })
                ->where('status', 1)
                ->where('id', '<>', 1)
                ->with('tags')
                ->get();

            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function searchProjects(Request $request)
    {
        $searchTerm = $request->input('term');
        try {
            $matchingRecords = Projects::where(function ($query) use (
                $searchTerm
            ) {
                $query->whereRaw(
                    'MATCH(project_title) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhereRaw(
                    'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhere('overview', 'LIKE', '%' . $searchTerm . '%');
            })
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->whereNull('deleted_at')
                ->where('id', '<>', 1)
                ->get();
            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function searchData(Request $request)
    {
        $searchTerm = $request->input('term');
        $typeFilter = $request->input('type');

        // type 1 - Data
        // type 2 - E-Learning

        try {
            $matchingRecords = DataEducation::when($typeFilter, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags')
                ->get();

            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function searchResources(Request $request)
    {
        $searchTerm = $request->input('term');
        $typeFilter = $request->input('type');

        /**
         * The attributes that are mass assignable.
         * Type 1 : Job Advert
         * Type 2 : Grants & RFPs
         * Type 3 : Green / Sustainable Suppliers
         * Type 4 : Resource Pool
         **/
        try {
            $matchingRecords = Classifieds::when($typeFilter, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags')
                ->get();

            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function searchWhatson(Request $request)
    {
        $searchTerm = $request->input('term');
        $typeFilter = $request->input('type');

        /**
         * The attributes that are mass assignable.
         * Type 1 : Events
         * Type 2 : Media & Adovocacy
         * Type 3 : Volunteer Opportunities
         **/
        try {
            $matchingRecords = WhatsOn::when($typeFilter, function (
                $query,
                $typeFilter
            ) {
                // Add a condition to filter by "type" if provided
                $query->where('type', $typeFilter);
            })
                ->where(function ($query) use ($searchTerm) {
                    $query->whereRaw(
                        'MATCH(title) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhereRaw(
                        'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                        ['+' . $searchTerm . '*']
                    );
                    $query->orWhere(
                        'overview',
                        'LIKE',
                        '%' . $searchTerm . '%'
                    );
                })
                ->with('tags')
                ->get();

            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function search(Request $request)
    {
        $searchTerm = $request->input('term');
        try {
            $matchingRecords = Organizations::whereRaw(
                'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                ['+' . $searchTerm . '*']
            )->get();
            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            // Handle the exception, log it, or return an error response
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    public function combinedSearch(Request $request)
    {
        $searchTerm = $request->input('term');
        try {
            $matchingRecords = Organizations::where(function ($query) use (
                $searchTerm
            ) {
                $query->whereRaw('MATCH(org_name) AGAINST(? IN BOOLEAN MODE)', [
                    '+' . $searchTerm . '*',
                ]);
                $query->orWhereRaw(
                    'MATCH(description) AGAINST(? IN BOOLEAN MODE)',
                    ['+' . $searchTerm . '*']
                );
                $query->orWhere('overview', 'LIKE', '%' . $searchTerm . '%');
            })->get();
            return response()->json([
                'status' => 200,
                'count' => count($matchingRecords),
                'results' => $matchingRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error occured in the query',
                'error' => $e,
            ]);
        }
    }

    /**
     * Display the specified resource.
     * @return \Illuminate\Http\Response
     */
    public function searchByFilters(Request $request)
    {
        //order by | most relavant - most recent
        // paginate 50

        //1. organization title, district, city, thematicTag, subjectTag, documentTag |
        //2. project title
        //data title
        //whats on title
        //classified title
        //e-learning title
        //bodyTitleFullTextSearch string

        //might be userful : whereJsonContains('options->languages', 'en'), whereNotNull('updated_at')

        //$org = Organizations::select('user_id')->where('slug', $org_slug)->first();
        $projects = DB::table('projects')
            ->select('*')
            ->where('user_id', $request->input('tags_thematic'))
            ->get();

        return response()->json([
            'status' => 200,
            'projects' => $projects,
        ]);
    }
}
