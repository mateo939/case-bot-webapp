// ===== АНИМАЦИЯ ОТКРЫТИЯ КЕЙСА (в существующей карусели) =====
console.log('Скрипт анимации загружен');

window.addEventListener('load', function() {
    setTimeout(function() {
        var openBtn = document.getElementById('open-case-btn');
        if (!openBtn) {
            console.log('Кнопка не найдена');
            return;
        }
        
        console.log('Кнопка найдена');
        
        // Сохраняем оригинальные предметы карусели
        var carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) {
            console.log('Карусель не найдена');
            return;
        }
        
        var originalItems = carouselTrack.innerHTML;
        
        // Создаём контейнер для результата, если его ещё нет
        var resultContainer = document.getElementById('case-result-display');
        if (!resultContainer) {
            resultContainer = document.createElement('div');
            resultContainer.id = 'case-result-display';
            resultContainer.className = 'case-result-display';
            
            // Вставляем после карусели
            var carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.parentNode.insertBefore(resultContainer, carousel.nextSibling);
            }
        }
        
        openBtn.onclick = function(e) {
            e.preventDefault();
            
            // Получаем данные текущего кейса
            if (!window.currentCaseId || !window.caseData || !window.caseData[window.currentCaseId]) {
                alert('Кейс не выбран');
                return;
            }
            
            var data = window.caseData[window.currentCaseId];
            var price = data.price * (window.selectedMultiplier || 1);
            
            if (window.currentBalance < price) {
                alert('Недостаточно звёзд!');
                return;
            }
            
            // Списываем звёзды
            if (window.updateBalances) {
                window.updateBalances(window.currentBalance - price);
            }
            
            // Очищаем предыдущий результат
            resultContainer.innerHTML = '';
            
            // Заполняем карусель копиями предметов для анимации
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
                        img.className = 'gift-image';
                        div.appendChild(img);
                    } else {
                        var iconDiv = document.createElement('div');
                        iconDiv.className = 'gift-icon';
                        iconDiv.textContent = item.icon || '🎁';
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
            // Анимация прокрутки
            var startTime = Date.now();
            var duration = 2000;
            var container = document.querySelector('.carousel');
            
            function animate() {
                var elapsed = Date.now() - startTime;
                container.scrollLeft += 8;
                
                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    // Выбираем случайный предмет с учётом шансов
                    var items = data.items;
                    var totalChance = items.reduce(function(sum, item) {
                        return sum + (item.chance || 1);
                    }, 0);
                    
                    var rand = Math.random() * totalChance;
                    var selected = items[0];
                    
                    for (var k = 0; k < items.length; k++) {
                        var item = items[k];
                        if (rand < (item.chance || 1)) {
                            selected = item;
                            break;
                        }
                        rand -= (item.chance || 1);
                    }
                    
                    // Красивое отображение результата
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
                    
                    // Добавляем анимацию появления
                    resultContainer.style.opacity = '0';
                    resultContainer.style.transition = 'opacity 0.5s';
                    setTimeout(function() {
                        resultContainer.style.opacity = '1';
                    }, 50);
                    
                    // Восстанавливаем оригинальную карусель через 3 секунды
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
