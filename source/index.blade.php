---
pagination:
  collection: posts
  perPage: 10
---
@extends('_layouts.master')

@section('body')
  <p>Total of {{ $posts->count() }} posts</p>

<ul>
@foreach ($pagination->items as $post)
    <li>
      @if($post->date)
        <span>{{ date('j M Y',  strtotime($post->date)) }}</span>
      @endif

      <span>{{ $post->author }}</span>
      <h2>
        <a href="{{ $post->getUrl() }}">{{ $post->title }}</a>
      </h2>

      <a href="{{ $post->getUrl() }}">Read More</a>
    </li>
@endforeach
</ul>
@endsection
