@extends('_layouts.master')

@section('body')
<div class="container mx-auto">
    <h1 class="mb-4">{{ $page->title }}</h1>

    <div class="mb-8">
        @include('_partials.post-meta')
    </div>

    <div class="mb-4 content">
        @yield('content')
    </div>

    @include('_partials.share-links')

    <div class="flex">
        @if($page->getPrevious())
            <a href="{{ $page->baseUrl . $page->getPrevious()->getPath() }}" class="button-small">&lt; Previous</a>
        @endif

        @if($page->getNext())
            <a href="{{ $page->baseUrl . $page->getNext()->getPath() }}" class="ml-auto button-small">Next &gt;</a>
        @endif
        {{-- @include('_partials.pagination') --}}
    </div>
</div>

@endsection
