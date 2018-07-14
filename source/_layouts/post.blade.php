@extends('_layouts.master')

@section('body')
<div class="flex mb-2 items-center">
    <div class="flex rounded-full overflow-hidden mr-4">
        <img
            src="{{ $page->authorImageSrcSmall }}"
            alt="{{ $page->author }}"
            width="{{ $page->authorImageSmallSize }}"
            height="{{ $page->authorImageSmallSize }}"
        >
    </div>
    <div class="text-sm text-grey-darkest">
        <span class="block">{{ $page->author }}</span>
        @if($page->date)
            <span class="block">{{ $page->dateFormatted() }}</span>
        @endif
    </div>
</div>

<h2 class="mb-4">
    <a href="{{ $page->getUrl() }}" class="no-underline">{{ $page->title }}</a>
</h2>

<div class="mb-4">
    @yield('content')
</div>

<a href="{{ $page->getUrl() }}" class="no-underline bold">Read More &gt;</a>


@endsection
