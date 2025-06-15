<?php

namespace App\Permissions;

enum CollectionPermission : string
{
    case create = 'collection.create';
    case edit = 'collection.edit';
    case show = 'collection.show';
    case delete = 'collection.delete';
    case share = 'collection.share';
}
