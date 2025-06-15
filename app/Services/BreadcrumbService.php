<?php

namespace App\Services;

class BreadcrumbService
{
    public static function diary($type = 'show', $from = 'diary', $data = [])
    {
        $breadcrumbs = [];
        $back = null;

        switch ($from) {
            case 'inbox': //ok
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Inbox', 'href' => route('inbox-shares.inbox')],
                ];
                $back = route('inbox-shares.inbox');
                break;
            case 'inboxcollection':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Inbox', 'href' => route('inbox-shares.inbox')],
                    ['title' => 'Collection(' . ($data['collection']?->title ?? 'Detail') . ')', 'href' => route('collections.show', ['collection' => $data['collection']->id, 'from' => 'inbox'])],
                ];
                $back = route('collections.show', ['collection' => $data['collection']->id, 'from' => 'inbox']);
                break;
            case 'share': //ok
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Shares', 'href' => route('inbox-shares.shares')],

                ];
                $back = route('inbox-shares.shares');
                break;
            case 'sharecollection': //ok
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Shares', 'href' => route('inbox-shares.shares')],
                    ['title' => 'Collection(' . ($data['collection']?->title ?? 'Detail') . ')', 'href' => route('collections.show', ['collection' => $data['collection']->id, 'from' => 'share'])],

                ];
                $back = route('inbox-shares.shares');
                break;
            case 'user':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Users', 'href' => route('inbox-shares.users')],
                    ['title' => $data['email'] ?? 'Detail', 'href' => route('inbox-shares.users.detail', $data['email'])],
                ];
                $back = route('inbox-shares.users.detail', $data['email']);
                break;
            case 'usercollection':
                $breadcrumbs = [
                    ['title' => 'Inbox & Shares', 'href' => route('inbox-shares')],
                    ['title' => 'Users', 'href' => route('inbox-shares.users')],
                    ['title' => $data['email'] ?? 'Detail', 'href' => route('inbox-shares.users.detail', $data['email'])],
                    ['title' => 'Collection(' . ($data['collection']?->title ?? '') . ')', 'href' => route('collections.show', ['collection' => $data['collection']->id, 'from' => 'user', 'data' => ['email' => $data['email']]])],
                ];
                $back = route('collections.show', ['collection' => $data['collection']->id, 'from' => 'user', 'data' => ['email' => $data['email']]]);
                break;
            case 'collection': // ok
                $breadcrumbs = [
                    ['title' => 'Collections', 'href' => route('collections.index')],
                    ['title' => $data['collection']?->title ?? '', 'href' => route('collections.show', $data['collection']->id)],

                ];
                $back = route('collections.show', $data['collection']->id);
                break;
            default:  // ok
                $breadcrumbs = [
                    ['title' => 'Diaries' ?? '', 'href' => route('diaries.index')],
                ];
                $back = route('diaries.index');
        }
        $breadcrumbs[] =  ['title' => 'Diary (' . ($data['diary']?->title ?? 'Detail') . ')', 'href' => route('diaries.show', [
            'diary' => $data['diary']?->id,
            'collection' => $data['collection']?->id,
            'from' => $from,
            'email' => $data['email'],
        ])];

        if ($type == 'edit') {
            $breadcrumbs[] = ['title' => 'Edit', 'href' => ''];
        }

        return [$breadcrumbs, $back];
    }

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
