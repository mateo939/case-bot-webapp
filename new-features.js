// ===== ПРОСТАЯ АНИМАЦИЯ ОТКРЫТИЯ КЕЙСОВ =====
(function() {
    console.log('Скрипт анимации загружен');

    // Функция для добавления анимационной области
    function addAnimationArea() {
        const casePage = document.getElementById('case-detail-page');
        if (!casePage) return;
        
        // Проверяем, есть ли уже анимация
        if (document.getElementById('case-animation')) return;
        
        // Создаём элементы через DOM API, а не через innerHTML
        const animDiv = document.createElement('div');
        animDiv.id = 'case-animation';
        animDiv.className = 'case-animation-area';
        animDiv.style.display = 'none';
        
        const spinner = document.createElement('div');
        spinner.id = 'case-spinner';
        spinner.className = 'case-spinner';
        
        const result = document.createElement('div');
        result.id = 'case-result';
        result.className = 'case-result';
        
        animDiv.appendChild(spinner);
        animDiv.appendChild(result);
        
        // Вставляем после карусели
        const carousel = casePage.querySelector('.carousel');
        if (carousel) {
            carousel.parentNode.insertBefore(animDiv, carousel.nextSibling);
            console.log('Анимационная область добавлена');
        }
    }

    // Ждём загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAnimationArea);
    } else {
        addAnimationArea();
    }

    // Переопределяем кнопку открытия (ждём немного, чтобы старый код успел выполниться)
    setTimeout(function() {
        const openBtn = document.getElementById('open-case-btn');
        if (openBtn) {
            // Сохраняем старую функцию, если нужно
            const oldHandler = openBtn.onclick;
            
            openBtn.onclick = function(e) {
                e.preventDefault();
                
                // Проверяем, есть ли данные кейса
                if (!window.currentCaseId  !window.caseData  !window.caseData[window.currentCaseId]) {
                    alert('Кейс не выбран');
                    return;
                }
                
                const data = window.caseData[window.currentCaseId];
                const price = data.price * (window.selectedMultiplier || 1);
                
                // Проверка баланса
                if (window.currentBalance < price) {
                    alert('Недостаточно звёзд!');
                    return;
                }
                
                // Списываем звёзды
                window.updateBalances(window.currentBalance - price);
                
                // Показываем анимацию
                const animDiv = document.getElementById('case-animation');
                const spinner = document.getElementById('case-spinner');
                const resultDiv = document.getElementById('case-result');
                
                if (!animDiv  !spinner  !resultDiv) {
                    alert('Ошибка анимации');
                    return;
                }
                
                animDiv.style.display = 'block';
                resultDiv.innerHTML = '';
                
                // Заполняем спиннер
                spinner.innerHTML = '';
                for (let i = 0; i < 30; i++) {
                    data.items.forEach(function(item) {
                        const div = document.createElement('div');
                        div.className = 'spinner-item';
                        
                        if (item.img) {
                            const img = document.createElement('img');
                            img.src = item.img;
                            img.alt = item.name || '';
                            div.appendChild(img);
                            } else {
                            div.textContent = item.icon || '🎁';
                            div.style.fontSize = '3rem';
                        }
                        
                        spinner.appendChild(div);
                    });
                }
                
                // Анимация прокрутки
                let count = 0;
                function animate() {
                    spinner.scrollLeft += 15;
                    count++;
                    
                    if (count < 100) {
                        requestAnimationFrame(animate);
                    } else {
                        // Выбор случайного предмета
                        const items = data.items;
                        const randomIndex = Math.floor(Math.random() * items.length);
                        const selected = items[randomIndex];
                        
                        // Показываем результат
                        resultDiv.innerHTML = '';
                        const resultItem = document.createElement('div');
                        resultItem.className = 'result-item';
                        
                        if (selected.img) {
                            const img = document.createElement('img');
                            img.src = selected.img;
                            img.alt = selected.name || '';
                            resultItem.appendChild(img);
                        } else {
                            const icon = document.createElement('div');
                            icon.className = 'gift-icon';
                            icon.textContent = selected.icon || '🎁';
                            icon.style.fontSize = '4rem';
                            resultItem.appendChild(icon);
                        }
                        
                        const textDiv = document.createElement('div');
                        textDiv.innerHTML = '<div class="result-text">' + (selected.name || 'Подарок') + '</div>' +
                                          '<div class="result-value">' + (selected.value || 0) + ' ★</div>';
                        resultItem.appendChild(textDiv);
                        resultDiv.appendChild(resultItem);
                    }
                }
                
                requestAnimationFrame(animate);
            };
            
            console.log('Обработчик кнопки переопределён');
        } else {
            console.log('Кнопка открытия не найдена');
        }
    }, 500);
})();
