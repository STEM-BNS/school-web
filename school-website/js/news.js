document.addEventListener('DOMContentLoaded', function() {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
        FB.init({
            appId: '101524117903935',
            xfbml: true,
            version: 'v12.0',
            status: true,
            cookie: true
        });
        
        // Parse any Facebook elements on the page
        FB.XFBML.parse();
    };

    // News Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter news items
            newsItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Load Facebook Feed
    function loadFacebookFeed() {
        const fbPage = document.querySelector('.fb-page');
        if (fbPage) {
            FB.XFBML.parse(fbPage);
        }
    }

    // Load News Items
    function loadNewsItems() {
        const newsGrid = document.querySelector('.news-grid');
        
        // Example news items (replace with actual data)
        const newsData = [
            {
                category: 'events',
                title: 'Annual Science Fair',
                date: 'March 15, 2024',
                excerpt: 'Join us for our annual science fair showcasing student projects and innovations.',
                image: 'images/news1.jpg'
            },
            {
                category: 'achievements',
                title: 'Student Wins National Competition',
                date: 'March 10, 2024',
                excerpt: 'Our student wins first place in the national STEM competition.',
                image: 'images/news2.jpg'
            }
        ];

        newsData.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.setAttribute('data-category', item.category);
            
            newsItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="news-content">
                    <span class="news-category">${item.category}</span>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-date">${item.date}</p>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            `;
            
            newsGrid.appendChild(newsItem);
        });
    }

    // Load Events Calendar
    function loadEventsCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        
        // Example events (replace with actual data)
        const eventsData = [
            {
                date: 'March 20, 2024',
                title: 'Open House',
                details: 'Visit our campus and learn about our programs.'
            },
            {
                date: 'April 5, 2024',
                title: 'Career Day',
                details: 'Meet professionals from various STEM fields.'
            }
        ];

        eventsData.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            
            eventCard.innerHTML = `
                <p class="event-date">${event.date}</p>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-details">${event.details}</p>
            `;
            
            calendarGrid.appendChild(eventCard);
        });
    }

    // Initialize all features
    loadNewsItems();
    loadEventsCalendar();
    loadFacebookFeed();
}); 