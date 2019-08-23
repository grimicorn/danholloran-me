@extends('_layouts.master')

@section('body')
    <div>
        @todo General
        <ul>
            <li>
                Copyright
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
        </ul>
    </div>

    <div>
        <img src="/assets/img/about.png"
        alt="About image"
        class="flex rounded-full h-64 w-64 bg-contain mx-auto md:float-right my-6 md:ml-10">

        <p class="mb-6">@todo Who am I?</p>
    </div>

    <div>
        @todo Past projects 4-6?
    </div>

    <div>
        @todo Expertise/Skills Icons
        <ul>
            <li>
                HTML
            </li>
            <li>
                CSS
            </li>
            <li>
                PHP
            </li>
            <li>
                JS
            </li>
            <li>
                Vue.js
            </li>
            <li>
                Laravel
            </li>
            <li>
                WordPress
            </li>
            <li>
                Tailwind.css
            </li>
            <li>
                MySql
            </li>
            <li>
                Bootstrap
            </li>
            <li>
                Sass
            </li>
            <li>
                jQuery
            </li>
        </ul>
    </div>

    <div>
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

        @todo Resume link?
    </div>

    <div>
        @todo contact me
    </div>

    <div>
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

        @todo Blog link
    </div>
@stop
