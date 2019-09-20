---
extends: _layouts.post
section: content
title:  Kindling WordPress Framework
date: 2017-09-15
categories: [WordPress,Composer,NPM,Blade,Laravel,Webpack,Tailwind.css]
cover_image: /assets/img/kindling.png
thumbnail_image: /assets/img/kindling-thumbnail.png
public: false
draft: false
featured: true
built_at: "Matchbox Design Group"
---
Kindling is a custom [WordPress](https://wordpress.org/) framework that I have maintained over the years. This has been the foundation for all WordPress related projects. It uses Composer to integrate parts of [Laravel] to make building with WordPress a little nicer. It brings in the Laravel [Blade](https://laravel.com/docs/blade), [Service Container](https://laravel.com/docs/container), [Router](https://laravel.com/docs/routing) and more. It uses [Laravel Mix](https://laravel.com/docs/mix) to allow us to compile our front-end assets. It has a custom post type system to try to enforce sensible defaults. This helps to streamline the setup and boilerplate required. Such as adding a default category custom taxonomy. It also adds a default base [Tailwind.css](https://tailwindcss.com/) setup to help with consistency between projects.
