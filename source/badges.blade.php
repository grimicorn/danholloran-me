@php
$badges = [
    [
        'image_name' => 'merit-badge-dns-1.svg',
        'title' => 'Changed a DNS record and everything worked just fine',
        'earned' => true,
    ],
    [
        'image_name' => 'merit-badge-regex.svg',
        'title' => 'Comprehended someone else\'s RegEx',
        'earned' => true,
    ],
    [
        'image_name' => 'merit-badge-accordion.svg',
        'title' => 'Built an accordion from scratch',
        'earned' => true,
    ],
    [
        'image_name' => 'merit-badge-vim.svg',
        'title' => 'Exited VIM',
        'earned' => true,
    ],
    [
        'image_name' => 'merit-badge-cms.svg',
        'title' => 'Accidentally created own CMS',
        'earned' => false,
    ],
    [
        'image_name' => 'merit-badge-design.svg',
        'title' => 'Pulled off a design you didn’t think you could',
        'earned' => false,
    ],
    [
        'image_name' => 'merit-badge-no.svg',
        'title' => 'Told a client/boss "No, we\'re not doing that."',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-htaccess.svg',
        'title' => 'Wrote an HTAccess redirect that included a capture group',
        'earned' => false,
    ],

    [
        'image_name' => 'merit-badge-css-refactor.svg',
        'title' => 'Refactored a large portion of CSS and didn\'t break anything',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-center.svg',
        'title' => 'Centered an element vertically and horizontally ',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-encoding.svg',
        'title' => 'Migrated a database without character encoding issues',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-weekend.svg',
        'title' => 'Pushed to production on Friday and didn\'t roll it back over the weekend',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-merge-1.svg',
        'title' => 'Merged master into a six month old branch',
        'earned' => false,
    ],

    [
        'image_name' => 'merit-badge-spam.svg',
        'title' => 'Had a neglected site get hacked and spammed',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-grid.svg',
        'title' => 'Used CSS Grid in production',
        'earned' => false,
    ],

    [
        'image_name' => 'merit-badge-star.svg',
        'title' => 'Someone you don\'t know starred one of your GitHub Repositories',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-table.svg',
        'title' => 'Hand-coded a HTML email',
        'earned' => false,
    ],

    [
        'image_name' => 'merit-badge-pullrequest.svg',
        'title' => 'Gave someone useful feedback on a Pull Request',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-onechar.svg',
        'title' => 'Debugged something for over one hour where the fix was literally one character',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-sleep.svg',
        'title' => 'Solved a bug by taking a nap',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-cors.svg',
        'title' => 'Became extremely confused by a CORS error',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-estimate.svg',
        'title' => 'Quoted the exact number of hours it took to do the job',
        'earned' => false,
    ],

    [
        'image_name' => 'merit-badge-ssl.svg',
        'title' => 'Renewed an SSL certificate without any drama',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-stack-overflow.svg',
        'title' => 'Found an answer to an issue on StackOverflow',
        'earned' => true,
    ],

    [
        'image_name' => 'merit-badge-rock-checkbox-hack.svg',
        'title' => 'Rocked the Checkbox Hack on a project',
        'earned' => false,
    ],
    [
        'image_name' => 'merit-badge-stale-website.svg',
        'title' => 'Your personal website hasn\'t been updated in at least 5 years',
        'earned' => false,
    ],
];
@endphp
@extends('_layouts.master')

@push('meta')
    <meta property="og:title" content="{{ $page->title }}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{{ $page->getUrl() }}"/>
    <meta property="og:description" content="{{ $page->description }}" />
@endpush

@section('body')
    <h1>Web Development Merit Badges</h1>
    <p class="mb-12">
        Badges originally from <a href="https://css-tricks.com/web-development-merit-badges/">CSS Tricks</a>.
    </p>
    <div class="flex flex-wrap -mx-6">
        @foreach ($badges as $badge)
            <figure class="md:w-1/3 px-6 mb-8 font-bold text-center">
                <img
                    loading="lazy"
                    src="/assets/img/{{ $badge['image_name'] }}"
                    alt="{{ $badge['title'] }} image"
                    class="w-full h-auto mb-4 {{
                        $badge['earned'] ? '' : 'opacity-75 img-grayscale'
                    }}"
                >
                <figcaption>{{ $badge['title'] }}</figcaption>
            </figure>
        @endforeach
    </div>
@endsection
