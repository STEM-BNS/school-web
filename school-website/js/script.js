// Mobile Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('active');
    
    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Hamburger Animation
    hamburger.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    updateMobileMenuColors();
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        
        links.forEach(link => {
            link.style.animation = '';
        });
    }
});

// Close mobile menu when clicking a link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        
        links.forEach(link => {
            link.style.animation = '';
        });
    }
});

// Add scroll event listener to change header background
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow and more opacity when scrolling down
    if (currentScroll > 0) {
        header.style.background = 'var(--darker-bg)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
    } else {
        header.style.background = 'var(--dark-bg)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// News Grid Animation
const newsGrid = document.getElementById('newsGrid');
if (newsGrid) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Sticky Navigation
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--darker-bg)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
    } else {
        navbar.style.background = 'var(--dark-bg)';
        navbar.style.boxShadow = 'none';
    }
});

// Feature Cards Animation
const featureCards = document.querySelectorAll('.feature-card');

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// News Cards Animation
const newsCards = document.querySelectorAll('.news-card');

newsCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Form Validation (if forms are added later)
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
};

// Add form validation event listeners if forms exist
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
        }
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const langBtns = document.querySelectorAll('.lang-btn');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Language switching functionality
    function switchLanguage(lang) {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        
        // Update active state of language buttons
        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === (lang === 'ar' ? 'ع' : 'en')) {
                btn.classList.add('active');
            }
        });

        // Load and apply translations
        fetch(`translations/${lang}.json`)
            .then(response => response.json())
            .then(translations => {
                document.querySelectorAll('[data-translate]').forEach(element => {
                    const key = element.getAttribute('data-translate');
                    if (translations[key]) {
                        element.textContent = translations[key];
                    }
                });
            })
            .catch(error => console.error('Error loading translations:', error));

        // Store language preference
        localStorage.setItem('preferredLanguage', lang);
    }

    // Initialize language from stored preference or default to English
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(storedLang);

    // Add click handlers for language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.textContent.toLowerCase() === 'ع' ? 'ar' : 'en';
            switchLanguage(lang);
        });
    });
});

// Header scroll behavior
let lastScrollTop = 0;
const scrollThreshold = 100; // Amount of scroll before header hides

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add background when not at top
    if (scrollTop > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        header.classList.remove('header-hidden');
        return;
    }

    // Determine scroll direction and toggle header
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        // Scrolling down & past threshold
        header.classList.add('header-hidden');
    } else {
        // Scrolling up or at top
        header.classList.remove('header-hidden');
        // Add white background when reappearing
        header.classList.add('scrolled');
    }
    lastScrollTop = scrollTop;
});

// Update mobile menu colors based on header state
const updateMobileMenuColors = () => {
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelector('.nav-links');
    const isScrolled = header.classList.contains('scrolled');
    
    if (isScrolled && navLinks.classList.contains('active')) {
        navLinks.style.background = 'var(--dark-bg)';
    } else {
        navLinks.style.background = 'var(--dark-bg)';
    }
};

// Update colors on scroll
window.addEventListener('scroll', updateMobileMenuColors);

// Facebook Post Editing
let currentPostIndex = -1;
const ADMIN_PASSWORD = 'STEMBNS2025';
const modal = document.getElementById('editModal');
const closeBtn = document.getElementsByClassName('close')[0];

function editPost(index) {
    currentPostIndex = index;
    modal.style.display = 'block';
    document.getElementById('password').value = '';
    document.getElementById('postUrl').value = '';
    document.querySelector('.password-section').style.display = 'block';
    document.querySelector('.edit-section').style.display = 'none';
}

function verifyPassword() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        document.querySelector('.password-section').style.display = 'none';
        document.querySelector('.edit-section').style.display = 'block';
        const currentPost = document.querySelectorAll('.facebook-post iframe')[currentPostIndex];
        const currentUrl = new URLSearchParams(currentPost.src.split('?')[1]).get('href');
        document.getElementById('postUrl').value = decodeURIComponent(currentUrl);
    } else {
        alert('Incorrect password!');
    }
}

function updatePostUrl() {
    const newUrl = document.getElementById('postUrl').value;
    if (newUrl) {
        const posts = document.querySelectorAll('.facebook-post iframe');
        const encodedUrl = encodeURIComponent(newUrl);
        posts[currentPostIndex].src = `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=350`;
        modal.style.display = 'none';
    } else {
        alert('Please enter a valid URL');
    }
}

// Close modal when clicking the X
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
} 