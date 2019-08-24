@if(trim($slot ?? null))
    <div class="alert alert-{{ trim(str_slug($type ?? 'info')) }}">
        {{ $slot }}
    </div>
@endif
