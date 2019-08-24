<nav class="hidden lg:flex items-center justify-end text-lg">
    <a title="{{ $page->siteName }} Blog" href="/blog"
        class="ml-6 text-gray-900 hover:text-blue-800 {{ $page->isActive('/blog') ? 'active text-blue-800' : '' }}">
        Blog
    </a>

    <a title="{{ $page->siteName }} Contact" href="/contact"
        class="ml-6 text-gray-900 hover:text-blue-800 {{ $page->isActive('/contact') ? 'active text-blue-800' : '' }}">
        Contact
    </a>
</nav>
