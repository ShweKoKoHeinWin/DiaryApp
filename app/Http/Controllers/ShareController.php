<?php

namespace App\Http\Controllers;

use App\Models\Collection;
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
        $CardClass = $request->input('cardType') === 'diary' ? Diary::class : Collection::class;
        $count = 0;
        foreach ($request->input('selectedCards') as $id) {
            $card = $CardClass::where('user_id', $user->id)->where('id', $id)->first();
            if ($card) {
                $shared = false;
                foreach ($request->input('receivers') as $email) {
                    $exist = $card->sharedItems()->where('email', $email)->where('shareable_type', $CardClass)->where('shareable_id', $card->id)->exists();

                    if (!$exist && $email) {
                        $shared = true;
                        $card->sharedItems()->create([
                            'owner_id'       => $user->id,
                            'email'          => $email,
                            'shareable_type' => $CardClass,
                            'shareable_id'   => $card->id,
                        ]);
                    }
                }
                if ($shared) $count++;
            }
        }
        return redirect()->back()->with('success', "{$count} {$request->input('cardType')} shared.");
    }
}
