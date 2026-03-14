// ===== НОВЫЙ КОД ДЛЯ АНИМАЦИИ ОТКРЫТИЯ КЕЙСОВ =====
(function() {
    // Ждём загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaseAnimation);
    } else {
        initCaseAnimation();
    }

    function initCaseAnimation() {
        // Используем правильный ID страницы деталей кейса
        const caseDetailPage = document.getElementById('case-detail-page');
        if (!caseDetailPage) {
            console.log('Страница деталей кейса не найдена');
            return;
        }

        // Создаём контейнер для анимации, если его ещё нет
        if (!document.getElementById('case-animation')) {
            const animationHTML = 
                '<div id="case-animation" class="case-animation-area" style="display: none;">' +
                '<div class="case-spinner" id="case-spinner"></div>' +
                '<div class="case-result" id="case-result"></div>' +
                '</div>';
            
            // Вставляем после карусели (ищем правильный класс)
            const carousel = caseDetailPage.querySelector('.carousel');
            if (carousel) {
                carousel.insertAdjacentHTML('afterend', animationHTML);
                console.log('Анимационная область добавлена');
            } else {
                console.log('Карусель не найдена');
            }
        }

        // Переопределяем обработчик кнопки "ОТКРЫТЬ"
        const openBtn = document.getElementById('open-case-btn');
        if (openBtn) {
            // Удаляем старые обработчики и добавляем новый
            const newBtn = openBtn.cloneNode(true);
            openBtn.parentNode.replaceChild(newBtn, openBtn);
            newBtn.addEventListener('click', handleOpenCase);
            console.log('Новый обработчик кнопки установлен');
        }
    }

    function handleOpenCase() {
        // Используем глобальные переменные из старого кода
        if (typeof window.currentCaseId === 'undefined') {
            alert('Ошибка: кейс не выбран');
            return;
        }
        
        const caseId = window.currentCaseId;
        const data = window.caseData[caseId];
        if (!data) return;

        const totalPrice = data.price * (window.selectedMultiplier || 1);
        if (window.currentBalance < totalPrice) {
            alert('Недостаточно звёзд!');
            return;
        }

        // Списываем звёзды
        if (typeof window.updateBalances === 'function') {
            window.updateBalances(window.currentBalance - totalPrice);
        }

        // Показываем анимационную область
        const animDiv = document.getElementById('case-animation');
        const spinner = document.getElementById('case-spinner');
        const resultDiv = document.getElementById('case-result');
        
        if (!animDiv  !spinner  !resultDiv) {
            alert('Ошибка инициализации анимации');
            return;
        }
        
        animDiv.style.display = 'block';
        resultDiv.innerHTML = '';

        // Заполняем спиннер копиями подарков
        spinner.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            data.items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'spinner-item';
                
                if (item.img) {
                    const img = document.createElement('img');
                    img.src = item.img;
                    img.alt = item.name;
                    div.appendChild(img);
                } else {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'gift-icon';
                    iconDiv.style.fontSize = '3rem';
                    iconDiv.textContent = item.icon || '🎁';
                    div.appendChild(iconDiv);
                    }
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'gift-name';
                nameDiv.textContent = item.name;
                
                const valueDiv = document.createElement('div');
                valueDiv.className = 'gift-value';
                valueDiv.textContent = item.value + ' ★';
                
                div.appendChild(nameDiv);
                div.appendChild(valueDiv);
                spinner.appendChild(div);
            });
        }

        // Анимация прокрутки
        let startTime = Date.now();
        const duration = 2000;
        let animationFrame;

        function scroll() {
            const elapsed = Date.now() - startTime;
            spinner.scrollLeft += 20;
            
            if (elapsed < duration) {
                animationFrame = requestAnimationFrame(scroll);
            } else {
                cancelAnimationFrame(animationFrame);
                showRandomResult(data.items);
            }
        }

        animationFrame = requestAnimationFrame(scroll);

        function showRandomResult(items) {
            // Выбор с учётом шансов
            const totalChance = items.reduce((sum, i) => sum + (i.chance || 1), 0);
            let rand = Math.random() * totalChance;
            let selected = items[0];
            
            for (let item of items) {
                if (rand < (item.chance || 1)) {
                    selected = item;
                    break;
                }
                rand -= (item.chance || 1);
            }

            resultDiv.innerHTML = 
                '<div class="result-item">' +
                (selected.img ? '<img src="' + selected.img + '" alt="' + selected.name + '">' : '<div class="gift-icon" style="font-size:4rem;">' + (selected.icon || '🎁') + '</div>') +
                '<div>' +
                '<div class="result-text">' + selected.name + '</div>' +
                '<div class="result-value">' + selected.value + ' ★</div>' +
                '</div>' +
                '</div>';
        }
    }
})();
