<?php

namespace App\Http\Controllers;

use App\Models\Diary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ShareController extends Controller
{
    public function multishare(Request $request)
    {

        $request->validate([
            'receivers' => ['required', 'array'],
            'receivers.*' => ['nullable', 'string'],
            'cardType' => ['required', Rule::in('diary', 'collection')],
            'selectedCards' => ['required', 'array'],
            'selectedCards.*' => ['nullable', 'integer'],
        ]);
        $user = Auth::user();
        switch ($request->input('cardType', 'diary')) {
            case 'diary':
                $count = 0;
                foreach ($request->input('selectedCards') as $id) {
                    $diary = Diary::where('user_id', $user->id)->where('id', $id)->first();
                    if ($diary) {
                        $shared = false;
                        foreach ($request->input('receivers') as $email) {
                            $exist = $diary->sharedItems()->where('email', $email)->where('shareable_type', Diary::class)->where('shareable_id', $diary->id)->exists();

                            if (!$exist && $email) {
                                $shared = true;
                                $diary->sharedItems()->create([
                                    'owner_id'       => $user->id,
                                    'email'          => $email,
                                    'shareable_type' => Diary::class,
                                    'shareable_id'   => $diary->id,
                                ]);
                            }
                        }
                        if($shared) $count++;
                    }
                }
                return redirect()->back()->with('success', "{$count} diaries are shared.");
                break;

            case 'collection':

                break;

            default:
                # code...
                break;
        }
    }
}
