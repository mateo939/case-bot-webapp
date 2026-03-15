// ===== УПРОЩЁННАЯ АНИМАЦИЯ (БЕЗ ПРОВЕРОК) =====
console.log('Тестовая анимация загружена');

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
        if (!openBtn) return;
        
        console.log('Кнопка найдена');
        
        openBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Клик по кнопке');
            
            // Используем тестовые данные, если глобальных нет
            var testItems = [
                { img: 'diamond.png', name: 'Алмаз', value: 100 },
                { img: 'cup.png', name: 'Кубок', value: 100 },
                { img: 'rocket.png', name: 'Ракета', value: 50 },
                { img: 'rose.png', name: 'Роза', value: 25 }
            ];
            
            var animDiv = document.getElementById('case-animation');
            var spinner = document.getElementById('case-spinner');
            var resultDiv = document.getElementById('case-result');
            
            if (!animDiv || !spinner || !resultDiv) return;
            
            animDiv.style.display = 'block';
            spinner.innerHTML = '';
            resultDiv.innerHTML = '';
            
            // Заполняем спиннер тестовыми предметами
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < testItems.length; j++) {
                    var item = testItems[j];
                    var div = document.createElement('div');
                    div.className = 'spinner-item';
                    
                    var img = document.createElement('img');
                    img.src = item.img;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    div.appendChild(img);
                    
                    spinner.appendChild(div);
                }
            }
            
            // Анимация
            var count = 0;
            function animate() {
                spinner.scrollLeft += 30;
                count++;
                if (count < 70) {
                    requestAnimationFrame(animate);
                } else {
                    var randomIndex = Math.floor(Math.random() * testItems.length);
                    var selected = testItems[randomIndex];
                    
                    var resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    var img = document.createElement('img');
                    img.src = selected.img;
                    img.style.width = '60px';
                    img.style.height = '60px';
                    resultItem.appendChild(img);
                    
                    var textDiv = document.createElement('div');
                    textDiv.innerHTML = '<div class="result-text">' + selected.name + '</div>' +
                        '<div class="result-value">' + selected.value + ' ★</div>';
                    resultItem.appendChild(textDiv);
                    resultDiv.appendChild(resultItem);
                }
            }
            requestAnimationFrame(animate);
        };
        
        console.log('Обработчик установлен');
    }, 1000);
});
