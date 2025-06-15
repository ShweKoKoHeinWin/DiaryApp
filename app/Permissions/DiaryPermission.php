<?php

namespace App\Permissions;

enum DiaryPermission : string
{
    case create = 'diary.create';
    case edit = 'diary.edit';
    case show = 'diary.show';
    case delete = 'diary.delete';
    case share = 'diary.share';
    case collection = 'diary.collection';
}
