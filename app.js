document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initProjectFiltering();
    initContactForm();
    initSpotlight();
    initAppleStyleEffects();
    initHeroTyping();
});

// 1. DYNAMIC SPOTLIGHT FUNCTION (Safe for all pages)
function initSpotlight() {
    // Check if spotlight exists on this page
    const sTitle = document.getElementById('spotlight-title');
    const sDesc = document.getElementById('spotlight-desc');
    const sCat = document.getElementById('spotlight-cat');
    const sTech = document.getElementById('spotlight-tech');
    const sImg = document.getElementById('spotlight-img');
    const sLink = document.getElementById('spotlight-link');
    const pFill = document.querySelector('.progress-fill');

    // If elements don't exist (e.g., on games.html), stop immediately
    if (!sTitle || !sImg) return;

    // Spotlight Data
    const spotlightProjects = [
        {
            title: "Spreadlink",
            category: "Application",
            desc: "A global social media platform connecting creators with seamless multi-network sharing.",
            tech: "Android • Java • Firebase",
            img: "spreadlink.png",
            link: "spreadlink.html"
        },
        {
            title: "Music Player online",
            category: "Website",
            desc: "Minimalist music player with clean controls and modern design.",
            tech: "Web • Java • JS",
            img: "music-player.png",
            link: "web.html"
        },
        {
            title: "Formula 1 Model",
            category: "3D Design",
            desc: "Highly detailed Formula 1 racing car model featuring authentic aerodynamics and materials.",
            tech: "Blender • 3D Modeling • Texturing",
            img: "car1.jpg",
            link: "3dmodels.html"
        },
        {
            title: "Netflix Clone",
            category: "Web Development",
            desc: "A responsive streaming UI mirroring Netflix’s browsing experience with pixel-perfect design.",
            tech: "HTML • CSS • JavaScript",
            img: "netflix.png",
            link: "web.html"
        },
        {
            title: "Car Racing Game",
            category: "Game Development",
            desc: "An engaging mobile car racing game featuring realistic physics and 3D environments.",
            tech: "Unity • C# • Mobile",
            img: "carimg1.png",
            link: "games.html"
        }
    ];

    let currentSpotlight = 0;

    function rotateSpotlight() {
        // Pick next project
        const p = spotlightProjects[currentSpotlight];

        // 1. Reset Animations (Fade Out)
        sTitle.classList.remove('reveal-text');
        sDesc.classList.remove('reveal-text');
        sImg.classList.remove('zoom-active');

        // Reset Progress Bar Animation (Force Reflow)
        if(pFill) {
            pFill.style.animation = 'none';
            pFill.offsetHeight; /* Trigger reflow */
            pFill.style.animation = 'progress 4s linear infinite';
        }

        // Trigger text reflow
        void sTitle.offsetWidth;

        // 2. Update Content
        sTitle.textContent = p.title;
        sDesc.textContent = p.desc;
        sCat.textContent = p.category;
        sTech.textContent = p.tech;
        sImg.src = p.img;
        if(sLink) sLink.href = p.link;

        // 3. Add Animations Back (Fade In)
        sTitle.classList.add('reveal-text');
        sDesc.classList.add('reveal-text');
        setTimeout(() => sImg.classList.add('zoom-active'), 50);

        // 4. Increment Index
        currentSpotlight = (currentSpotlight + 1) % spotlightProjects.length;
    }

    // Start Loop
    rotateSpotlight(); 
    setInterval(rotateSpotlight, 4000);
}

// 2. NAVIGATION
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar background on scroll
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(5, 5, 5, 0.95)';
                navbar.style.borderBottom = '1px solid #333';
            } else {
                navbar.style.background = 'rgba(5, 5, 5, 0.7)';
                navbar.style.borderBottom = '1px solid transparent';
            }
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(section => navObserver.observe(section));
    }
}

// 3. SCROLL ANIMATIONS
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .experience-card, .project-card, .skill-item');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on index of batch
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// 4. PROJECT FILTERING
function initProjectFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (categoryBtns.length === 0) return;

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

// 5. CONTACT FORM
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');

    // Input Focus Effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (!input.value) input.parentElement.classList.remove('focused');
        });
    });

    // Submit Logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        
        // Opens default mail client
        window.open(`mailto:roycenoel2001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    });
}

// 6. APPLE STYLE EFFECTS (Ripple & Hover)
function initAppleStyleEffects() {
    // Button Ripple
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
            circle.classList.add('ripple');

            const ripple = button.getElementsByClassName('ripple')[0];
            if (ripple) ripple.remove();

            button.appendChild(circle);
        });
    });

    // Keyboard Navigation Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
    });
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // Page Load Animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// 7. HERO TYPING EFFECT
function initHeroTyping() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const roles = [
        "Developer & Designer",
        "AI explorer",
        "Full Stack Developer",
        "UI/UX Designer"
        
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            tagline.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            tagline.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 3000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start loop after initial 3s delay
    setTimeout(type, 3000);
}