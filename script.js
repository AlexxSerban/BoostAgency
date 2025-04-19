document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                // Create and display mobile menu
                const mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Clone elements from nav-menu
                const navMenuClone = document.querySelector('.nav-menu').cloneNode(true);
                
                // Clone CTA button
                const ctaClone = document.querySelector('.nav-cta').cloneNode(true);
                
                mobileMenu.appendChild(navMenuClone);
                mobileMenu.appendChild(ctaClone);
                
                navbar.appendChild(mobileMenu);
                
                // Animate toggle icon
                this.querySelector('span:first-child').style.transform = 'rotate(45deg) translate(3px, 3px)';
                this.querySelector('span:last-child').style.transform = 'rotate(-45deg) translate(3px, -3px)';
                
                // Prevent page scrolling
                document.body.style.overflow = 'hidden';
            } else {
                // Remove mobile menu
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    navbar.removeChild(mobileMenu);
                }
                
                // Reset toggle icon
                this.querySelector('span:first-child').style.transform = 'none';
                this.querySelector('span:last-child').style.transform = 'none';
                
                // Allow page scrolling
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                
                if (mobileMenu && menuToggle.classList.contains('active')) {
                    menuToggle.click();
                }
                
                // Scroll to target element
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add hero text animation on page load
    animateHeroText();
    
    // Function for hero text animations
    function animateHeroText() {
        const heroTitle = document.querySelector('.hero-title');
        const heroAccent = document.querySelector('.hero-title .accent');
        const heroDescription = document.querySelector('.hero-description');
        const heroCta = document.querySelector('.hero-cta');
        
        // Add animations for title with a delay
        if (heroTitle) {
            // Ensure the title has initial styles before animation
            heroTitle.classList.remove('visible');
            
            // Keep accent text without splitting into letters for animation
            if (heroAccent) {
                // Remove animation class
                heroAccent.classList.remove('animate-gradient');
            }
            
            // Animate the description paragraph by words
            if (heroDescription) {
                const descriptionText = heroDescription.textContent.trim();
                const words = descriptionText.split(' ');
                
                // Create spans for each word with staggered delays
                let newDescriptionHTML = '';
                for (let i = 0; i < words.length; i++) {
                    // Use the 'word' class defined in CSS to properly animate with the transitions
                    newDescriptionHTML += `<span class="word" style="transition-delay: ${0.1 + 0.05 * i}s;">${words[i]}</span>`;
                    if (i < words.length - 1) {
                        newDescriptionHTML += ' ';
                    }
                }
                
                // Replace the description content
                heroDescription.innerHTML = newDescriptionHTML;
            }
            
            // Animate title, description and CTA with staggered delays
            setTimeout(() => {
                // Add visible class to title to trigger animation
                heroTitle.classList.add('visible');
                
                // Animate description and CTA
                if (heroDescription) {
                    heroDescription.classList.add('visible');
                    // Make all words visible with staggered animation
                    const words = heroDescription.querySelectorAll('.word');
                    words.forEach(word => {
                        word.classList.add('visible');
                    });
                }
                if (heroCta) heroCta.classList.add('visible');
            }, 200);
        } else {
            // Fallback if the title element structure is different
            setTimeout(() => {
                if (heroDescription) heroDescription.classList.add('visible');
                if (heroCta) heroCta.classList.add('visible');
            }, 200);
        }
    }

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all active elements
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open current element if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Open first FAQ element by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }

    // Pricing Tabs Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(tabBtn => {
                tabBtn.classList.remove('active');
            });
            
            // Add active class to current button
            btn.classList.add('active');
            
            // Here you can implement logic to change the display of prices
            // depending on the selected tab (monthly vs. annual)
            const tabType = btn.getAttribute('data-tab');
            
            if (tabType === 'yearly') {
                // Show prices for monthly subscription
                document.querySelectorAll('.price').forEach(price => {
                    if (price.textContent === '1,400€') {
                        price.textContent = '500€';
                    } else if (price.textContent === '2,000€') {
                        price.textContent = '900€';
                    } else if (price.textContent === '5,000€') {
                        price.textContent = '1,700€';
                    }
                });
                
                document.querySelectorAll('.price-period').forEach(period => {
                    period.textContent = 'monthly';
                });
            } else {
                // Show prices for one-time payment
                document.querySelectorAll('.price').forEach(price => {
                    if (price.textContent === '500€') {
                        price.textContent = '1,400€';
                    } else if (price.textContent === '900€') {
                        price.textContent = '2,000€';
                    } else if (price.textContent === '1,700€') {
                        price.textContent = '5,000€';
                    }
                });
                
                document.querySelectorAll('.price-period').forEach(period => {
                    period.textContent = 'one-time payment';
                });
            }
        });
    });

    // Form Handling
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(consultationForm);
            const formDataObj = {};
            
            // Convert FormData to object
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Simulate a success response
            console.log('Form data:', formDataObj);
            showFormSuccess();
        });
    }
    
    // Function to display success message
    function showFormSuccess() {
        consultationForm.innerHTML = `
            <div class="form-success">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.0801V12.0001C21.9988 14.1565 21.3005 16.2548 20.0093 17.9819C18.7182 19.7091 16.9033 20.9726 14.8354 21.5839C12.7674 22.1952 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2462 3.61096 17.4372C2.43727 15.6281 1.87979 13.4882 2.02168 11.3364C2.16356 9.18467 2.99721 7.13643 4.39828 5.49718C5.79935 3.85793 7.69279 2.71549 9.79619 2.24025C11.8996 1.76502 14.1003 1.98245 16.07 2.86011" stroke="#00E5CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="#00E5CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Thank you for your request!</h3>
                <p>Your consultation request has been successfully submitted. A Boost Agency specialist will contact you within 24 hours to schedule a free call.</p>
                <p class="confirmation-time">In the meantime, you could explore more about <a href="#portfolio">our successful projects</a>.</p>
            </div>
        `;
    }
    
    // Function to display error message
    function showFormError() {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('form-error');
        errorMessage.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF4343" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 9L9 15" stroke="#FF4343" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9L15 15" stroke="#FF4343" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>An error occurred when submitting the form. Please try again or contact us directly at <a href="mailto:contact@boostagency.com">contact@boostagency.com</a></p>
        `;
        
        // Insert error message above the form
        consultationForm.prepend(errorMessage);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

    // Micro-animations for Hero Section
    const hero = document.querySelector('.hero');
    const heroButton = document.querySelector('.hero-cta .cta-button');
    const heroImage = document.querySelector('.hero-image');
    
    // Parallax effect on mouse movement - applying only to button, not title or paragraph
    hero.addEventListener('mousemove', function(e) {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 30; // Increased multiplier for more noticeable effect
        const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
        
        // Apply effect only to the button
        if (heroButton) {
            heroButton.style.transform = `translate(${xPos * 0.6}px, ${yPos * 0.6}px)`; // More pronounced effect on button
        }
        
        if (heroImage) {
            heroImage.style.transform = `translate(${-xPos * 0.5}px, ${-yPos * 0.5}px)`;
        }
    });
    
    // Reset position when mouse leaves the section
    hero.addEventListener('mouseleave', function() {
        if (heroButton) {
            heroButton.style.transform = 'translate(0, 0)';
            
            setTimeout(() => {
                heroButton.style.transition = 'transform 0.5s ease';
            }, 100);
            
            setTimeout(() => {
                heroButton.style.transition = '';
            }, 600);
        }
        
        if (heroImage) {
            heroImage.style.transform = 'translate(0, 0)';
            
            setTimeout(() => {
                heroImage.style.transition = 'transform 0.5s ease';
            }, 100);
            
            setTimeout(() => {
                heroImage.style.transition = '';
            }, 600);
        }
    });
    
    // Add interactive particles
    createParticles();

    // Add custom cursor for Hero Section
    createCustomCursor();

    // Sticky Navbar and Functionalities
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('section');
    
    // Function to make navbar sticky on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on visible section
        updateActiveLink();
    }
    
    // Function to update active link
    function updateActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Function for mobile menu
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Add/remove scroll to body when menu is opened/closed
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
        
        // Add hover effects on links
        link.addEventListener('mouseenter', function() {
            addHoverEffect(this);
        });
    });
    
    // Efect de hover pentru link-uri
    function addHoverEffect(link) {
        link.style.transition = 'transform 0.3s ease';
        link.style.transform = 'translateY(-2px)';
        
        setTimeout(() => {
            link.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add scroll indicators
    function addScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '0';
        indicator.style.left = '0';
        indicator.style.height = '3px';
        indicator.style.backgroundColor = 'var(--primary-color)';
        indicator.style.zIndex = '1001';
        indicator.style.transition = 'width 0.1s ease';
        
        document.body.appendChild(indicator);
        
        function updateScrollIndicator() {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            indicator.style.width = `${scrolled}%`;
        }
        
        window.addEventListener('scroll', updateScrollIndicator);
    }
    
    // Add effects to CTA button
    const ctaButton = document.querySelector('.nav-cta .btn');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 229, 204, 0.3)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Initialize functions
    handleScroll(); // To set initial state
    addScrollIndicator(); // Add scroll indicator
    
    // Add effect to logo
    const logo = document.querySelector('.navbar .logo');
    logo.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 5px rgba(0, 229, 204, 0.5)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
    });

    // Parallax effect on mouse movement
    document.addEventListener('mousemove', (e) => {
        const images = document.querySelectorAll('.hero-image');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        images.forEach(image => {
            const speed = parseFloat(image.getAttribute('data-speed') || 0.02);
            const rect = image.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - centerX) * speed;
            const deltaY = (mouseY - centerY) * speed;
            
            const currentTransform = window.getComputedStyle(image).transform;
            const rotation = currentTransform.includes('rotate') 
                ? currentTransform.match(/rotate\((.*?)deg\)/)[1]
                : 0;

            image.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        });
    });

    // Reset positions when leaving the section
    document.querySelector('.hero').addEventListener('mouseleave', () => {
        const images = document.querySelectorAll('.hero-image');
        images.forEach(image => {
            const rotation = image.style.transform.match(/rotate\((.*?)deg\)/)?.[1] || 0;
            image.style.transform = 'translate(0, 0)';
        });
    });

    // Function for scroll animation effects
    initScrollAnimations();
});

// Creating interactive particles in Hero Section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 20;
    
    // Creating the container for particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.zIndex = '1';
    particlesContainer.style.pointerEvents = 'none';
    
    hero.insertBefore(particlesContainer, hero.firstChild);
    
    // Creating the particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    // Interactivity with mouse
    hero.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const deltaX = mouseX - particleX;
            const deltaY = mouseY - particleY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < 150) {
                const angle = Math.atan2(deltaY, deltaX);
                const force = (150 - distance) / 10;
                
                const moveX = Math.cos(angle) * force;
                const moveY = Math.sin(angle) * force;
                
                particle.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
            } else {
                particle.style.transform = 'translate(0, 0)';
            }
        });
    });
    
    // Reset particle positions
    hero.addEventListener('mouseleave', function() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            particle.style.transition = 'transform 0.8s ease';
            particle.style.transform = 'translate(0, 0)';
            
            setTimeout(() => {
                particle.style.transition = '';
            }, 800);
        });
    });
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Styling the particle
    const size = Math.random() * 5 + 2;
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = 'rgba(0, 229, 204, 0.2)';
    particle.style.borderRadius = '50%';
    particle.style.transition = 'transform 0.3s ease';
    
    // Random positioning
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Add floating animation
    const animDuration = Math.random() * 15 + 10;
    const animDelay = Math.random() * 5;
    particle.style.animation = `floatParticle ${animDuration}s ${animDelay}s infinite alternate ease-in-out`;
    
    container.appendChild(particle);
    
    return particle;
}

// Adding keyframes for particle floating animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
        }
    }
`;
document.head.appendChild(styleSheet);

// Adding custom cursor for Hero Section
function createCustomCursor() {
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'cursor-outer';
    
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    
    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);
    
    // Add CSS styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .cursor-outer {
            position: fixed;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(0, 229, 204, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            transform: translate(-50%, -50%);
        }
        
        .cursor-inner {
            position: fixed;
            width: 8px;
            height: 8px;
            background-color: rgba(0, 229, 204, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.07s ease;
            transform: translate(-50%, -50%);
        }
        
        .hero a, .hero button {
            cursor: none;
        }
        
        .cursor-hover {
            transform: translate(-50%, -50%) scale(1.5);
            background-color: transparent;
            border-color: rgba(0, 229, 204, 0.2);
        }
        
        .cursor-click {
            transform: translate(-50%, -50%) scale(0.8);
        }
    `;
    document.head.appendChild(styleElement);
    
    // Update cursor position
    document.addEventListener('mousemove', function(e) {
        cursorOuter.style.left = e.clientX + 'px';
        cursorOuter.style.top = e.clientY + 'px';
        
        cursorInner.style.left = e.clientX + 'px';
        cursorInner.style.top = e.clientY + 'px';
    });
    
    // Add hover effects for interactive elements
    const hero = document.querySelector('.hero');
    const interactiveElements = hero.querySelectorAll('a, button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorOuter.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursorOuter.classList.remove('cursor-hover');
        });
    });
    
    // Effect on click
    document.addEventListener('mousedown', function() {
        cursorInner.classList.add('cursor-click');
        cursorOuter.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', function() {
        cursorInner.classList.remove('cursor-click');
        cursorOuter.classList.remove('cursor-click');
    });
}

// Activate custom cursor only in Hero Section
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mouseenter', function() {
        document.body.classList.add('custom-cursor-active');
        createCustomCursor();
    });
    
    hero.addEventListener('mouseleave', function() {
        document.body.classList.remove('custom-cursor-active');
        const cursorOuter = document.querySelector('.cursor-outer');
        const cursorInner = document.querySelector('.cursor-inner');
        
        if (cursorOuter) cursorOuter.remove();
        if (cursorInner) cursorInner.remove();
    });
});

// Function for scroll animation effects
function initScrollAnimations() {
    // Select all elements that need to be animated
    const sections = document.querySelectorAll('section');
    const titles = document.querySelectorAll('.section-header h2, .section-tag, h3');
    const paragraphs = document.querySelectorAll('.section-description, p:not(.hero-description)');
    const buttons = document.querySelectorAll('.btn:not(.hero .btn)');
    const cards = document.querySelectorAll('.problem-card, .pricing-card, .info-card, .testimonial-card, .case-study');
    const problemCards = document.querySelectorAll('.problem-card');
    const processSteps = document.querySelectorAll('.process-step');
    
    // Hero section specific elements
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    
    // Add animation classes
    sections.forEach(section => {
        if (!section.classList.contains('hero')) {
            section.classList.add('fade-in');
        }
    });
    
    titles.forEach(title => {
        title.classList.add('fade-in');
    });
    
    paragraphs.forEach(para => {
        para.classList.add('fade-in');
    });
    
    buttons.forEach(button => {
        button.classList.add('zoom-in');
    });
    
    cards.forEach(card => {
        card.classList.add('fade-in');
    });
    
    // Add special effects for problem cards
    problemCards.forEach((card, index) => {
        card.classList.add('fade-in-stagger');
        card.classList.add(`delay-${(index % 3) * 100}`);
    });
    
    // Add stair-like effects for process steps
    processSteps.forEach((step, index) => {
        step.classList.add('fade-in-left');
        step.classList.add(`delay-${index * 100}`);
    });
    
    // Configure Intersection Observer to trigger animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after the element has become visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-stagger, .zoom-in, .reveal-up').forEach(element => {
        observer.observe(element);
    });
    
    // Observe hero elements specifically
    if (heroTitle) observer.observe(heroTitle);
    if (heroDescription) observer.observe(heroDescription);
    if (heroCta) observer.observe(heroCta);
    
    // Special effects for sections with titles
    document.querySelectorAll('.section-header').forEach(header => {
        const title = header.querySelector('h2');
        const tag = header.querySelector('.section-tag');
        
        if (title) {
            title.classList.add('reveal-up');
        }
        
        if (tag) {
            tag.classList.add('fade-in-left');
        }
    });
} 