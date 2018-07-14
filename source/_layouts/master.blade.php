<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="stylesheet" href="{{ mix('/css/main.css') }}">
        <link rel="stylesheet" href="/assets/css/vendor/highlight.js/github.css">


        <title>{{ $page->siteTitle }}{{ $page->title ? ": {$page->title}" : '' }}</title>
        {{-- <meta name="description" content="{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.description }}{% endif %}"> --}}

        {{-- <link rel="alternate" type="application/rss+xml" title="{{ $page->siteTitle }}" href="/feed.xml" /> --}}

        <link rel="shortcut icon" sizes="16x16 24x24 32x32 48x48 64x64" href="{{ $page->baseUrl }}/favicon.ico">

        {{-- Start Apple Icons --}}
        <link rel="apple-touch-icon" sizes="60x60" href="{{ $page->baseUrl }}/images/icons/ios/icon-60.png">
        <link rel="apple-touch-icon" sizes="60x60" href="{{ $page->baseUrl }}/images/icons/ios/icon-60@2x.png">
        <link rel="apple-touch-icon" sizes="60x60" href="{{ $page->baseUrl }}/images/icons/ios/icon-60@3x.png">
        <link rel="apple-touch-icon" sizes="72x72" href="{{ $page->baseUrl }}/images/icons/ios/icon-72.png">
        <link rel="apple-touch-icon" sizes="144x144" href="{{ $page->baseUrl }}/images/icons/ios/icon-72@2x.png">
        <link rel="apple-touch-icon" sizes="76x76" href="{{ $page->baseUrl }}/images/icons/ios/icon-76.png">
        <link rel="apple-touch-icon" sizes="156x156" href="{{ $page->baseUrl }}/images/icons/ios/icon-76@2x.png">
        <link rel="apple-touch-icon" sizes="40x40" href="{{ $page->baseUrl }}/images/icons/ios/icon-small-40.png">
        <link rel="apple-touch-icon" sizes="80x80" href="{{ $page->baseUrl }}/images/icons/ios/icon-small-40@2x.png">
        <link rel="apple-touch-icon" sizes="40x40" href="{{ $page->baseUrl }}/images/icons/ios/icon-small-40@3x.png">
        <link rel="apple-touch-icon" sizes="50x50" href="{{ $page->baseUrl }}/images/icons/ios/icon-small-50.png">
        <link rel="apple-touch-icon" sizes="50x50" href="{{ $page->baseUrl }}/images/icons/ios/icon-small-50@2x.png">
        {{-- End Apple Icons --}}

        {{-- Start Open Graph --}}
        {{-- <meta property="og:title" content="{% if page.title %}{{ page.title }}{% else %}{{ site.title }}{% endif %}" />
        <meta property="og:url" content="{{ page.url | prepend: site.url }}" />
        {% if page.image.featured %}
        <meta property="og:image" content="{{ $page->baseUrl }}{{ site.uploadurl }}{{page.image.featured}}" />
        {% else %}
        <meta property="og:image" content="{{ $page->baseUrl }}/images/logo.png" />
        {% endif %}
        <meta property="og:description" content="{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.description }}{% endif %}" />
        <meta property="og:type" content="website" /> --}}
        {{-- End Open Graph --}}

        {{-- Start Twitter Card --}}
        {{-- <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@dholloran" />
        <meta name="twitter:creator" content="@dholloran" />
        <meta name="twitter:title" content="{% if page.title %}{{ page.title }}{% else %}{{ site.title }}{% endif %}" />
        {% if page.image.featured %}
        <meta name="twitter:image" content="{{ $page->baseUrl }}{{ site.uploadurl }}{{page.image.featured}}" />
        {% else %}
        <meta name="twitter:image" content="{{ $page->baseUrl }}/images/logo.png" />
        {% endif %}
        <meta name="twitter:description" content="{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.description }}{% endif %}" /> --}}
        {{-- End Twitter Card --}}

        <script src="{{ mix('/js/main.js') }}"></script>
    </head>
    <body class="font-sans leading-light bg-white text-grey-darkest">
        <header
            class="{{ $page->featuredImageSrc() ? 'py-4' : 'py-2 md:mb-8 mb-4 border border-grey-lighter' }}"
        >
            <div class="container">
                <a
                    class="text-xl bold text-grey-darkest no-underline"
                    href="{{ $page->baseUrl }}"
                >{{ $page->siteTitle }}</a>
            </div>
        </header>

        @yield('body')

        <footer class="container py-8 flex md:items-center flex md:flex-row flex-col-reverse">
            <div class="md:mr-4">
                @include('_partials.social-links')
            </div>
            <div class="md:ml-auto md:mb-0 mb-2">
                My adventures on and off of the internetz.
            </div>
        </footer>
    </body>
</html>
