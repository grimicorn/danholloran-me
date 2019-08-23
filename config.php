<?php

use Illuminate\Support\Carbon;

return [
    'siteTitle' => 'DanHolloran',
    'siteDescription' => 'My adventures on and off of the internetz.',
    'baseUrl' => 'https://danholloran.test',
    'production' => false,
    'metaDescription' => function ($page) {
        $excerpt = str_replace("\n", '', $page->excerpt(160, ''));
        $excerpt = trim($excerpt);

        return $excerpt ?: $page->siteDescription;
    },
    'dateFormatted' => function ($page, $format = 'j M Y') {
        if (!$page->date) {
            return '';
        }

        return Carbon::createFromTimestamp(strtotime($page->date))->format($format);
    },
    'excerpt' => function ($page, $characters = 50, $more = '...') {
        if (!method_exists($page, 'getContent')) {
            return '';
        }

        $content = strip_tags($page->getContent());
        return trim(
            collect(explode(' ', $content))->slice(0, $characters)->implode(' ')
        ) . $more;
    },
    'featuredImageSrc' => function ($page, $fallback = '') {
        return $page->image['featured'] ?? $fallback;
    },
    'collections' => [
        'posts' => [
            'path' => 'blog/{date|Y/m/d}/{filename}',
            'author' => 'Dan Holloran',
            'sort' => '-date',
            'authorImageSrcSmall' => '//www.gravatar.com/avatar/' . md5("dtholloran@gmail.com") . '?s=36',
            'authorImageSmallSize' => 36,
        ],
    ],
];
