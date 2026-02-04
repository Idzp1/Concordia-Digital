// ============================================
// INICIALIZACIÓN DE ANIMACIONES AOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
});

// ============================================
// MENÚ RESPONSIVE
// ============================================
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

function closeMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    nav.classList.remove('active');
    toggle.classList.remove('active');
}

// Cerrar menú cuando se hace clic fuera de él
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('header');
    
    if (!header.contains(event.target) && nav.classList.contains('active')) {
        closeMenu();
    }
});

// ============================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a[href^="#"], a.cta-button[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil si está abierto
                closeMenu();
            }
        });
    });
});

// ============================================
// BOTÓN VOLVER ARRIBA (SCROLL TO TOP)
// ============================================
const scrollToTopButton = document.getElementById('scrollToTop');

// Mostrar/ocultar botón según el scroll
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

// Funcionalidad del botón
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// FAQ EXPANDIBLE (ACCORDION)
// ============================================
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const wasActive = faqItem.classList.contains('active');
    
    // Cerrar todas las preguntas
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    
    // Si no estaba activa, abrirla
    if (!wasActive) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

// También permitir abrir/cerrar con Enter o Espacio
document.addEventListener('DOMContentLoaded', function() {
    const faqButtons = document.querySelectorAll('.faq-question');
    
    faqButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
});

// ============================================
// FORMULARIO DE CONTACTO CON VALIDACIÓN
// ============================================
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Obtener valores del formulario
    const formData = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        service: form.service.value,
        message: form.message.value.trim()
    };
    
    // Validación básica
    if (!formData.name || !formData.phone || !formData.message) {
        showMessage('Por favor completa todos los campos requeridos.', 'error');
        return;
    }
    
    // Validar teléfono (simple: solo números y guiones)
    const phonePattern = /^[\d\-\s\(\)]+$/;
    if (!phonePattern.test(formData.phone)) {
        showMessage('Por favor ingresa un número de teléfono válido.', 'error');
        return;
    }
    
    // Validar email si se proporcionó
    if (formData.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showMessage('Por favor ingresa un email válido.', 'error');
            return;
        }
    }
    
    // Deshabilitar botón mientras se procesa
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Simular envío (reemplaza esto con tu lógica de envío real)
    setTimeout(() => {
        // AQUÍ DEBES IMPLEMENTAR EL ENVÍO REAL
        // Opciones:
        // 1. EmailJS (recomendado para este caso)
        // 2. Formspree
        // 3. Tu propio backend
        
        // Por ahora, mostrar mensaje de éxito y preparar WhatsApp
        const whatsappMessage = `Hola! Soy ${formData.name}. ${formData.message}. Mi teléfono es: ${formData.phone}`;
        const whatsappURL = `https://wa.me/526691517346?text=${encodeURIComponent(whatsappMessage)}`;
        
        showMessage('¡Mensaje preparado! Te redirigiremos a WhatsApp...', 'success');
        
        // Redirigir a WhatsApp después de 2 segundos
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        }, 2000);
        
    }, 1000);
}

function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// ============================================
// INTEGRACIÓN CON EMAILJS (OPCIONAL)
// ============================================
// Si quieres usar EmailJS, descomenta y configura lo siguiente:
/*
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Configuración de EmailJS
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
        .then(function(response) {
            showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        }, function(error) {
            showMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        });
}
*/

// ============================================
// INTEGRACIÓN CON FORMSPREE (OPCIONAL)
// ============================================
// Si quieres usar Formspree, usa esto:
/*
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            form.reset();
        } else {
            throw new Error('Error en el envío');
        }
    })
    .catch(error => {
        showMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    });
}
*/

// ============================================
// ANIMACIÓN DE NÚMEROS (OPCIONAL)
// Para animar los números de las estadísticas
// ============================================
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Ejecutar animación cuando las estadísticas sean visibles
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const text = num.textContent;
                if (text.includes('%')) {
                    const value = parseInt(text);
                    num.textContent = '0%';
                    setTimeout(() => {
                        animateNumber(num, value);
                        setTimeout(() => {
                            num.textContent = text; // Restaurar formato original
                        }, 2000);
                    }, 300);
                }
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar las estadísticas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.dna-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// ============================================
// LAZY LOADING DE IMÁGENES (SI LAS AGREGAS)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback para navegadores antiguos
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ============================================
// PREVENIR SPAM EN FORMULARIO
// ============================================
let lastSubmitTime = 0;
const submitCooldown = 5000; // 5 segundos

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const now = Date.now();
            if (now - lastSubmitTime < submitCooldown) {
                e.preventDefault();
                showMessage('Por favor espera unos segundos antes de enviar otro mensaje.', 'error');
                return;
            }
            lastSubmitTime = now;
        });
    }
});

// ============================================
// DETECTAR MODO OSCURO DEL SISTEMA (FUTURO)
// ============================================
// Si en el futuro quieres agregar un modo claro
/*
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (prefersDarkScheme.matches) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.add('light-mode');
}

// Escuchar cambios
prefersDarkScheme.addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.replace('light-mode', 'dark-mode');
    } else {
        document.body.classList.replace('dark-mode', 'light-mode');
    }
});
*/

// ============================================
// CONSOLA - Mensaje para desarrolladores
// ============================================
console.log('%c¡Hola Desarrollador! 👋', 'font-size: 20px; font-weight: bold; color: #00ff00;');
console.log('%cSi encuentras algún bug o tienes sugerencias, ¡contáctanos!', 'font-size: 14px; color: #888;');
console.log('%cConcordia Digital Center - Hecho con ❤️ en Concordia, Sinaloa', 'font-size: 12px; color: #666;');
