// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

const setMenuState = (open) => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : 'auto';
    hamburger.setAttribute('aria-expanded', String(open));
};

if (hamburger) {
    hamburger.addEventListener('click', () => {
        setMenuState(!navMenu.classList.contains('active'));
    });

    // Keyboard support on hamburger
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setMenuState(!navMenu.classList.contains('active'));
        }
    });

    // Close with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('active')) return;
        const withinNav = e.target.closest('.nav-container');
        if (!withinNav) setMenuState(false);
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });
}

// Smooth Scrolling for Navigation Links
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

// Form Submission Handler
const contactForm = document.querySelector('.form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc2626' : '#059669'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add stagger effect for cards
            if (entry.target.classList.contains('service-card') || 
                entry.target.classList.contains('value-card') || 
                entry.target.classList.contains('office-card')) {
                const cards = entry.target.parentElement.children;
                const cardIndex = Array.from(cards).indexOf(entry.target);
                entry.target.style.transitionDelay = `${cardIndex * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .value-card, .office-card, .stat-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Mark current page link (for non-anchor links)
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    document.querySelectorAll('.nav-menu a[href]:not([href^="#"])').forEach(a => {
        try {
            const aUrl = new URL(a.href);
            const aPath = aUrl.pathname.replace(/\/+$/, '');
            if (aPath === currentPath || (currentPath.endsWith('/') && (aPath.endsWith('/index.html') || aPath === '/'))) {
                a.setAttribute('aria-current', 'page');
            } else {
                a.removeAttribute('aria-current');
            }
        } catch (_) {}
    });

    // Scroll spy for in-page section links
    const sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const idToLink = new Map(
        sectionLinks
            .map(a => [a.getAttribute('href').slice(1), a])
            .filter(([id]) => id && document.getElementById(id))
    );

    if (idToLink.size) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = idToLink.get(id);
                if (!link) return;
                if (entry.isIntersecting) {
                    // Clear previous active
                    sectionLinks.forEach(l => l.classList.remove('is-active'));
                    link.classList.add('is-active');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

        idToLink.forEach((_, id) => {
            const el = document.getElementById(id);
            if (el) spyObserver.observe(el);
        });
    }
});

// Enhanced header scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(248, 250, 252, 0.95)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(248, 250, 252, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
    }
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const heroGraphic = document.querySelector('.hero-graphic');
    if (heroGraphic) {
        const scrolled = window.pageYOffset;
        heroGraphic.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
});

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// --- Small UX utilities: back-to-top & dynamic year ---
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        const toggleBackToTop = () => {
            const show = window.scrollY > 600;
            backToTopBtn.classList.toggle('show', show);
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Update footer year across pages that include script.js
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.footer-bottom p').forEach(p => {
        p.textContent = `© ${currentYear} Tenman BD. All rights reserved.`;
    });
});
