<?php
namespace App\Services;

class Breadcrumb
{
    public static function collection($type = 'show', $from = 'collection', $data = [])
    {
        $breadcrumbs = [];
        $back = null;

        switch ($from) {
            case 'inbox':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Inbox', 'href' => route('inbox-shares.inbox')],
                    ['title' => 'Collection (' . ($data['collection']?->title ?? 'Detail') . ')', 'href' => null],
                ];
                $back = route('inbox-shares.inbox');
                break;
            case 'share':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Shares', 'href' => route('inbox-shares.shares')],
                    ['title' => 'Collection (' . ($data['collection']?->title ?? 'Detail') . ')', 'href' => null],
                ];
                $back = route('inbox-shares.shares');
                break;
            case 'user':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Users', 'href' => route('inbox-shares.users')],
                    ['title' => $data['email'] ?? 'Detail', 'href' => route('inbox-shares.users.detail', $data['email'])],
                    ['title' => 'Collection (' . ($data['collection']?->title ?? 'Detail') . ')', 'href' => null],
                ];
                $back = route('inbox-shares.users.detail', $data['email']);
                break;
            default:
                $breadcrumbs = [
                    ['title' => 'Collections', 'href' => route('collections.index')],
                    ['title' => $data['collection']?->title ?? '', 'href' => null],
                ];
                $back = route('collections.index');
        }
        
        return [$breadcrumbs, $back];
    }

}
