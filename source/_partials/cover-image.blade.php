@if ($page->cover_image && !$page->cover_images)
    <img
        loading="lazy"
        src="{{ $page->cover_image }}"
        alt="{{ $page->title }} image"
        class="mb-2"
        width="850"
        height="405"
    >
@endif

@if ($page->cover_images)
    <agile
        class="mb-6"
        :options="{
            fade: true,
        }"
    >
        @foreach ($page->cover_images as $image)
        <div class="slide">
            <img
                loading="lazy"
                src="{{ $image }}"
                alt="{{ $page->title }} {{ $loop->count }} image"
                class="mb-2"
                width="850"
                height="405"
            >
        </div>
        @endforeach
    </agile>
@endif
