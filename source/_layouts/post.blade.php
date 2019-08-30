@extends('_layouts.master')

@push('meta')
    <meta property="og:title" content="{{ $page->title }}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{{ $page->getUrl() }}"/>
    <meta property="og:description" content="{{ $page->description }}" />
@endpush

@section('body')
    @if ($page->cover_image)
        <img src="{{ $page->cover_image }}" alt="{{ $page->title }} cover image" class="mb-2">
    @endif

    <h1 class="leading-none mb-2">{{ $page->title }}</h1>

    @if($page->author)
        <p class="text-gray-700 text-xl md:mt-0 flex items-center">
            <img
                src="{{ $page->authorImageSrcSmall }}"
                alt="{{ $page->author }} Avatar"
                class="rounded-full mr-2"
                width="36"
                height="36"
            >
            {{ $page->author }}  •  {{ date('F j, Y', $page->date) }}
        </p>
    @endif

    @include('_partials.categories', [
        'page' => $page
    ])

    @component('_partials.alert')
        {{ $page->alert_message ?? null }}
    @endcomponent

    <div class="border-b border-indigo-200 mb-10 pb-4" v-pre>
        @yield('content')
    </div>

    <nav class="flex justify-between text-sm md:text-base">
        <div>
            @if ($next = $page->getNext())
                <a href="{{ $next->getUrl() }}" title="Older Post: {{ $next->title }}">
                    &LeftArrow; {{ $next->title }}
                </a>
            @endif
        </div>

        <div>
            @if ($previous = $page->getPrevious())
                <a href="{{ $previous->getUrl() }}" title="Newer Post: {{ $previous->title }}">
                    {{ $previous->title }} &RightArrow;
                </a>
            @endif
        </div>
    </nav>
@endsection
