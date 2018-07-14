@extends('_layouts.master')

@section('body')

@if($page->featuredImageSrc())
        <div
        style="background-image:url('{{ $page->featuredImageSrc() }}')"
        class="featured-image">
            <h1 class="featured-image-title">{{ $page->title }}</h1>
        </div>
@else
    <div class="container">
        <h1 class="mb-4">{{ $page->title }}</h1>
    </div>
@endif
<div class="container">
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
