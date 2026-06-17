(function () {
    var header, navToggle, navBackdrop, navLinks;
    var scrollProgress, scrollTopBtn;
    var sections, revealElements;

    function initElements() {
        header = document.getElementById('site-header');
        navToggle = document.getElementById('icono-nav');
        navBackdrop = document.getElementById('nav-backdrop');
        navLinks = document.querySelectorAll('#links a');
        scrollProgress = document.getElementById('scroll-progress');
        scrollTopBtn = document.getElementById('scroll-top');
        sections = document.querySelectorAll('#inicio, #sobremi, #estudios, #servicios, #portfolio, #contacto');
        revealElements = document.querySelectorAll('.reveal');
    }

    function closeMenu() {
        if (!header) return;
        header.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('menu-locked');
    }

    function openMenu() {
        header.classList.add('menu-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.classList.add('menu-locked');
    }

    function toggleMenu() {
        if (header.classList.contains('menu-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function setActiveNav(id) {
        navLinks.forEach(function (link) {
            var match = link.getAttribute('data-section') === id;
            link.classList.toggle('seleccionado', match);
        });
    }

    function updateScrollUI() {
        var scrollY = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }

        if (header) {
            header.classList.toggle('scrolled', scrollY > 60);
        }

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollY > 250);
        }
    }

    function efectoHabilidades() {
        var skills = document.getElementById('skills');
        if (!skills) return;
        var distancia = window.innerHeight - skills.getBoundingClientRect().top;
        if (distancia >= 100) {
            document.getElementById('html').classList.add('barra-progreso1');
            document.getElementById('js').classList.add('barra-progreso2');
            document.getElementById('bd').classList.add('barra-progreso3');
            document.getElementById('ps').classList.add('barra-progreso4');
            document.getElementById('te').classList.add('barra-progreso5');
        }
    }

    function lazyLoadPreviews() {
        var frames = document.querySelectorAll('.preview-frame iframe[data-src]');
        if (!frames.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var iframe = entry.target;
                var container = iframe.parentElement;
                iframe.src = iframe.getAttribute('data-src');
                iframe.removeAttribute('data-src');
                iframe.addEventListener('load', function () {
                    container.classList.add('is-loaded');
                    fitPreviewFrames();
                });
                setTimeout(function () {
                    container.classList.add('is-loaded');
                    fitPreviewFrames();
                }, 6000);
                observer.unobserve(iframe);
            });
        }, { rootMargin: '150px' });

        frames.forEach(function (frame) { observer.observe(frame); });
    }

    var PREVIEW_WIDTH = 1440;
    var PREVIEW_HEIGHT = 960;

    function fitPreviewFrames() {
        document.querySelectorAll('.preview-frame').forEach(function (frame) {
            var iframe = frame.querySelector('iframe');
            if (!iframe) return;

            var scale = frame.clientWidth / PREVIEW_WIDTH;
            if (scale <= 0) return;

            frame.style.height = (PREVIEW_HEIGHT * scale) + 'px';
            iframe.style.width = PREVIEW_WIDTH + 'px';
            iframe.style.height = PREVIEW_HEIGHT + 'px';
            iframe.style.transform = 'scale(' + scale + ')';
        });
    }

    function initPreviewResizeObserver() {
        if (typeof ResizeObserver === 'undefined') return;

        var observer = new ResizeObserver(function () {
            fitPreviewFrames();
        });

        document.querySelectorAll('.preview-frame').forEach(function (frame) {
            observer.observe(frame);
        });
    }

    var resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fitPreviewFrames, 100);
    }

    function initNavObserver() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveNav(entry.target.id);
                }
            });
        }, {
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function initRevealObserver() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.id === 'portfolio') {
                        fitPreviewFrames();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    function bindEvents() {
        if (navToggle) {
            navToggle.addEventListener('click', toggleMenu);
        }

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        initThemeToggle();
        initContactForm();

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        window.addEventListener('scroll', function () {
            updateScrollUI();
            efectoHabilidades();
        }, { passive: true });

        window.addEventListener('resize', onResize, { passive: true });
    }

    function initThemeToggle() {
        var toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggle.setAttribute('aria-label', 'Cambiar a modo claro');
            } else {
                document.documentElement.removeAttribute('data-theme');
                toggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
            }
            localStorage.setItem('theme', theme);
        }

        toggle.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    function initContactForm() {
        var form = document.getElementById('formulario-contacto');
        var status = document.getElementById('form-status');
        var btn = document.getElementById('btn-enviar');
        var statusTimer = null;
        if (!form) return;

        function clearStatusMessage() {
            if (statusTimer) {
                clearTimeout(statusTimer);
                statusTimer = null;
            }
            status.textContent = '';
            status.className = 'form-status';
        }

        function showTemporaryMessage(text, type, duration) {
            clearStatusMessage();
            status.textContent = text;
            status.className = 'form-status ' + type;

            statusTimer = setTimeout(function () {
                status.classList.add('fade-out');
                setTimeout(function () {
                    clearStatusMessage();
                    status.classList.remove('fade-out');
                }, 400);
            }, duration || 5000);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btnText = btn.querySelector('.btn-enviar-text');
            var originalText = btnText ? btnText.textContent : 'Enviar mensaje';

            clearStatusMessage();
            btn.disabled = true;
            if (btnText) btnText.textContent = 'Enviando...';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('Error al enviar');
                    form.reset();
                    showTemporaryMessage('¡Mensaje enviado con éxito! Te responderé pronto.', 'success', 5000);
                })
                .catch(function () {
                    showTemporaryMessage('No se pudo enviar. Intenta de nuevo o escríbeme por WhatsApp.', 'error', 6000);
                })
                .finally(function () {
                    btn.disabled = false;
                    if (btnText) btnText.textContent = originalText;
                });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initElements();
        bindEvents();
        lazyLoadPreviews();
        initNavObserver();
        initRevealObserver();
        updateScrollUI();
        fitPreviewFrames();
        initPreviewResizeObserver();
    });
})();
