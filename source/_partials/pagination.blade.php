<div class="mb-8 flex">
    @if ($previous = $pagination->previous)
        <a
            href="{{ $page->baseUrl }}{{ $previous }}"
            class="no-underline mr-2 button"
        >&lt; Previous</a>
    @endif

    @if ($next = $pagination->next)
        <a
            href="{{ $page->baseUrl }}{{ $next }}"
            class="no-underline button ml-auto"
        >Next &gt;</a>
    @endif
</div>
