@extends('_layouts.master')

@section('body')
    <div>
        @todo General
        <ul>
            <li>
                See how high of a Lighthouse score can be achieved
            </li>
            <li>
                Blog categories
            </li>
            <li>
                Recent tweets? Maybe some way to make them a blog post
            </li>
            <li>
                Alert/notice for posts
            </li>
            <li>
                RSS feed /feed.xml (Maybe make link copy when clicked?)
            </li>
        </ul>
    </div>

    <div  class="flex items-center container max-w-4xl mx-auto px-6 mb-10">
        <div>
            <p class="mb-6">@todo Who am I?</p>
        </div>
        <img src="/assets/img/about.png"
        alt="About image"
        class="rounded-full h-64 w-64 bg-contain mx-auto md:float-right my-6 md:ml-10">
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6">
            @todo Past projects 4-6?
            <ul>
                <li>
                    Tag with tools used
                </li>
                <li>
                    Add completion month/year
                </li>
                <li>
                    Add description of what I did
                </li>
            </ul>
        </div>
    </div>

    <div class="container max-w-4xl mx-auto px-6 my-16">
        <h2>My Experience and Tools</h2>
        <ul class="flex flex-wrap">
            <li class="w-1/4 flex items-center justify-center h-48">
                <div class="h-24">
                    @include('_partials.logo-html')
                    <span class="sr-only">HTML</span>
                </div>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <div class="h-24">
                    @include('_partials.logo-css')
                    <span class="sr-only">CSS</span>
                </div>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://www.php.net/" target="_blank">
                    @include('_partials.logo-php')
                    <span class="sr-only">PHP</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <div class="h-24">
                    @include('_partials.logo-js')
                    <span class="sr-only">Javascript</span>
                </div>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://laravel.com/" target="_blank" class="block">
                    @include('_partials.logo-laravel')
                    <span class="sr-only">Laravel</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://vuejs.org/" target="_blank" class="h-24 block" title="Vue.js">
                        @include('_partials.logo-vuejs')
                        <span class="sr-only">Vue.js</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://wordpress.org/" target="_blank" class="h-24 block">
                    @include('_partials.logo-wordpress')
                    <span class="sr-only">WordPress</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://woocommerce.com/" target="_blank">
                    @include('_partials.logo-woocommerce')
                    <span class="sr-only">WooCommerce</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://tailwindcss.com/" target="_blank">
                    @include('_partials.logo-tailwind')
                    <span class="sr-only">Tailwind.css</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://www.mysql.com/" target="blank" class="h-24 block">
                    @include('_partials.logo-mysql')
                    <span class="sr-only">MySql</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://www.postgresql.org/" target="blank" class="h-24 block">
                    @include('_partials.logo-postgresql')
                    <span class="sr-only">PostgreSQL</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Redis?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://getbootstrap.com/" target="_blank" class="h-24 block">
                    @include('_partials.logo-bootstrap')
                    <span class="sr-only">Bootstrap</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://sass-lang.com/" target="_blank" class="h-24">
                    @include('_partials.logo-sass')
                    <span class="sr-only">Sass</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://postcss.org/" target="_blank" class="h-24">
                    @include('_partials.logo-postcss')
                    <span class="sr-only">PostCSS</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                <a href="https://jquery.org/" target="_blank" class="block">
                    @include('_partials.logo-jquery')
                    <span class="sr-only">jQuery</span>
                </a>
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Webpack
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Gulp
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Composer
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo NPM
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Git
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo PHPCS?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo ESLint?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Stylelint?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo Prettier?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo sublime Text?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo VS Code?
            </li>
            <li class="w-1/4 flex items-center justify-center h-48">
                @todo iTerm?
            </li>
        </ul>
    </div>

    <div class="bg-gray-100 py-10">
        <div class="container max-w-4xl mx-auto px-6">
            @todo History
            <ul>
                <li>
                    Full Sail
                </li>
                <li>
                    Freeman Marketing
                </li>
                <li>
                    Matchbox Design Group
                </li>
            </ul>
            <div class="text-center">
                <a
                    href="#resume"
                    class="button button-primary"
                    target="_blank"
                >@todo My Resume</a>
            </div>
        </div>
    </div>

    <div class="bg-indigo-800 text-white py-10">
        <div class="container max-w-4xl mx-auto px-6">
            <h2 class="text-white">Get in touch</h2>
            @todo Wire up to something... possibly https://fieldgoal.io/
            @include('_partials.contact-form')
        </div>
    </div>

    <div class="container max-w-4xl mx-auto px-6 pt-10">
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
            >More From My Blog</a>
        </div>
    </div>
@stop
