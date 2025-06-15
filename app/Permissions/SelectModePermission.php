<?php

namespace App\Permissions;

enum SelectModePermission: string
{
    case share = 'selectmode.share';
    case collection = 'selectmode.collection';

    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }
}
