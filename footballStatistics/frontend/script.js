// Football Stats — JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Мобильное меню
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ========================================
    // Плавный скролл к якорям
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========================================
    // Анимация прогресс-баров при скролле
    // ========================================
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.prob-fill');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.prediction-card').forEach(card => {
        progressObserver.observe(card);
    });
    
    // ========================================
    // Табы на странице матча
    // ========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок
            tabButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Скрываем все контенты
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем нужный контент
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // ========================================
    // Фильтрация матчей
    // ========================================
    const leagueFilter = document.getElementById('leagueFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const matchCards = document.querySelectorAll('.match-card');
    
    function filterMatches() {
        const selectedLeague = leagueFilter ? leagueFilter.value : 'all';
        const selectedStatus = statusFilter ? statusFilter.value : 'all';
        const selectedDate = dateFilter ? dateFilter.value : '';
        
        matchCards.forEach(card => {
            let show = true;
            
            // Фильтр по лиге
            if (selectedLeague !== 'all') {
                const leagueName = card.querySelector('.league-name');
                if (leagueName && !leagueName.textContent.includes(selectedLeague)) {
                    show = false;
                }
            }
            
            // Фильтр по статусу
            if (selectedStatus !== 'all') {
                if (selectedStatus === 'live' && !card.classList.contains('live')) {
                    show = false;
                }
                if (selectedStatus === 'finished' && card.classList.contains('live')) {
                    show = false;
                }
            }
            
            // Фильтр по дате (упрощенно)
            if (selectedDate) {
                const matchDate = card.getAttribute('data-date');
                if (matchDate && matchDate !== selectedDate) {
                    show = false;
                }
            }
            
            // Показываем/скрываем карточку
            if (show) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (leagueFilter) leagueFilter.addEventListener('change', filterMatches);
    if (statusFilter) statusFilter.addEventListener('change', filterMatches);
    if (dateFilter) dateFilter.addEventListener('change', filterMatches);
    
    // ========================================
    // Поиск команд
    // ========================================
    const searchInput = document.getElementById('teamSearch');
    const teamCards = document.querySelectorAll('.team-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            teamCards.forEach(card => {
                const teamName = card.querySelector('.team-card-name').textContent.toLowerCase();
                const teamLeague = card.querySelector('.team-card-league').textContent.toLowerCase();
                
                if (teamName.includes(searchTerm) || teamLeague.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // ========================================
    // Валидация форм
    // ========================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                // Сбрасываем предыдущие ошибки
                input.classList.remove('error');
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                
                // Проверяем поле
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Добавляем сообщение об ошибке
                    const error = document.createElement('span');
                    error.className = 'error-message';
                    error.textContent = 'Это поле обязательно';
                    error.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block;';
                    input.parentElement.appendChild(error);
                }
                
                // Проверка email
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                        
                        const error = document.createElement('span');
                        error.className = 'error-message';
                        error.textContent = 'Некорректный email';
                        error.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block;';
                        input.parentElement.appendChild(error);
                    }
                }
                
                // Проверка пароля
                if (input.type === 'password' && input.value && input.value.length < 6) {
                    isValid = false;
                    const error = document.createElement('span');
                    error.className = 'error-message';
                    error.textContent = 'Минимум 6 символов';
                    error.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block;';
                    input.parentElement.appendChild(error);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // ========================================
    // Переключение пароля (показать/скрыть)
    // ========================================
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // ========================================
    // Анимация чисел (счетчики)
    // ========================================
    const animateValue = function(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Запуск анимации при появлении в viewport
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const text = counter.textContent;
                    const endValue = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/\d/g, '');
                    counter.dataset.suffix = suffix;
                    animateValue(counter, 0, endValue, 2000);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        counterObserver.observe(heroStats);
    }
    
    // ========================================
    // Уведомления (Toast)
    // ========================================
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--danger-color)'};
            color: white;
            padding: 15px 25px;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
    
    // ========================================
    // Подтверждение действий
    // ========================================
    window.confirmAction = function(message) {
        return confirm(message);
    };
    
    // ========================================
    // Загрузка данных (имитация API)
    // ========================================
    window.fetchData = async function(endpoint) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Пример данных
        const mockData = {
            '/api/matches': [
                { id: 1, homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 2, awayScore: 1, league: 'Premier League', status: 'live' },
                { id: 2, homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 1, awayScore: 0, league: 'La Liga', status: 'live' },
            ],
            '/api/teams': [
                { id: 1, name: 'Manchester City', league: 'Premier League', points: 70 },
                { id: 2, name: 'Liverpool', league: 'Premier League', points: 66 },
            ]
        };
        
        return mockData[endpoint] || [];
    };
    
    // ========================================
    // Параллакс эффект для hero секции
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight);
            }
        });
    }
    
    // ========================================
    // Аккордеон для деталей
    // ========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Закрываем все аккордеоны
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = '0';
            });
            
            // Открываем текущий если не был активен
            if (!isActive) {
                this.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    // ========================================
    // Копирование в буфер
    // ========================================
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Скопировано в буфер обмена!', 'success');
        } catch (err) {
            showToast('Ошибка копирования', 'error');
        }
    };
    
    // ========================================
    // Форматирование даты
    // ========================================
    window.formatDate = function(dateString, locale = 'ru-RU') {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(locale, options);
    };
    
    // ========================================
    // Инициализация завершена
    // ========================================
    console.log('⚽ Football Stats initialized');
});

// ========================================
// CSS для динамических элементов
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .tab-content {
        display: none;
    }
    
    .tab-content.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }
    
    .error {
        border-color: #ef4444 !important;
    }
    
    .accordion-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
`;
document.head.appendChild(style);
