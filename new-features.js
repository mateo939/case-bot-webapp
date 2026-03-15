// ===== НОВАЯ АНИМАЦИЯ, НЕ ЗАВИСЯЩАЯ ОТ СТАРОГО КОДА =====
console.log('Новая анимация загружена');

window.addEventListener('load', function() {
    // Функция для получения данных текущего кейса
    function getCurrentCaseData() {
        // Пробуем получить из глобальных переменных (если они есть)
        if (window.currentCaseId && window.caseData && window.caseData[window.currentCaseId]) {
            return window.caseData[window.currentCaseId];
        }
        
        // Если нет, пробуем получить из DOM
        var caseName = document.querySelector('.case-detail-title');
        if (!caseName) return null;
        
        // Возвращаем тестовые данные (замените на реальные)
        return {
            name: 'обычный кейс',
            price: 140,
            items: [
                { img: 'diamond.png', name: 'Алмаз', value: 100, chance: 5 },
                { img: 'cup.png', name: 'Кубок', value: 100, chance: 8 },
                { img: 'rocket.png', name: 'Ракета', value: 50, chance: 12 },
                { img: 'rose.png', name: 'Роза', value: 25, chance: 15 },
                { img: 'stars10.png', name: '10 звёзд', value: 10, chance: 20 },
                { img: 'stars5.png', name: '5 звёзд', value: 5, chance: 25 },
                { img: 'stars.png', name: '1 звезда', value: 1, chance: 30 }
            ]
        };
    }

    // Функция для обновления баланса
    function updateBalance(amount) {
        if (window.updateBalances) {
            window.updateBalances(amount);
        } else {
            // Если нет функции, пробуем найти элемент баланса
            var balanceEl = document.getElementById('balance-display');
            if (balanceEl) {
                var current = parseInt(balanceEl.textContent) || 0;
                balanceEl.textContent = amount + ' ★';
            }
        }
    }

    setTimeout(function() {
        var openBtn = document.getElementById('open-case-btn');
        if (!openBtn) {
            console.log('Кнопка не найдена');
            return;
        }
        
        console.log('Кнопка найдена');
        
        var carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) {
            console.log('Карусель не найдена');
            return;
        }
        
        var originalItems = carouselTrack.innerHTML;
        
        // Создаём контейнер для результата
        var resultContainer = document.getElementById('case-result-display');
        if (!resultContainer) {
            resultContainer = document.createElement('div');
            resultContainer.id = 'case-result-display';
            resultContainer.className = 'case-result-display';
            var carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.parentNode.insertBefore(resultContainer, carousel.nextSibling);
            }
        }
        
        // Получаем множитель (X)
        var multiplier = 1;
        document.querySelectorAll('.multiplier-item').forEach(function(el) {
            el.addEventListener('click', function() {
                document.querySelectorAll('.multiplier-item').forEach(function(item) {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                multiplier = parseInt(this.dataset.x) || 1;
            });
        });
        
        openBtn.onclick = function(e) {
            e.preventDefault();
            
            var data = getCurrentCaseData();
            if (!data) {
                alert('Данные кейса не найдены');
                return;
            }
            
            var totalPrice = data.price * multiplier;
            
            // Проверяем баланс (пробуем разные способы)
            var currentBalance = 0;
            if (window.currentBalance !== undefined) {
                currentBalance = window.currentBalance;
            } else {
                var balanceEl = document.getElementById('balance-display');
                if (balanceEl) {
                    currentBalance = parseInt(balanceEl.textContent) || 0;
                }
            }
            
            if (currentBalance < totalPrice) {
                alert('Недостаточно звёзд!');
                return;
            }
            
            // Списываем звёзды
            updateBalance(currentBalance - totalPrice);
            
            // Очищаем результат
            resultContainer.innerHTML = '';
            
            // Заполняем карусель
            carouselTrack.innerHTML = '';
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < data.items.length; j++) {
                    var item = data.items[j];
                    var div = document.createElement('div');
                    div.className = 'gift-item spinner-item';
                    
                    if (item.img) {
                        var img = document.createElement('img');
                        img.src = item.img;
                        img.alt = item.name;
                        div.appendChild(img);
                    } else {
                        var iconDiv = document.createElement('div');
                        iconDiv.className = 'gift-icon';
                        iconDiv.textContent = item.icon || '🎁';
                        iconDiv.style.fontSize = '3rem';
                        div.appendChild(iconDiv);
                    }
                    
                    var nameDiv = document.createElement('div');
                    nameDiv.className = 'gift-name';
                    nameDiv.textContent = item.name;
                    
                    var valueDiv = document.createElement('div');
                    valueDiv.className = 'gift-value';
                    valueDiv.textContent = item.value + ' ★';
                    
                    div.appendChild(nameDiv);
                    div.appendChild(valueDiv);
                    carouselTrack.appendChild(div);
                }
            }
            
            // Анимация
            var startTime = Date.now();
            var duration = 2000;
            var container = document.querySelector('.carousel');
            
            function animate() {
                var elapsed = Date.now() - startTime;
                container.scrollLeft += 8;
                
                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    // Выбор предмета с учётом шансов
                    var items = data.items;
                    var totalChance = items.reduce(function(sum, item) {
                        return sum + (item.chance || 1);
                    }, 0);
                    
                    var rand = Math.random() * totalChance;
                    var selected = items[0];
                    
                    for (var k = 0; k < items.length; k++) {
                        if (rand < (items[k].chance || 1)) {
                            selected = items[k];
                            break;
                        }
                        rand -= (items[k].chance || 1);
                    }
                    
                    // Показываем результат
                    resultContainer.innerHTML = '';
                    var resultDiv = document.createElement('div');
                    resultDiv.className = 'result-item';
                    
                    if (selected.img) {
                        var img = document.createElement('img');
                        img.src = selected.img;
                        img.alt = selected.name;
                        resultDiv.appendChild(img);
                    } else {
                        var iconDiv = document.createElement('div');
                        iconDiv.className = 'gift-icon';
                        iconDiv.textContent = selected.icon || '🎁';
                        iconDiv.style.fontSize = '4rem';
                        resultDiv.appendChild(iconDiv);
                    }
                    
                    var textDiv = document.createElement('div');
                    textDiv.className = 'result-text';
                    textDiv.innerHTML = '<strong>' + selected.name + '</strong><br><span class="result-value">' + selected.value + ' ★</span>';
                    
                    resultDiv.appendChild(textDiv);
                    resultContainer.appendChild(resultDiv);
                    
                    // Анимация появления
                    resultContainer.style.opacity = '0';
                    resultContainer.style.transition = 'opacity 0.5s';
                    setTimeout(function() {
                        resultContainer.style.opacity = '1';
                    }, 50);
                    
                    // Восстанавливаем карусель
                    setTimeout(function() {
                        carouselTrack.innerHTML = originalItems;
                    }, 3000);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        console.log('Обработчик установлен');
    }, 1000);
});
