document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize active section tracking
    initActiveSection();

    // Simple form validation for contact forms (if added later)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // This would be replaced with actual form submission
                alert('Form submitted successfully! We will contact you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });

    // Add animation for elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit, .step, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Run once on load
    animateOnScroll();
});

// Reveal animations when elements come into view
function initAnimations() {
    const revealElements = document.querySelectorAll('.reveal-animation');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
                
                observer.unobserve(el);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('will-reveal');
        revealObserver.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without refresh
                history.pushState(null, null, targetId);
            }
        });
    });
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        
        question.addEventListener('click', () => {
            // Check if this item is active
            const isActive = question.classList.contains('active');
            
            // Close all answers first
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('h3');
                const otherAnswer = otherItem.querySelector('p');
                
                if (otherItem !== item) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current answer
            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                item.classList.add('active');
            } else {
                question.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                item.classList.remove('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when nav links are clicked
        const navLinkItems = document.querySelectorAll('.nav-link');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Add scrolled class to header on scroll
    const siteHeader = document.querySelector('.site-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });
    
    // Animation on scroll
    const revealElements = document.querySelectorAll('.reveal-animation');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                setTimeout(() => {
                    element.classList.add('revealed');
                }, element.dataset.delay || 0);
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', checkReveal);
}

// Parallax effects for background elements
function initParallax() {
    // Eliminăm efectul de parallax pentru secțiuni și orbs la scroll
    // Comentăm tot codul pentru a-l menține ca referință viitoare
    /*
    const parallaxSections = document.querySelectorAll('.parallax-section');
    const orbs = document.querySelectorAll('.glass-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Parallax for sections
        parallaxSections.forEach(section => {
            const speed = 0.05;
            const yPos = -(scrollY * speed);
            section.style.backgroundPositionY = yPos + 'px';
        });
        
        // Parallax for orbs
        orbs.forEach((orb, index) => {
            const speed = 0.03 * (index + 1);
            const yPos = -(scrollY * speed);
            orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
    */
}

// Track active section in navigation
function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Add subtle parallax effect to mouse movement
document.addEventListener('mousemove', (e) => {
    // Eliminăm efectul de parallax pentru mișcarea mouse-ului
    // Comentăm tot codul pentru a-l menține ca referință viitoare
    /*
    const orbs = document.querySelectorAll('.glass-orb');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    orbs.forEach((orb, index) => {
        const depth = (index + 1) * 10;
        const moveX = mouseX * depth;
        const moveY = mouseY * depth;
        
        // Combine scroll parallax with mouse movement
        const currentTransform = orb.style.transform || '';
        const scrollTransform = currentTransform.match(/translate3d\(0, (.+?)px, 0\)/);
        const scrollY = scrollTransform ? parseFloat(scrollTransform[1]) : 0;
        
        orb.style.transform = `translate3d(${moveX}px, ${scrollY + moveY}px, 0)`;
    });
    */
});

// Enhance button interactions with Apple-style feedback
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.97)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Parallax effect
document.addEventListener('mousemove', function(e) {
    // Eliminăm efectul de parallax pentru secțiuni la mișcarea mouse-ului
    // Comentăm tot codul pentru a-l menține ca referință viitoare
    /*
    const parallaxSections = document.querySelectorAll('.parallax-section');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionX = rect.left + rect.width / 2;
        const sectionY = rect.top + rect.height / 2;
        
        const moveX = (mouseX - sectionX) / 50;
        const moveY = (mouseY - sectionY) / 50;
        
        section.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    */
}); 