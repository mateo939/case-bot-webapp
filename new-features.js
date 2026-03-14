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
                <div id="case-animation" class="case-animation-area" style="display: none;">
                    <div class="case-spinner" id="case-spinner"></div>
                    <div class="case-result" id="case-result"></div>
                </div>
            ;
            
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
            openBtn.replaceWith(openBtn.cloneNode(true));
            const newBtn = document.getElementById('open-case-btn');
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
                <div class="result-item">
                    ${selected.img ? <img src="${selected.img}" alt="${selected.name}"> : <div class="gift-icon" style="font-size:4rem;">${selected.icon || '🎁'}</div>}
                    <div>
                        <div class="result-text">${selected.name}</div>
                        <div class="result-value">${selected.value} ★</div>
                    </div>
                </div>
            ;
        }
    }
})();
/* ===== СТИЛИ ДЛЯ АНИМАЦИИ ОТКРЫТИЯ КЕЙСОВ ===== */
.case-animation-area {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
}

.case-spinner {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 15px;
    min-height: 140px;
    align-items: center;
    scroll-behavior: auto;
    -webkit-overflow-scrolling: touch;
}

.case-spinner::-webkit-scrollbar {
    display: none;
}

.spinner-item {
    flex: 0 0 auto;
    width: 120px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 25px;
    padding: 20px 10px;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border: none;
}

.spinner-item img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin-bottom: 10px;
}

.spinner-item .gift-name {
    font-size: 0.9rem;
    color: #fff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.spinner-item .gift-value {
    font-size: 1rem;
    font-weight: 600;
    color: #ffd700;
}

.case-result {
    font-size: 2rem;
    font-weight: 800;
    color: #ffd700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    margin: 20px 0;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50px;
    padding: 15px 30px;
}

.result-item img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.result-item .gift-icon {
    font-size: 3rem;
}

.result-text {
    font-size: 1.2rem;
    color: #fff;
}

.result-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffd700;
}

.open-case-btn {
    background: var(--tg-theme-button-color, #40a7e3);
    color: #fff;
    border: none;
    border-radius: 60px;
    padding: 18px 40px;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    margin: 20px auto;
    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
    transition: transform 0.2s;
    width: fit-content;
}

.open-case-btn:hover {
    transform: translateY(-4px);
}

.open-case-btn:active {
    transform: translateY(0);
}
