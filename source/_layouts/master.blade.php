@php
$full_width = $page->getPath() === '';
@endphp
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="description" content="{{ $page->meta_description ?? $page->siteDescription }}">

        <meta property="og:title" content="{{ $page->title ?  $page->title . ' | ' : '' }}{{ $page->siteName }}"/>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="{{ $page->getUrl() }}"/>
        <meta property="og:description" content="{{ $page->siteDescription }}" />

        <title>{{ $page->siteName }}{{ $page->title ? ' | ' . $page->title : '' }}</title>

        <link rel="home" href="{{ $page->baseUrl }}">
        <link rel="icon" href="/favicon.ico">
        <link href="/blog/feed.atom" type="application/atom+xml" rel="alternate" title="{{ $page->siteName }} Atom Feed">

        @stack('meta')

        @if ($page->production)
            <!-- Insert analytics code here -->
        @endif

        <link rel="preload" href="https://fonts.googleapis.com/css?family=Fira+Code&display=swap" rel="stylesheet" as="style" onload="this.rel='stylesheet'">
        <link rel="preload" href="{{ mix('css/main.css', 'assets/build') }}" as="style" onload="this.rel='stylesheet'">
    </head>

    <body>
        <div class="flex flex-col justify-between min-h-screen bg-white text-gray-800 leading-normal font-sans antialiased">
            <header class="flex items-center h-24 py-4" role="banner">
                <div class="container flex items-center max-w-8xl mx-auto px-4 lg:px-8">
                    <div class="flex items-center">
                        <a href="/" title="{{ $page->siteName }} home" class="inline-flex items-center">
                            <h1 class="text-lg md:text-2xl text-indigo-800 font-semibold hover:text-indigo-700 my-0">{{ $page->siteName }}</h1>
                        </a>
                    </div>

                    <div id="vue-search" class="flex flex-1 justify-end items-center">
                        <search></search>

                        @include('_nav.social')
                        {{-- @include('_nav.menu') --}}

                        {{-- @include('_nav.menu-toggle') --}}
                    </div>
                </div>
            </header>

            {{-- @include('_nav.menu-responsive') --}}

            <main role="main" class="flex-auto w-full {{ $full_width ? '' : 'container max-w-4xl mx-auto px-6' }} py-16">
                @yield('body')
            </main>

            <footer class="bg-white text-center text-sm mt-12 py-4" role="contentinfo">
                <ul class="flex flex-col md:flex-row justify-center list-reset">
                    <li class="md:mr-2">
                        &copy; Dan Holloran {{ date('Y') }}.
                    </li>

                    <li>
                        Built with <a href="http://jigsaw.tighten.co" title="Jigsaw by Tighten">Jigsaw</a>
                        and <a href="https://tailwindcss.com" title="Tailwind CSS, a utility-first CSS framework">Tailwind CSS</a>.
                    </li>
                </ul>
            </footer>

            <script src="{{ mix('js/main.js', 'assets/build') }}"></script>

            @stack('scripts')
        </div>
    </body>
</html>
