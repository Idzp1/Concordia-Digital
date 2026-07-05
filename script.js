// ============================================
// CONCORDIA DIGITAL — script.js v3.0
// ============================================

const CONFIG = {
    WHATSAPP_NUMBER: '526691517346',
    TOAST_DURATION: 3500,
    SUBMIT_COOLDOWN: 5000
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    hideLoader();
    initializeAOS();
    updateBusinessStatus();
    initScrollBehaviors();
    initSmoothScroll();
    initReadingProgress();
    initQuickChips();
    initPricesCarousel();
    logWelcomeMessage();
}

// ============================================
// LOADING SCREEN
// ============================================
function hideLoader() {
    window.addEventListener('load', () => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 600);
        }
    });
}

// ============================================
// BUSINESS STATUS
// ============================================
function updateBusinessStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    if (!statusIndicator) return;

    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const h = now.getHours() + now.getMinutes() / 60;
    const isOpen = (day >= 1 && day <= 6) && (h >= 9 && h < 18);

    const dot = statusIndicator.querySelector('.status-dot');
    const txt = statusIndicator.querySelector('.status-text');

    if (isOpen) {
        statusIndicator.classList.add('open');
        txt.textContent = 'Abierto';
    } else {
        statusIndicator.classList.remove('open');
        txt.textContent = 'Cerrado';
    }

    setTimeout(updateBusinessStatus, 60000);
}

// ============================================
// AOS ANIMATIONS
// ============================================
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
}

// ============================================
// PROMO BAR
// ============================================
function closePromoBar() {
    const bar = document.getElementById('promoBar');
    const hoursBanner = document.getElementById('hoursBanner');
    const header = document.getElementById('mainHeader');
    if (bar) {
        bar.classList.add('hidden');
        // Adjust header positions
        if (hoursBanner) hoursBanner.style.top = '0px';
        if (header) header.style.top = '30px';
        sessionStorage.setItem('promoClosed', '1');
    }
}

// On load, check if promo was closed
(function checkPromo() {
    if (sessionStorage.getItem('promoClosed')) {
        const bar = document.getElementById('promoBar');
        const hoursBanner = document.getElementById('hoursBanner');
        const header = document.getElementById('mainHeader');
        if (bar) bar.classList.add('hidden');
        if (hoursBanner) hoursBanner.style.top = '0px';
        if (header) header.style.top = '30px';
    }
})();

// ============================================
// READING PROGRESS BAR
// ============================================
function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });
}

// ============================================
// SCROLL BEHAVIORS (header, scroll-to-top)
// ============================================
function initScrollBehaviors() {
    const header = document.getElementById('mainHeader');
    const scrollTopBtn = document.getElementById('scrollToTop');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const current = window.scrollY;

        // Header scrolled state
        if (header) {
            header.classList.toggle('scrolled', current > 80);
        }

        // Scroll to top button
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', current > 400);
        }

        lastScroll = current;
    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();

            const headerOffset = 90;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMenu();
        });
    });
}

// ============================================
// QUICK CHIPS → scroll to service card
// ============================================
let pricesIndex = 0;

function updatePricesCarousel() {
    const track = document.getElementById('pricesTrack');
    if (!track) return;
    const cards = track.querySelectorAll('.price-card');
    track.style.transform = `translateX(-${pricesIndex * 100}%)`;

    const dots = document.querySelectorAll('.prices-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === pricesIndex));
}

function scrollPrices(direction) {
    const track = document.getElementById('pricesTrack');
    if (!track) return;
    const total = track.querySelectorAll('.price-card').length;
    pricesIndex = (pricesIndex + direction + total) % total;
    updatePricesCarousel();
}

function goToPrice(index) {
    pricesIndex = index;
    updatePricesCarousel();
}

function initPricesCarousel() {
    const track = document.getElementById('pricesTrack');
    const dotsWrap = document.getElementById('pricesDots');
    if (!track || !dotsWrap) return;
    const total = track.querySelectorAll('.price-card').length;

    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'prices-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ver precio ${i + 1}`);
        dot.addEventListener('click', () => goToPrice(i));
        dotsWrap.appendChild(dot);
    }
}

function initQuickChips() {
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', function (e) {
            e.preventDefault();
            const serviceId = this.dataset.service;
            const servicesSection = document.getElementById('servicios');
            if (!servicesSection) return;

            // Scroll to services section
            const top = servicesSection.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'smooth' });

            // After scroll, highlight the matching card
            setTimeout(() => {
                highlightServiceByType(serviceId);
            }, 600);
        });
    });
}

function highlightServiceByType(serviceType) {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const cta = card.querySelector('.service-cta');
        if (cta && cta.getAttribute('onclick') && cta.getAttribute('onclick').includes(serviceType)) {
            // Open this card
            if (!card.classList.contains('active')) {
                toggleService(card);
            }
            // Brief highlight
            card.style.borderColor = 'rgba(255,255,255,0.5)';
            card.style.transition = 'border-color 0.3s ease';
            setTimeout(() => { card.style.borderColor = ''; }, 1500);
        }
    });
}

// ============================================
// NAVIGATION MENU
// ============================================
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    const isActive = nav.classList.contains('active');

    nav.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', !isActive);
    document.body.style.overflow = isActive ? '' : 'hidden';
}

function closeMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav) return;
    nav.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Close on outside click
document.addEventListener('click', function (e) {
    const nav = document.getElementById('mainNav');
    const header = document.querySelector('header');
    if (nav && header && !header.contains(e.target) && nav.classList.contains('active')) {
        closeMenu();
    }
});

// Close on Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
});

