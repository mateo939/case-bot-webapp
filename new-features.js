// ===== ТЕСТОВАЯ АНИМАЦИЯ (БЕЗ ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ) =====
console.log('Тестовая анимация загружена');

function addAnimationArea() {
    var casePage = document.getElementById('case-detail-page');
    if (!casePage) {
        console.log('Страница кейса не найдена');
        return;
    }
    
    if (document.getElementById('case-animation')) return;
    
    var animDiv = document.createElement('div');
    animDiv.id = 'case-animation';
    animDiv.className = 'case-animation-area';
    animDiv.style.display = 'none';
    
    var spinner = document.createElement('div');
    spinner.id = 'case-spinner';
    spinner.className = 'case-spinner';
    
    var result = document.createElement('div');
    result.id = 'case-result';
    result.className = 'case-result';
    
    animDiv.appendChild(spinner);
    animDiv.appendChild(result);
    
    var carousel = casePage.querySelector('.carousel');
    if (carousel) {
        carousel.parentNode.insertBefore(animDiv, carousel.nextSibling);
        console.log('Анимация добавлена');
    } else {
        // Если нет карусели, вставляем в начало
        casePage.insertBefore(animDiv, casePage.firstChild);
        console.log('Анимация добавлена в начало');
    }
}

window.addEventListener('load', function() {
    addAnimationArea();
    
    setTimeout(function() {
        var openBtn = document.getElementById('open-case-btn');
        if (!openBtn) {
            console.log('Кнопка не найдена');
            return;
        }
        
        console.log('Кнопка найдена');
        
        openBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Клик по кнопке!');
            
            // Тестовые данные (замените пути на реальные файлы)
            var testItems = [
                { img: 'diamond.png', name: 'Алмаз', value: 100 },
                { img: 'cup.png', name: 'Кубок', value: 100 },
                { img: 'rocket.png', name: 'Ракета', value: 50 },
                { img: 'rose.png', name: 'Роза', value: 25 },
                { img: 'stars10.png', name: '10 звёзд', value: 10 },
                { img: 'stars5.png', name: '5 звёзд', value: 5 },
                { img: 'stars.png', name: '1 звезда', value: 1 }
            ];
            
            var animDiv = document.getElementById('case-animation');
            var spinner = document.getElementById('case-spinner');
            var resultDiv = document.getElementById('case-result');
            
            if (!animDiv || !spinner || !resultDiv) {
                alert('Ошибка: анимация не найдена');
                return;
            }
            
            animDiv.style.display = 'block';
            spinner.innerHTML = '';
            resultDiv.innerHTML = '';
            
            // Заполняем спиннер (20 копий всех предметов)
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < testItems.length; j++) {
                    var item = testItems[j];
                    var div = document.createElement('div');
                    div.className = 'spinner-item';
                    
                    var img = document.createElement('img');
                    img.src = item.img;
                    img.alt = item.name;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    div.appendChild(img);
                    
                    spinner.appendChild(div);
                }
            }
            
            // Медленная анимация (2.5 секунды)
            var startTime = Date.now();
            var duration = 2500;
            
            function animate() {
                var elapsed = Date.now() - startTime;
                spinner.scrollLeft += 5;
                
                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    var randomIndex = Math.floor(Math.random() * testItems.length);
                    var selected = testItems[randomIndex];
                    
                    var resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    var img = document.createElement('img');
                    img.src = selected.img;
                    img.alt = selected.name;
                    img.style.width = '60px';
                    img.style.height = '60px';
                    resultItem.appendChild(img);
                    
                    var textDiv = document.createElement('div');
                    var nameSpan = document.createElement('div');
                    nameSpan.className = 'result-text';
                    nameSpan.textContent = selected.name;
                    
                    var valueSpan = document.createElement('div');
                    valueSpan.className = 'result-value';
                    valueSpan.textContent = selected.value + ' ★';
                    
                    textDiv.appendChild(nameSpan);
                    textDiv.appendChild(valueSpan);
                    resultItem.appendChild(textDiv);
                    resultDiv.appendChild(resultItem);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        console.log('Обработчик установлен');
    }, 1000);
});
