@if($page->production_url)
    <a
        href="{{ $page->production_url }}"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm"
    >{{ $page->production_url }}</a>
@elseif($page->public === false)
    <span class="text-sm text-gray-700">Not Public</span>
@else
    <span class="text-sm text-gray-700">No Longer Online</span>
@endif
