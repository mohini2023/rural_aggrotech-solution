class AgricultureNews {
    constructor() {
        this.newsListElement = document.getElementById('newsList');
        this.apiKey = ''; // You can add your news API key here if using a real API
        this.showLoading();
        this.fetchNews();
    }

    showLoading() {
        this.newsListElement.innerHTML = `
            <div class="flex justify-center items-center py-10">
                <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            </div>
        `;
    }

    async fetchNews() {
        try {
            // For demo, using simulated news data
            const newsData = [
                {
                    title: "New sustainable farming techniques boost crop yield",
                    url: "https://example.com/news1",
                    source: "AgriNews",
                    publishedAt: "2025-04-28",
                    description: "Farmers are adopting new sustainable techniques that increase yield while preserving the environment."
                },
                {
                    title: "Government announces subsidies for organic farming",
                    url: "https://example.com/news2",
                    source: "Farmers Daily",
                    publishedAt: "2025-04-27",
                    description: "The government has announced new subsidies to encourage organic farming practices across the country."
                },
                {
                    title: "Innovations in irrigation technology to save water",
                    url: "https://example.com/news3",
                    source: "AgriTech",
                    publishedAt: "2025-04-26",
                    description: "New irrigation technologies promise to reduce water usage significantly while maintaining crop health."
                }
            ];

            this.displayNews(newsData);
        } catch (error) {
            console.error("Failed to fetch agriculture news:", error);
            this.newsListElement.innerHTML = "<p class='text-red-600'>Failed to load news. Please try again later.</p>";
        }
    }

    displayNews(newsItems) {
        this.newsListElement.innerHTML = '';
        newsItems.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = "block p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer";
            newsItem.innerHTML = `
                <h3 class="text-lg font-semibold text-green-800">${item.title}</h3>
                <p class="text-sm text-gray-600">${item.source} - ${new Date(item.publishedAt).toLocaleDateString()}</p>
                <p class="mt-2 text-gray-700 hidden">${item.description}</p>
            `;
            newsItem.addEventListener('click', () => {
                const desc = newsItem.querySelector('p.mt-2');
                if (desc.classList.contains('hidden')) {
                    desc.classList.remove('hidden');
                } else {
                    desc.classList.add('hidden');
                }
            });
            this.newsListElement.appendChild(newsItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AgricultureNews();
});
