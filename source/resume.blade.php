@extends('_layouts.master')

@section('body')
    <div class="bg-gray-200 pb-8">
        <div class="container mx-auto max-w-6xl justify-end flex print-hidden px-8 py-4 -mt-8">
            <a
                href="/files/danholloran-resume.pdf?v=2"
                class="button button-primary inline-flex"
                target="_blank"
                rel="noopener noreferrer"
            >
                Download
                <span class="ml-2 h-5">
                    @include('_partials.icon-download-outline')
                </span>
                </a>
        </div>
        <div class="flex container max-w-6xl mx-auto resume bg-white">
            <div class="bg-gray-100 px-8 py-12 w-1/3">
                <div class="mb-8">
                    <h1 class="leading-none text-2xl mb-1">Dan Holloran</h1>
                    <h2 class="text-indigo-500 leading-none mb-0 mt-0 text-lg">Full Stack Developer</h2>
                </div>
                <div class="mb-8">
                    <h3 class="leading-none mb-1 mt-0 text-lg font-semibold text-gray-700">Contact Information</h3>
                    <ul class="my-0">
                        <li class="flex items-center">
                            <span class="block h-4 w-4 text-gray-500 mr-2">@include('_partials.icon-mail')</span>
                            <span class="sr-only">Email:</span>
                            dtholloran@gmail.com
                        </li>
                        <li class="flex items-center">
                            <span class="block h-4 w-4 text-gray-500 mr-2">@include('_partials.icon-phone')</span> <span class="sr-only">Phone:</span> 314-368-5819
                        </li>
                        <li class="flex items-center leading-none">
                            <span class="block h-4 w-4 text-gray-500 mr-2">@include('_partials.icon-link')</span>
                            <span class="sr-only">Website:</span>
                            <a href="https://danholloran.me/">https://danholloran.me/</a>
                        </li>
                    </ul>
                </div>
                <div class="mb-8">
                    <h3 class="leading-none mb-1 mt-0 text-lg font-semibold text-gray-700">Skills &amp; Tools</h3>
                    <ul class="flex flex-wrap -mx-1">
                        @foreach ($skills->reject(function($item) {
                            return (bool) $item->draft ?? false;
                        }) as $item)
                            <li class="inline-block bg-gray-300 leading-loose tracking-wide text-gray-800 text-xs font-semibold rounded mr-2 px-3 pt-px mb-2">
                                {{ $item->title }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>

            <div class="px-8 w-2/3 py-12">
                <div class="border-b-2 mb-8 pb-4">
                    <h2 class="leading-none mb-6 text-gray-700 text-2xl">Experience</h2>
                    @foreach ($experience->whereNotIn('category', ['education'])->reject(function($item) {
                        return (bool) $item->draft ?? false;
                    }) as $item)
                        <div class="mb-4">
                            <h3 class="text-xl mb-1">{{ $item->title }}</h3>
                            <h4 class="text-indigo-500 mb-0 mt-0 text-lg">
                                <a href="{{ $item->company_url }}" target="_blank" rel="noopener noreferrer">{{ $item->company }}</a>
                            </h4>
                            <span class="text-gray-700">{{ $item->start }} - {{ $item->end }}</span>
                            <div>
                                {!! $item->getContent() !!}
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="border-b-2 mb-8 pb-4">
                    <h2 class="leading-none mb-6 text-gray-700 text-2xl">Education</h2>
                    @foreach ($experience->whereIn('category', 'education')->reject(function($item) {
                        return (bool) $item->draft ?? false;
                    }) as $item)
                        <div class="mb-4">
                            <h3 class="text-xl mb-1">{{ $item->title }}</h3>
                            <h4 class="text-indigo-500 mb-0 mt-0 text-lg">
                                <a href="{{ $item->company_url }}" target="_blank" rel="noopener noreferrer">{{ $item->company }}</a>
                            </h4>
                            <span class="text-gray-700">{{ $item->start }} - {{ $item->end }}</span>
                        </div>
                    @endforeach
                </div>
                <div>
                    <h2 class="leading-none mb-6 text-gray-700 text-2xl">Projects</h2>
                    <ul class="flex flex-wrap -mb-6 -mx-4">
                        @foreach ($projects->reject(function($project) {
                            $isDraft = (bool) $project->draft ?? false;
                            $isFeatured = (bool) $project->featured ?? false;
                            return $isDraft or !$isFeatured;
                        }) as $project)
                            <li class="md:w-1/2 mb-4 px-4">
                                <div class="flex flex-col">
                                    <h3 class="mb-0 text-xl">
                                        <a class="text-gray-900" href="{{ $project->getUrl() }}">
                                            {{ $project->title }}
                                        </a>
                                        <span class="font-normal text-gray-600 text-sm block">
                                            Launched: {{ $project->getDate()->format('F Y') }}
                                        </span>
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
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
@stop
