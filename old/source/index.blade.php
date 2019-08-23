---
pagination:
  collection: posts
  perPage: 10
---
@extends('_layouts.master')

@section('body')
    <div class="container">
        <div>
            <ul class="list-reset">
                @foreach ($pagination->items as $post)
                    <li class="mb-10">
                        @include('_partials.post-meta')

                        <h2 class="mb-4">
                            <a href="{{ $post->getUrl() }}" class="no-underline">{{ $post->title }}</a>
                        </h2>

                        <div class="content mb-4">
                            {{ $post->excerpt() }}
                        </div>

                        <a href="{{ $post->getUrl() }}" class="button-small">Read More &gt;</a>
                    </li>
                @endforeach
            </ul>
            @include('_partials.pagination')
        </div>
    </div>
@endsection
