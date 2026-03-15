// ===== АНИМАЦИЯ ОТКРЫТИЯ КЕЙСОВ =====
console.log('Скрипт анимации загружен');

function addAnimationArea() {
    var casePage = document.getElementById('case-detail-page');
    if (!casePage) return;
    
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
            
            // Проверяем глобальные переменные
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
            
            if (window.updateBalances) {
                window.updateBalances(window.currentBalance - price);
            }
            
            var animDiv = document.getElementById('case-animation');
            var spinner = document.getElementById('case-spinner');
            var resultDiv = document.getElementById('case-result');
            
            if (!animDiv  !spinner  !resultDiv) return;
            
            animDiv.style.display = 'block';
            spinner.innerHTML = '';
            resultDiv.innerHTML = '';
            
            // Заполняем спиннер
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < data.items.length; j++) {
                    var item = data.items[j];
                    var div = document.createElement('div');
                    div.className = 'spinner-item';
                    
                    if (item.img) {
                        var img = document.createElement('img');
                        img.src = item.img;
                        img.alt = item.name;
                        img.style.width = '80px';
                        img.style.height = '80px';
                        div.appendChild(img);
                    } else {
                        div.textContent = item.icon || '🎁';
                        div.style.fontSize = '3rem';
                    }
                    
                    spinner.appendChild(div);
                }
            }
            
            // Медленная анимация (2 секунды)
            var startTime = Date.now();
            var duration = 2000;
            
            function animate() {
                var elapsed = Date.now() - startTime;
                spinner.scrollLeft += 5;  // медленно
                
                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    var items = data.items;
                    var randomIndex = Math.floor(Math.random() * items.length);
                    var selected = items[randomIndex];
                    
                    var resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    if (selected.img) {
                        var img = document.createElement('img');
                        img.src = selected.img;
                        img.alt = selected.name;
                        img.style.width = '60px';
                        img.style.height = '60px';
                        resultItem.appendChild(img);
                    } else {
                        var icon = document.createElement('div');
                        icon.textContent = selected.icon || '🎁';
                        icon.style.fontSize = '4rem';
                        resultItem.appendChild(icon);
                    }
                    
                    var textDiv = document.createElement('div');
                    var nameSpan = document.createElement('div');
                    nameSpan.className = 'result-text';
                    nameSpan.textContent = selected.name || 'Подарок';
                    
                    var valueSpan = document.createElement('div');
                    valueSpan.className = 'result-value';
                    valueSpan.textContent = (selected.value || 0) + ' ★';
                    
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
