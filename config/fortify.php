<?php

return [
    'guard' => 'web',

    'passwords' => 'users',

    'username' => 'Username',

    'email' => 'email',

    'lowercase_usernames' => false,

    'home' => '/dashboard',

    'prefix' => '',

    'domain' => null,

    'middleware' => ['web'],

    'limiters' => [
        'login' => 'login',
    ],

    'views' => true,

    'features' => [
        \Laravel\Fortify\Features::resetPasswords(),
    ],
];
