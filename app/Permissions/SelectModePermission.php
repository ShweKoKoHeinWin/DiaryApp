<?php

namespace App\Permissions;

enum SelectModePermission : string
{
    case share = 'selectmode.share';
    case collection = 'selectmode.collection';
}
