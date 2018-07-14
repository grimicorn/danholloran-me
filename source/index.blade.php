---
pagination:
  collection: posts
  perPage: 10
---
@extends('_layouts.master')

@section('body')
    <div class="container mx-auto">
        <div>
            <ul class="list-reset">
                @foreach ($pagination->items as $post)
                    <li class="mb-10">
                        <div class="flex mb-2 items-center">
                            <div class="flex rounded-full overflow-hidden mr-4">
                                <img
                                    src="{{ $post->authorImageSrcSmall }}"
                                    alt="{{ $post->author }}"
                                    width="{{ $post->authorImageSmallSize }}"
                                    height="{{ $post->authorImageSmallSize }}"
                                >
                            </div>
                            <div class="text-sm text-grey-darkest">
                                <span class="block">{{ $post->author }}</span>
                                @if($post->date)
                                    <span class="block">{{ $post->dateFormatted() }}</span>
                                @endif
                            </div>
                        </div>

                        <h2 class="mb-4">
                            <a href="{{ $post->getUrl() }}" class="no-underline">{{ $post->title }}</a>
                        </h2>

                        <div class="mb-4">
                            {{ $post->excerpt() }}
                        </div>

                        <a href="{{ $post->getUrl() }}" class="no-underline bold">Read More &gt;</a>
                    </li>
                @endforeach
            </ul>
            @include('_partials.pagination')
        </div>
    </div>
@endsection
