<?php

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


// This is a redirect after delete 
//  Case 1:: if prev url is show page, it need to redirect back to listing page
// Custome Cases:: it is callback
// Case default it will redireact back prev url
if (! function_exists('smartRedirectAfterDelete')) {
    function smartRedirectAfterDelete(string $targetUrl, string $successMessage, string $fallbackUrl = '', $callback = null, ?Request $request = null): RedirectResponse
    {
        $previousUrl = url()->previous();
        if ($callback) {
            $redirectResponse = $callback($request);
            if ($redirectResponse instanceof RedirectResponse) {
                return $redirectResponse;
            }
        }
        if (str_contains($previousUrl, $targetUrl)) {
            return redirect($fallbackUrl ?? url('/'))->with('success', $successMessage);
        }
        return redirect()->back()->with('success', $successMessage);
    }
}
