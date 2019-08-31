@extends('_layouts.master')

@section('body')
    <div  class="flex md:items-center container max-w-4xl mx-auto px-6 mb-10 justify-center md:flex-row flex-row-reverse">
        <div>
            <h1 class="leading-tight mb-0">
                Hi, I'm Dan
                <span class="leading-tight mt-0 mb-0 text-indigo-500 block">@todo Subtitle</span>
            </h1>
            <p class="mb-6">@todo Who am I?</p>
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
            <ul>
                <li>
                    @todo Outline projects
                </li>
                <li>
                    @todo Add description of what my role was on the project
                </li>
            </ul>
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
        <h2>Experience</h2>
        <ul class="flex flex-wrap -mx-1">
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <div class="h-24">
                    @include('_partials.logo-html')
                    <span class="sr-only">HTML</span>
                </div>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <div class="h-24">
                    @include('_partials.logo-css')
                    <span class="sr-only">CSS</span>
                </div>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://www.php.net/" target="_blank" rel="noopener noreferrer">
                    @include('_partials.logo-php')
                    <span class="sr-only">PHP</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <div class="h-24">
                    @include('_partials.logo-js')
                    <span class="sr-only">Javascript</span>
                </div>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://laravel.com/" target="_blank" rel="noopener noreferrer" class="block">
                    @include('_partials.logo-laravel')
                    <span class="sr-only">Laravel</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer" class="h-24 block" title="Vue.js">
                        @include('_partials.logo-vuejs')
                        <span class="sr-only">Vue.js</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://wordpress.org/" target="_blank" rel="noopener noreferrer" class="h-24 block">
                    @include('_partials.logo-wordpress')
                    <span class="sr-only">WordPress</span>
                </a>
            </li>
            <li  class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://statamic.com/" target="_blank" rel="noopener noreferrer">
                    @include('_partials.logo-statamic')
                    <span class="sr-only">Statamic</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-1">
                <a href="https://woocommerce.com/" target="_blank" rel="noopener noreferrer">
                    @include('_partials.logo-woocommerce')
                    <span class="sr-only">WooCommerce</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-1">
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                    @include('_partials.logo-tailwind')
                    <span class="sr-only">Tailwind.css</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://www.mysql.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-mysql')
                    <span class="sr-only">MySql</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://www.postgresql.org/" target="blank" class="h-24 block">
                    @include('_partials.logo-postgresql')
                    <span class="sr-only">PostgreSQL</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-1">
                <a href="https://redis.io/" target="blank" class="block">
                    @include('_partials.logo-redis')
                    <span class="sr-only">Redis</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer" class="h-24 block">
                    @include('_partials.logo-bootstrap')
                    <span class="sr-only">Bootstrap</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://sass-lang.com/" target="_blank" rel="noopener noreferrer" class="h-24">
                    @include('_partials.logo-sass')
                    <span class="sr-only">Sass</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://postcss.org/" target="_blank" rel="noopener noreferrer" class="h-24">
                    @include('_partials.logo-postcss')
                    <span class="sr-only">PostCSS</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://jquery.org/" target="_blank" rel="noopener noreferrer" class="block">
                    @include('_partials.logo-jquery')
                    <span class="sr-only">jQuery</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://webpack.js.org" target="blank" class="block">
                    @include('_partials.logo-webpack')
                    <span class="sr-only">Webpack</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://gulpjs.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-gulp')
                    <span class="sr-only">Gulp</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://getcomposer.org/" target="blank" class="h-24 block">
                    @include('_partials.logo-composer')
                    <span class="sr-only">Composer</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://www.npmjs.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-npm')
                    <span class="sr-only">NPM</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://git-scm.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-git')
                    <span class="sr-only">Git</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://www.sublimetext.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-sublime-text')
                    <span class="sr-only">Sublime Text</span>
                </a>
            </li>
            <li class="md:w-1/4 sm:w-1/3 w-1/2 flex items-center justify-center py-6 px-4">
                <a href="https://code.visualstudio.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-vs-code')
                    <span class="sr-only">Visual Studio Code</span>
                </a>
            </li>
        </ul>
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6" v-cloak>
            <h2>History</h2>
            @todo Convert to collection
            <agile
                class="mb-6"
                :options="{
                    fade: true,
                }"
            >
                <div class="slide">
                    <div>
                        <h3 class="mb-0">Lead Developer (Full-Stack Developer)</h3>
                        <h4 class="mt-0 mb-0">
                            <a href="https://matchboxdesigngroup.com/" target="_blank" rel="noopener noreferrer">Matchbox Design Group</a>
                        </h4>
                        <span>November 2012 - Present</span>
                        <p>
                            @todo About MDG
                        </p>
                        <p>
                            @todo Responsibilities
                        </p>
                    </div>
                </div>
                <div class="slide">
                    <h3 class="mb-0">Mentor</h3>
                    <h4 class="mt-0 mb-0">
                        <a href="https://www.launchcode.org/" target="_blank" rel="noopener noreferrer">Launchcode</a>
                    </h4>
                    <span>May 2016 - June 2017</span>
                    <p>
                        @todo About MDG
                    </p>
                    <p>
                        3 times
                        @todo Responsibilities
                    </p>
                    <span></span>
                </div>
                <div class="slide">
                    <h3 class="mb-0">Web Developer</h3>
                    <h4 class="mt-0 mb-0">
                        <a href="http://www.freemanhelp.com/" target="_blank" rel="noopener noreferrer">Freeman Marketing</a>
                    </h4>
                    <span>May 2012 - November 2012</span>
                    <p>
                        @todo About Freeman
                    </p>
                    <p>
                        I was responsible for converting Photoshop designs into WordPress marketing websites. Along with some content and SEO strategy. For part of the time I was also helping an intern web developer as well that was currently in school.
                    </p>
                </div>
                <div class="slide">
                    <h3 class="mb-0">Bachelors - Web Design & Development</h3>
                    <h4 class="mt-0 mb-0">
                        <a href="https://www.fullsail.edu/degrees/web-design-and-development-bachelor" target="_blank" rel="noopener noreferrer">Full Sail University</a>
                    </h4>
                    <span>November 2009 - March 2012</span>
                    <p>
                        This was a fast paced ~2 year bachelor program that was fully online. There I learned the fundementals of web design, HTML, CSS, JavaScript, PHP and Actionscript.
                    </p>
                    <p>
                        With each class being only about a month long it taught me how to get up to speed quickly on new topics. This was a good experience since it is much like the web industry fast paced and there is always something new to learn. One of the biggest take aways was to learn how to read documentation well. This will help you use any tool, language, framework, etc. not just the tools you are currently using.
                    </p>
                </div>
            </agile>

            <div class="text-center">
                <a
                    href="#resume"
                    class="button button-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >@todo My Resume</a>
            </div>
        </div>
    </div>

    <div id="contact" class="bg-indigo-800 text-white py-10">
        <div class="container max-w-4xl mx-auto px-6">
            <h2 class="text-white">Get in touch</h2>
            @todo Wire up to something... possibly https://fieldgoal.io/
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
