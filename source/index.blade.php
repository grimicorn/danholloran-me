@extends('_layouts.master')

@section('body')
    <div  class="flex md:items-center container max-w-4xl mx-auto px-6 mb-10 justify-center md:flex-row flex-row-reverse">
        <div>
            <h1 class="leading-tight mb-0">
                Hi, I'm Dan
                <span class="leading-tight mt-0 mb-0 text-indigo-500 block">Full Stack Developer</span>
            </h1>
            <p class="mb-6">
                @todo Who am I? This is oddly the hardest part about this...who really am I and what do I want to portray here idk I really am not good at this part but I am good at learning anf building websites and getting stuff done and learning new things and I think this will take more thinking and maybe another really random writing seesion like this
            </p>
            <scroll-to data-selector="#contact">
                Get In Touch
            </scroll-to>
        </div>
        <img
            loading="lazy" src="/assets/img/about.png"
        alt="About image"
        class="rounded-full h-24 w-24 bg-contain md:h-64 md:w-64 md:my-6 md:ml-10 mr-4 md:mr-0">
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6">
            <h2>Projects</h2>
            <ul class="flex flex-wrap -mb-6 -mx-4">
                @foreach ($projects->reject(function($project) {
                    return (bool) $project->draft ?? false;
                }) as $project)
                    <li class="md:w-1/2 mb-6 px-4">
                        <div class="bg-white rounded-lg overflow-hidden h-full w-full shadow flex flex-col">
                            <a href="{{ $project->getUrl() }}" class="block">
                                <img
                                    loading="lazy"
                                    src="{{ $project->thumbnail_image }}" alt="{{ $project->title }} thumbnail"
                                    class="object-cover"
                                    width="408"
                                    height="189"
                                >
                            </a>
                            <div class="px-6 py-6 mb-auto">
                                <h3 class="mb-0 text-lg">
                                    <a class="text-gray-900" href="{{ $project->getUrl() }}">
                                        {{ $project->title }}
                                    </a>
                                </h3>

                                <div class="mb-4">
                                    @include('_partials.production-url', [
                                        'page' => $project,
                                    ])
                                </div>

                                @include('_partials.categories', [
                                    'page' => $project,
                                    'wrap_class' => 'mb-0',
                                ])
                            </div>
                            <a
                                href="{{ $project->getUrl() }}"
                                class="button button-primary w-full rounded-t-none shadow-none text-sm"
                            >About {{ $project->title }}</a>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>

    <div class="container max-w-4xl mx-auto px-6 my-16">
        <h2>Skills &amp; Tools</h2>
        <ul class="flex flex-wrap -mx-1">
            @foreach ($skills->reject(function($item) {
                    return (bool) $item->draft ?? false;
                }) as $item)
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                @if($item->url ?? null)
                    <a href="{{ $item->url }}" target="blank" class="max-h-24 flex" rel="noopener noreferrer">
                        <div>
                            {!! $item->getContent() !!}
                        </div>
                        <span class="sr-only">{{ $item->title }}</span>
                    </a>
                @else
                    <div class="max-h-24 flex">
                        <div>
                            {!! $item->getContent() !!}
                        </div>
                        <span class="sr-only">{{ $item->title }}</span>
                    </div>
                @endif
            </li>
            @endforeach
        </ul>
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6" v-cloak>
            <h2>Experience</h2>
            <agile
                class="mb-6"
                :options="{
                    fade: true,
                }"
            >
                @foreach ($experience->reject(function($item) {
                    return (bool) $item->draft ?? false;
                }) as $item)
                    <div class="slide">
                        <div>
                            <h3 class="mb-0">{{ $item->title }}</h3>
                            <h4 class="mt-0 mb-0">
                                <a href="{{ $item->company_url }}" target="_blank" rel="noopener noreferrer">{{ $item->company }}</a>
                            </h4>
                            <span>{{ $item->start }} - {{ $item->end }}</span>
                            <div>
                                {!! $item->getContent() !!}
                            </div>
                        </div>
                    </div>
                @endforeach
            </agile>

            <div class="text-center">
                <a
                    href="/files/danholloran-resume.pdf"
                    class="button button-primary inline-flex"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    My Resume
                    <span class="ml-2 h-5">
                        @include('_partials.icon-download-outline')
                    </span>
                 </a>
            </div>
        </div>
    </div>

    <div id="contact" class="bg-indigo-800 text-white py-10">
        <div class="container max-w-4xl mx-auto px-6">
            <h2 class="text-white">Get in touch</h2>
            @include('_partials.contact-form')
        </div>
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6">
            <h2>Podcasts</h2>
            <ul class="flex flex-wrap">
                <li class="md:w-1/3 w-1/2">
                    <a href="https://www.dancarlin.com/hardcore-history-series/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/hardcore-history.jpeg" alt="Hardcore History" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://t.co/DDLcgLLHwD?amp=1" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/nptm.jpg" alt="No Plans to Merge" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://softskills.audio/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/soft-skills.png" alt="Soft Skills Engineering" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://samharris.org/podcast/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/making-sense.png" alt="Making Sense With Sam Harris" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="http://www.fullstackradio.com/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/fullstack-radio.jpeg" alt="Fullstack Radio" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://laravel-news.com/podcast/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/laravel-news-podcast.png" alt="Laravel News Podcast" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://www.redhat.com/en/command-line-heroes" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/commandline-heros.jpeg" alt="Commandline Heros" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="https://shoptalkshow.com/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/shoptalk-show.png" alt="Shoptalk Show" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
                <li class="md:w-1/3 w-1/2">
                    <a href="http://www.dadsindev.com/" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                        <img
                            loading="lazy" src="/assets/img/dads-in-dev.png" alt="Dads In Dev" width="255" height="255" class="object-cover w-full h-full">
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="container max-w-4xl mx-auto px-6 pt-10">
        <h2>Blog</h2>

        @foreach ($posts->where('featured', false)->reject(function ($post) {
            return $post->hidden ?? false;
        })->take(4)->chunk(2) as $row)
            <div class="flex flex-col md:flex-row md:-mx-6">
                @foreach ($row as $post)
                    <div class="w-full md:w-1/2 md:mx-6">
                        @include('_components.post-preview-inline')
                    </div>

                    @if (! $loop->last)
                        <hr class="block md:hidden w-full border-b mt-2 mb-6">
                    @endif
                @endforeach
            </div>

            @if (! $loop->last)
                <hr class="w-full border-b mt-2 mb-6">
            @endif
        @endforeach

        <div class="text-center pt-12">
            <a
                href="/blog/"
                class="button button-primary"
            >More Posts</a>
        </div>
    </div>
@stop
