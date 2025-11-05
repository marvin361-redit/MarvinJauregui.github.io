// ==================== CONFIGURACIÓN ====================
const config = {
    animationDuration: 1000,
    scrollThreshold: 100,
    observerOptions: {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    }
};

// ==================== NAVEGACIÓN ====================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.init();
    }

    init() {
        this.handleScroll();
        this.setupSmoothScroll();
        this.setupMobileMenu();
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.pageYOffset > config.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = this.navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Cerrar menú móvil si está abierto
                    if (this.navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
}

// ==================== ANIMACIONES AL SCROLL ====================
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            config.observerOptions
        );
        this.init();
    }

    init() {
        const elements = document.querySelectorAll('.expertise-item, .goal-item');
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ==================== EFECTO PARALLAX HERO ====================
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }

    init() {
        if (!this.hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                this.hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                this.hero.style.opacity = 1 - (scrolled / 700);
            }
        });
    }
}

// ==================== CONTADOR ANIMADO ====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ==================== FORMULARIO DE CONTACTO ====================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Aquí puedes integrar con servicios como Formspree, EmailJS, etc.
        console.log('Formulario enviado:', formData);

        // Simulación de envío
        this.showNotification('¡Mensaje enviado con éxito! 🚀', 'success');
        this.form.reset();

        // Ejemplo con Formspree (descomentar y agregar tu endpoint):
        /*
        try {
            const response = await fetch('https://formspree.io/f/TU_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('¡Mensaje enviado con éxito! 🚀', 'success');
                this.form.reset();
            } else {
                throw new Error('Error al enviar');
            }
        } catch (error) {
            this.showNotification('Error al enviar el mensaje. Intenta de nuevo.', 'error');
        }
        */
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'rgba(167, 139, 250, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ==================== CURSOR PERSONALIZADO (OPCIONAL) ====================
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        // Solo en dispositivos con mouse
        if (!('ontouchstart' in window)) {
            this.createCursor();
            this.setupEventListeners();
        }
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            width: 10px;
            height: 10px;
            border: 2px solid rgba(167, 139, 250, 0.8);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;

        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'custom-cursor-follower';
        this.cursorFollower.style.cssText = `
            width: 40px;
            height: 40px;
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.3s ease;
            display: none;
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.display = 'block';
            this.cursorFollower.style.display = 'block';
            
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;

            setTimeout(() => {
                this.cursorFollower.style.left = `${e.clientX - 20}px`;
                this.cursorFollower.style.top = `${e.clientY - 20}px`;
            }, 100);
        });

        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursorFollower.style.transform = 'scale(1.5)';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ==================== EASTER EGG - KONAMI CODE ====================
class EasterEgg {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.userInput = [];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.checkCode(e));
    }

    checkCode(e) {
        this.userInput.push(e.key);
        this.userInput = this.userInput.slice(-this.konamiCode.length);

        if (this.userInput.join('') === this.konamiCode.join('')) {
            this.activateEasterEgg();
        }
    }

    activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 ¡Encontraste el Easter Egg! Eres un verdadero geek.');
        }, 2000);
    }
}

// ==================== MENSAJES EN CONSOLA ====================
class ConsoleMessages {
    constructor() {
        this.init();
    }

    init() {
        const styles = [
            'color: #a78bfa',
            'font-size: 20px',
            'font-weight: bold',
            'text-shadow: 2px 2px 0px rgba(0,0,0,0.2)'
        ].join(';');

        console.log('%c¡Hola Developer! 👋', styles);
        console.log('%c¿Curioseando el código? Me gusta tu estilo 😎', 'color: #888; font-size: 14px;');
        console.log('%c¡Trabajemos juntos! Contáctame: Marvindior361@email.com', 'color: #a78bfa; font-size: 14px;');
        console.log('%cTip: Prueba el Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) 🎮', 'color: #666; font-size: 12px; font-style: italic;');
    }
}

// ==================== DETECCIÓN DE VIEWPORT ====================
class ViewportDetector {
    constructor() {
        this.updateViewportHeight();
        window.addEventListener('resize', () => this.updateViewportHeight());
    }

    updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// ==================== LAZY LOADING DE IMÁGENES ====================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ==================== INICIALIZACIÓN ====================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Componentes esenciales
        new Navigation();
        new ScrollAnimations();
        new ParallaxEffect();
        new ContactForm();
        new ViewportDetector();
        new LazyLoader();

        // Componentes opcionales
        new CounterAnimation();
        new ConsoleMessages();
        new EasterEgg();
        
        // Cursor personalizado (comentar si no lo quieres)
        // new CustomCursor();

        // Ocultar loader si existe
        this.hideLoader();
    }

    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 300);
            }, 500);
        }
    }
}

const app = new App();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Navigation, ContactForm };
}