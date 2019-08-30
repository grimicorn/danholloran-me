@if ($page->categories)
    <div class="{{ $wrap_class ?? 'mb-4' }}">
        @foreach ($page->categories as $i => $category)
            <span
                href="{{ '/blog/categories/' . $category }}"
                title="View posts in {{ $category }}"
                class="inline-block bg-gray-300 leading-loose tracking-wide text-gray-800 text-xs font-semibold rounded mr-2 px-3 pt-px mb-2"
            >{{ $category }}</span>
        @endforeach
    </div>
@endif
