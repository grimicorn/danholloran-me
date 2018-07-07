<?php

return [
    'baseUrl' => '/',
    'production' => false,
    'collections' => [
        'posts' => [
            'path' => 'blog/{date|Y/m/d}/{filename}',
            'author' => 'Dan Holloran',
            'sort' => 'date',
        ],
    ],
];
