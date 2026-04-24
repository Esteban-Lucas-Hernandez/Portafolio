document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true
        });
    }

    // 2. Apple-style Text Reveal on Scroll logic using GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const revealText = document.querySelector('.reveal-text');
        
        if (revealText) {
            // Extract the text, split into words, and wrap each in a span
            const words = revealText.innerText.split(/\s+/);
            revealText.innerHTML = '';
            
            words.forEach(word => {
                if (word.trim() === '') return;
                const span = document.createElement('span');
                span.innerText = word + ' ';
                span.style.color = '#424245'; // Empieza oscuro
                revealText.appendChild(span);
            });

            // Animate all spans sequentially over the entire pinned scroll height
            gsap.to('.reveal-text span', {
                scrollTrigger: {
                    trigger: '.apple-about',
                    start: 'top top',      // Cuando la sección toca el borde superior
                    end: 'bottom bottom',  // Cuando termina de hacer scroll y se des-pinea
                    scrub: 1,              // Suavidad de 1 segundo al soltar la rueda
                },
                color: '#f5f5f7', // Color iluminado
                stagger: 0.1      // Animación palabra por palabra
            });
        }
    }

    // 3. Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && cursorFollower && window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Add a slight delay for the follower
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Hover effects for links and buttons
        const interactives = document.querySelectorAll('a, button, .bento-card, .floating-planet');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // 5. 3D Tilt Effect for Bento Cards
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 6. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                duration: 0.3,
                x: x * 0.4,
                y: y * 0.4,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                duration: 0.7,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 7. Hero Text Mouse Parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // 8. Update Footer Year Automatically
    const footerYears = document.querySelectorAll('.copyright');
    const currentYear = new Date().getFullYear();
    footerYears.forEach(element => {
        if (element.innerHTML.includes('2026')) {
            element.innerHTML = element.innerHTML.replace('2026', currentYear);
        }
    });

});
