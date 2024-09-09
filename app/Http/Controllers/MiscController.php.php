<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cities;
use App\Models\Districts;
use App\Models\DataEducation;
use App\Models\Classifieds;
use App\Models\Organizations;
use Illuminate\Support\Facades\Validator;

class MiscController extends Controller
{
    public function getOrgResources(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);

        $organisation = Organizations::find($request->id);
        return response()->json([
            'status' => 200,
            'data' => $record,
        ]);
    }

    public function matchOrgStatus()
    {
        $organizations = Organizations::join(
            'users',
            'organizations.user_id',
            '=',
            'users.id'
        )
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
}
