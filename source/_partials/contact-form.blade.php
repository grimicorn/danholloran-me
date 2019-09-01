<form action="https://fieldgoal.io/f/P3Ypl4" method="POST">
    <div class="flex flex-wrap mb-6 -mx-3">
        <div class="w-full md:w-1/2 mb-6 md:mb-0 px-3">
            <label class="block mb-2 text-sm font-semibold" for="contact-name">
                Name
            </label>

            <input
                type="text"
                id="contact-name"
                placeholder="Jane Doe"
                name="name"
                class="block w-full border shadow rounded-lg outline-none mb-2 px-4 py-3 text-gray-800"
                required
            >
        </div>

        <div class="w-full px-3 md:w-1/2">
            <label class="block text-sm font-semibold mb-2" for="contact-email">
                Email Address
            </label>

            <input
                type="email"
                id="contact-email"
                placeholder="email@domain.com"
                name="email"
                class="block w-full border shadow rounded-lg outline-none mb-2 px-4 py-3 text-gray-800"
                required
            >
        </div>
    </div>

    <div class="w-full mb-12">
        <label class="block text-sm font-semibold mb-2" for="contact-message">
            Message
        </label>

        <textarea
            id="contact-message"
            rows="4"
            name="message"
            class="block w-full border shadow rounded-lg outline-none appearance-none mb-2 px-4 py-3 text-gray-800"
            placeholder="A lovely message here."
            required
        ></textarea>
    </div>

    <div class="flex justify-end w-full">
        <button
            type="submit"
            class="button button-primary-inverted"
        >Submit</button>
    </div>
</form>
