// ===== НОВЫЙ КОД ДЛЯ АНИМАЦИИ ОТКРЫТИЯ КЕЙСОВ =====
(function() {
    // Дождёмся загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaseAnimation);
    } else {
        initCaseAnimation();
    }

    function initCaseAnimation() {
        // Находим страницу деталей кейса
        const caseDetailPage = document.getElementById('case-detail-page');
        if (!caseDetailPage) return;

        // Создаём контейнер для анимации, если его ещё нет
        if (!document.getElementById('case-animation')) {
            const animationHTML = 
                <div id="case-animation" class="case-animation-area" style="display: none;">
                    <div class="case-spinner" id="case-spinner"></div>
                    <div class="case-result" id="case-result"></div>
                </div>
            ;
            // Вставляем после карусели
            const carousel = caseDetailPage.querySelector('.carousel');
            if (carousel) {
                carousel.insertAdjacentHTML('afterend', animationHTML);
            }
        }

        // Переопределяем обработчик кнопки "ОТКРЫТЬ"
        const openBtn = document.getElementById('open-case-btn');
        if (openBtn) {
            // Сохраняем оригинальный обработчик, если нужно
            openBtn.removeEventListener('click', window.oldOpenHandler);
            openBtn.addEventListener('click', handleOpenCase);
        }
    }

    function handleOpenCase() {
        const caseId = window.currentCaseId; // из старого кода
        if (!caseId) return;

        const data = window.caseData[caseId]; // из старого кода
        if (!data) return;

        // Проверка баланса (используем старую функцию updateBalances)
        const totalPrice = data.price * window.selectedMultiplier;
        if (window.currentBalance < totalPrice) {
            alert('Недостаточно звёзд!');
            return;
        }

        // Списываем звёзды
        window.updateBalances(window.currentBalance - totalPrice);

        // Показываем анимационную область
        const animDiv = document.getElementById('case-animation');
        const spinner = document.getElementById('case-spinner');
        const resultDiv = document.getElementById('case-result');
        
        animDiv.style.display = 'block';
        resultDiv.innerHTML = ''; // очищаем результат

        // Создаём много копий подарков для длинной прокрутки
        spinner.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            data.items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'spinner-item';
                
                if (item.img) {
                    const img = document.createElement('img');
                    img.src = item.img;
                    img.alt = item.name;
                    div.appendChild(img);
                } else {
                    div.innerHTML = <div class="gift-icon">${item.icon || '🎁'}</div>;
                }
                
                div.innerHTML += <div class="gift-name">${item.name}</div>;
                div.innerHTML += <div class="gift-value">${item.value} ★</div>;
                
                spinner.appendChild(div);
            });
        }

        // Запускаем анимацию прокрутки
        let startTime = Date.now();
        const duration = 2000; // 2 секунды
        let animationFrame;

        function scroll() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Скроллим очень быстро
            spinner.scrollLeft += 15;
            
            if (progress < 1) {
                animationFrame = requestAnimationFrame(scroll);
            } else {
                // Останавливаемся на случайном предмете
                cancelAnimationFrame(animationFrame);
                showRandomResult(data.items);
            }
        }

        animationFrame = requestAnimationFrame(scroll);
      function showRandomResult(items) {
            // Выбираем случайный предмет с учётом шансов
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

            // Отображаем результат
            resultDiv.innerHTML = 
                <div class="result-item">
                    ${selected.img ? <img src="${selected.img}" alt="${selected.name}"> : <div class="gift-icon" style="font-size:3rem;">${selected.icon || '🎁'}</div>}
                    <div>
                        <div class="result-text">${selected.name}</div>
                        <div class="result-value">${selected.value} ★</div>
                    </div>
                </div>
            ;
        }
    }
})();