// ============================================
// SERVICE CARDS (accordion)
// ============================================
function toggleService(card) {
    const wasActive = card.classList.contains('active');

    // Close all
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-expanded', 'false');
    });

    if (!wasActive) {
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
    }
}

// Keyboard support for service cards
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleService(this);
            }
        });
    });
});

// ============================================
// UBICACIÓN (mapa expandible)
// ============================================
function toggleLocation(el) {
    const isActive = el.classList.contains('active');
    el.classList.toggle('active');
    el.setAttribute('aria-expanded', !isActive);
}

document.addEventListener('DOMContentLoaded', function () {
    const locEl = document.querySelector('.channel-loc');
    if (locEl) {
        locEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLocation(this);
            }
        });
    }
});

window.toggleLocation = toggleLocation;

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFAQ(button) {
    const item = button.parentElement;
    const wasActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
    });

    if (!wasActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

// ============================================
// PRE-FILL SERVICE FROM CARD CTA
// ============================================
function prefillService(serviceValue) {
    const select = document.getElementById('service');
    if (select) {
        select.value = serviceValue;
        // Trigger a subtle visual cue
        select.style.borderColor = 'rgba(255,255,255,0.6)';
        setTimeout(() => { select.style.borderColor = ''; }, 1500);
    }
    // Scroll to contact form
    const contact = document.getElementById('contacto');
    if (contact) {
        setTimeout(() => {
            const top = contact.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
    }
}

// ============================================
// CONTACT FORM
// ============================================
let lastSubmitTime = 0;

function handleFormSubmit(event) {
    event.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < CONFIG.SUBMIT_COOLDOWN) {
        showToast('Espera unos segundos antes de enviar otro mensaje.', 'error');
        return;
    }

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');

    const data = {
        name: form.name.value.trim(),
        phone: form.phone ? form.phone.value.trim() : '',
        service: form.service.value,
        message: form.message.value.trim()
    };

    // Basic validation
    if (!data.name || !data.message) {
        showMessage('Por favor completa tu nombre y el mensaje.', 'error');
        shakeElement(submitBtn);
        return;
    }

    // Disable button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Preparando mensaje...';
    }

    setTimeout(() => {
        const serviceName = data.service
            ? form.service.options[form.service.selectedIndex].text.replace(/[🔧🛡️💿🎧💾📡❓]\s*/g, '')
            : 'No especificado';

        const msg = [
            `*Nuevo mensaje desde concordiadigital.com* 🌐`,
            ``,
            `👤 *Nombre:* ${data.name}`,
            data.phone ? `📱 *Teléfono/WhatsApp:* ${data.phone}` : null,
            `🔧 *Servicio:* ${serviceName}`,
            ``,
            `💬 *Mensaje:*`,
            data.message
        ].filter(Boolean).join('\n');

        const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

        showMessage('¡Listo! Abriendo WhatsApp con tu mensaje...', 'success');
        showToast('Redirigiendo a WhatsApp 🚀', 'success');
        lastSubmitTime = Date.now();

        setTimeout(() => {
            window.open(url, '_blank');
            form.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Enviar por WhatsApp';
            }
            setTimeout(() => {
                const fm = document.getElementById('formMessage');
                if (fm) fm.className = 'form-message';
            }, 3000);
        }, 1200);

    }, 800);
}

function showMessage(msg, type) {
    const el = document.getElementById('formMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = `form-message ${type}`;
    setTimeout(() => { el.className = 'form-message'; }, 5000);
}

function shakeElement(el) {
    if (!el) return;
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`;
document.head.appendChild(shakeStyle);

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, CONFIG.TOAST_DURATION);
}

// ============================================
// SCROLL-BASED NUMBER ANIMATION
// ============================================
function animateNumber(el, target, suffix = '', duration = 1800) {
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-number').forEach(num => {
            const original = num.textContent;
            if (original.includes('%')) {
                const val = parseInt(original);
                animateNumber(num, val, '%');
            } else if (original.includes('/')) {
                // Skip 24/7
            } else if (original === '0') {
                // Already 0, just pulse
                num.style.transform = 'scale(1.2)';
                setTimeout(() => { num.style.transform = ''; num.style.transition = 'transform 0.3s ease'; }, 300);
            }
        });
        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsEl = document.querySelector('.dna-stats');
    if (statsEl) statsObserver.observe(statsEl);
});

// ============================================
// ONLINE / OFFLINE DETECTION
// ============================================
window.addEventListener('online', () => showToast('Conexión restaurada ✅', 'success'));
window.addEventListener('offline', () => showToast('Sin conexión a internet ⚠️', 'error'));

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('using-keyboard');
});
document.addEventListener('mousedown', () => document.body.classList.remove('using-keyboard'));

// ============================================
// KONAMI CODE EASTER EGG 🎮
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', e => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        showToast('🎉 ¡Código secreto encontrado! Eres un experto.', 'success');
        document.body.style.transform = 'rotate(360deg)';
        document.body.style.transition = 'transform 1.5s ease';
        setTimeout(() => {
            document.body.style.transform = '';
            document.body.style.transition = '';
        }, 1600);
        konamiCode = [];
    }
});

// ============================================
// DEVELOPER CONSOLE
// ============================================
function logWelcomeMessage() {
    console.log('%c Concordia Digital v3.0 ', 'background:#fff;color:#000;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px;');
    console.log('%cHecho con ❤️ en Concordia, Sinaloa, México', 'color:#888;font-size:12px;');
}

// ============================================
// GLOBAL EXPORTS
// ============================================
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.toggleFAQ = toggleFAQ;
window.toggleService = toggleService;
window.prefillService = prefillService;
window.handleFormSubmit = handleFormSubmit;
window.showToast = showToast;
window.closePromoBar = closePromoBar;
