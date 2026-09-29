<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;

#[Hidden(['Password'])]
class User extends Authenticatable
{
    protected $connection = 'sqlsrv';

    protected $table = 'tblUser';

    protected $primaryKey = 'Id';

    protected $authPasswordName = 'Password';

    public $timestamps = false;

    protected $appends = ['name'];

    protected function casts(): array
    {
        return [
            'Id' => 'integer',
            'IdToko' => 'integer',
            'AccessLevel' => 'integer',
            'Delete' => 'integer',
        ];
    }

    public function getNameAttribute(): ?string
    {
        return $this->attributes['Nama'] ?? null;
    }
}
