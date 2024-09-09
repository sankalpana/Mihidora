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

class MapController extends Controller
{
    /**
     * Function to get all resources on to the map
     * project
     * datahub
     * elearning-material
     * resource-exchange-job
     * resource-exchange-proposal
     * resource-exchange-supplier
     * resource-exchange-resource-sharing
     * resource-exchange-resource-sharing
     */
    public function filterTopics(Request $request)
    {
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);
        $result = [];
        if ($request->has('take')) {
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
                ->whereNull('deleted_at')
                ->orderByRaw('created_at DESC')
                ->where('id', '<>', 1)
                ->take($request->take)
                ->get();
            $projects->each(function ($project) use (&$result) {
                $result[] = [
                    'id' => $project->id,
                    'title' => $project->project_title,
                    'slug' => '/project/' . $project->slug,
                    'label' => 'Project',
                    'locations' => $project->locations,
                    'photos' => $project->photos,
                    'type' => 'project',
                ];
            });
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
                ->whereNull('deleted_at')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            $data->each(function ($record) use (&$result) {
                $result[] = [
                    'id' => $record->id,
                    'title' => $record->title,
                    'slug' => '/datahub/' . $record->slug,
                    'label' => 'Data',
                    'locations' => $record->locations,
                    'photos' => $record->photos,
                    'type' => 'datahub',
                ];
            });
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
                ->whereNull('deleted_at')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            $elearning->each(function ($record) use (&$result) {
                $result[] = [
                    'id' => $record->id,
                    'title' => $record->title,
                    'slug' => '/elearning-material/' . $record->slug,
                    'label' => 'E-Learning',
                    'locations' => $record->locations,
                    'photos' => $record->photos,
                    'type' => 'elearning-material',
                ];
            });

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
                ->whereNull('deleted_at')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();

            $resources->each(function ($record) use (&$result) {
                switch ($record->type) {
                    case 1:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' => '/resource-exchange-job/' . $record->slug,
                            'label' => 'Job',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'resource-exchange-job',
                        ];
                        break;
                    case 2:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/resource-exchange-proposal/' . $record->slug,
                            'label' => 'Grants & RFP',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'resource-exchange-proposal',
                        ];
                        break;
                    case 3:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/resource-exchange-supplier/' . $record->slug,
                            'label' => 'Supplier',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'resource-exchange-supplier',
                        ];
                        break;
                    case 4:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/resource-exchange-resource-sharing/' .
                                $record->slug,
                            'label' => 'Resource',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'resource-exchange-resource-sharing',
                        ];
                        break;
                    default:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/resource-exchange-resource-sharing/' .
                                $record->slug,
                            'label' => 'Resource',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'resource-exchange-resource-sharing',
                        ];
                        break;
                }
            });

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
                ->whereNull('deleted_at')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            $whatson->each(function ($record) use (&$result) {
                switch ($record->type) {
                    case 1:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' => '/whatson-event/' . $record->slug,
                            'label' => 'Event',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'whatson-event',
                        ];
                        break;
                    case 2:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/whatson-volunteer-opportunity/' .
                                $record->slug,
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'whatson-volunteer-opportunity',
                        ];
                        break;
                    case 3:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' =>
                                '/whatson-media-and-advocacy/' . $record->slug,
                            'label' => 'Media',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'whatson-media-and-advocacy',
                        ];
                        break;
                    default:
                        $result[] = [
                            'id' => $record->id,
                            'title' => $record->title,
                            'slug' => '/whatson-event/' . $record->slug,
                            'label' => 'Event',
                            'locations' => $record->locations,
                            'photos' => $record->photos,
                            'type' => 'whatson-event',
                        ];
                        break;
                }
            });

            // Organizations
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
                ->with('tags')
                ->where('status', 1)
                ->where('id', '<>', 1)
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();
            $organizations->each(function ($organization) use (&$result) {
                $result[] = [
                    'id' => $organization->id,
                    'title' => $organization->org_name,
                    'slug' => '/organization/' . $organization->slug,
                    'label' => 'Organization',
                    'locations' => $organization->locations,
                    'photos' => $organization->photos,
                    'type' => 'organization',
                ];
            });

            $filteredResultSet = array_filter($result, function ($item) {
                // Check if 'locations' is not null, not an empty array, and not an empty string
                return !is_null($item['locations']) &&
                    $item['locations'] !== '[]' &&
                    $item['locations'] !== '' &&
                    $item['id'] !== 1;
            });

            // Optionally re-index the array if needed
            $filteredResultSet = array_values($filteredResultSet);

            return response()->json([
                'status' => 200,
                'results' => $filteredResultSet,
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
            ->whereNull('deleted_at')
            ->where('id', '<>', 1)
            ->orderByRaw('created_at DESC')
            ->get();
        $projects->each(function ($project) use (&$result) {
            $result[] = [
                'id' => $project->id,
                'title' => $project->project_title,
                'slug' => '/project/' . $project->slug,
                'label' => 'Project',
                'locations' => $project->locations,
                'photos' => $project->photos,
                'type' => 'project',
            ];
        });

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
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        $data->each(function ($record) use (&$result) {
            $result[] = [
                'id' => $record->id,
                'title' => $record->title,
                'slug' => '/datahub/' . $record->slug,
                'label' => 'Data',
                'locations' => $record->locations,
                'photos' => $record->photos,
                'type' => 'datahub',
            ];
        });
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
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();
        $elearning->each(function ($record) use (&$result) {
            $result[] = [
                'id' => $record->id,
                'title' => $record->title,
                'slug' => '/elearning-material/' . $record->slug,
                'label' => 'E-Learning',
                'locations' => $record->locations,
                'photos' => $record->photos,
                'type' => 'elearning-material',
            ];
        });

        // resources
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
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();

        $resources->each(function ($record) use (&$result) {
            switch ($record->type) {
                case 1:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' => '/resource-exchange-job/' . $record->slug,
                        'label' => 'Job',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'resource-exchange-job',
                    ];
                    break;
                case 2:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/resource-exchange-proposal/' . $record->slug,
                        'label' => 'Grants & RFP',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'resource-exchange-proposal',
                    ];
                    break;
                case 3:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/resource-exchange-supplier/' . $record->slug,
                        'label' => 'Supplier',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'resource-exchange-supplier',
                    ];
                    break;
                case 4:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/resource-exchange-resource-sharing/' .
                            $record->slug,
                        'label' => 'Resource',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'resource-exchange-resource-sharing',
                    ];
                    break;
                default:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/resource-exchange-resource-sharing/' .
                            $record->slug,
                        'label' => 'Resource',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'resource-exchange-resource-sharing',
                    ];
                    break;
            }
        });

        // Whatson
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
            ->with('tags')
            ->whereNull('deleted_at')
            ->orderByRaw('created_at DESC')
            ->get();

        $whatson->each(function ($record) use (&$result) {
            switch ($record->type) {
                case 1:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' => '/whatson-event/' . $record->slug,
                        'label' => 'Event',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'whatson-event',
                    ];
                    break;
                case 2:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/whatson-volunteer-opportunity/' . $record->slug,
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'whatson-volunteer-opportunity',
                    ];
                    break;
                case 3:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' =>
                            '/whatson-media-and-advocacy/' . $record->slug,
                        'label' => 'Media',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'whatson-media-and-advocacy',
                    ];
                    break;
                default:
                    $result[] = [
                        'id' => $record->id,
                        'title' => $record->title,
                        'slug' => '/whatson-event/' . $record->slug,
                        'label' => 'Event',
                        'locations' => $record->locations,
                        'photos' => $record->photos,
                        'type' => 'whatson-event',
                    ];
                    break;
            }
        });

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
            ->with('tags')
            ->where('status', 1)
            ->where('id', '<>', 1)
            ->orderByRaw('created_at DESC')
            ->get();
        $organizations->each(function ($organization) use (&$result) {
            $result[] = [
                'id' => $organization->id,
                'title' => $organization->org_name,
                'slug' => '/organization/' . $organization->slug,
                'label' => 'Organization',
                'locations' => $organization->locations,
                'photos' => $organization->photos,
                'type' => 'organization',
            ];
        });

        // $filteredResultSet = array_filter($result, function ($item) {
        //     // Check if 'locations' is not null and not an empty array
        //     return !is_null($item['locations']) &&
        //         $item['locations'] !== '[]';
        // });
        $filteredResultSet = array_filter($result, function ($item) {
            // Check if 'locations' is not null, not an empty array, and not an empty string
            return !is_null($item['locations']) &&
                $item['locations'] !== '[]' &&
                $item['locations'] !== '' &&
                $item['id'] !== 1;
        });

        // Optionally re-index the array if needed
        $filteredResultSet = array_values($filteredResultSet);

        return response()->json([
            'status' => 200,
            'results' => $filteredResultSet,
        ]);
    }

    public function filterOrganizations(Request $request)
    {
        $filters = $request->filters;
        $districtId = $request->district;
        $tags = array_filter($filters);
        $result = [];
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
                ->with('tags')
                ->orderByRaw('created_at DESC')
                ->take($request->take)
                ->get();

            $organizations->each(function ($record) use (&$result) {
                $result[] = [
                    'id' => $record->id,
                    'title' => $record->org_name,
                    'slug' => '/organization/' . $record->slug,
                    'label' => 'Organization',
                    'locations' => $record->locations,
                    'photos' => $record->photos,
                    'type' => 'organization',
                ];
            });

            return response()->json([
                'status' => 200,
                'results' => $result,
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
            ->with('tags')
            ->orderByRaw('created_at DESC')
            ->get();

        $organizations->each(function ($record) use (&$result) {
            $result[] = [
                'id' => $record->id,
                'title' => $record->org_name,
                'slug' => '/organization/' . $record->slug,
                'label' => 'Organization',
                'locations' => $record->locations,
                'photos' => $record->photos,
                'type' => 'organization',
            ];
        });
        return response()->json([
            'status' => 200,
            'results' => $result,
        ]);
    }
}
