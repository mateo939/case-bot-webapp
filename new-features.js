// ===== АНИМАЦИЯ ОТКРЫТИЯ КЕЙСА (с реальным инвентарём) =====
console.log('Анимация с инвентарём загружена');

// Глобальный массив инвентаря (будет хранить все полученные предметы)
window.userInventory = window.userInventory || [];

// Данные для всех кейсов
var caseDatabase = {
    'case0': {
        name: 'бесплатный',
        price: 0,
        items: [
            { img: 'instant-ramens.png', name: 'instant ramens', value: 50, chance: 10 },
            { img: 'diamond.png', name: 'diamond', value: 100, chance: 5 },
            { img: 'cup.png', name: 'cup', value: 100, chance: 8 },
            { img: 'rocket.png', name: 'rocket', value: 50, chance: 12 },
            { img: 'rose.png', name: 'rose', value: 25, chance: 15 },
            { img: 'stars10.png', name: 'stars10', value: 10, chance: 20 },
            { img: 'stars5.png', name: 'stars5', value: 5, chance: 25 },
            { img: 'stars.png', name: 'stars', value: 1, chance: 30 }
        ]
    },
    'case1': {
        name: 'обычный кейс',
        price: 140,
        items: [
            { img: 'diamond.png', name: 'diamond', value: 100, chance: 5 },
            { img: 'cup.png', name: 'cup', value: 100, chance: 8 },
            { img: 'rocket.png', name: 'rocket', value: 50, chance: 12 },
            { img: 'rose.png', name: 'rose', value: 25, chance: 15 },
            { img: 'stars10.png', name: 'stars10', value: 10, chance: 20 },
            { img: 'stars5.png', name: 'stars5', value: 5, chance: 25 },
            { img: 'stars.png', name: 'stars', value: 1, chance: 30 }
        ]
    },
    'case2': {
        name: 'сигара',
        price: 140,
        items: [
            { img: 'westside-sign.png', name: 'westside sign', value: 11698, chance: 5 },
            { img: 'low-raider.png', name: 'low raider', value: 6530, chance: 8 },
            { img: 'low-raider-silver-angel.png', name: 'low raider silver angel', value: 4620, chance: 10 },
            { img: 'vintage-sigar-red-devil.png', name: 'vintage sigar red devil', value: 2770, chance: 12 },
            { img: 'swag-bag.png', name: 'swag bag', value: 950, chance: 15 },
            { img: 'snoop-dogg.png', name: 'snoop dogg', value: 390, chance: 18 },
            { img: 'b-day-onyx.png', name: 'b-day onyx', value: 320, chance: 20 },
            { img: 'ring.png', name: 'ring', value: 100, chance: 25 }
        ]
    },
    'case3': {
        name: 'клевер',
        price: 140,
        items: [
            { icon: '🍀', name: 'FOUR LEAF', value: 7777, chance: 10 },
            { icon: '🍀', name: 'CLOVER', value: 3333, chance: 20 },
            { icon: '🍀', name: 'SHAMROCK', value: 1111, chance: 30 }
        ]
    }
};

// Функция обновления баланса на странице
function updateBalanceDisplay(amount) {
    var balanceEl = document.getElementById('balance-display');
    if (balanceEl) {
        balanceEl.textContent = amount + ' ★';
    }
    // Если есть глобальная переменная баланса — обновим и её
    if (typeof currentBalance !== 'undefined') {
        currentBalance = amount;
    }
}

window.addEventListener('load', function () {
    setTimeout(function () {
        var openBtn = document.getElementById('open-case-btn');
        if (!openBtn) return;

        var carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) return;

        var originalItems = carouselTrack.innerHTML;

        // Оверлей для результата
        var overlayContainer = document.getElementById('case-result-overlay');
        if (!overlayContainer) {
            overlayContainer = document.createElement('div');
            overlayContainer.id = 'case-result-overlay';
            overlayContainer.className = 'case-result-overlay';
            overlayContainer.style.display = 'none';

            var overlayContent = document.createElement('div');
            overlayContent.className = 'overlay-content';
            overlayContainer.appendChild(overlayContent);
            var carouselContainer = document.querySelector('.carousel');
            if (carouselContainer) {
                carouselContainer.parentNode.insertBefore(overlayContainer, carouselContainer.nextSibling);
            }
        }

        // Множитель X
        var multiplier = 1;
        document.querySelectorAll('.multiplier-item').forEach(function (el) {
            el.addEventListener('click', function () {
                document.querySelectorAll('.multiplier-item').forEach(function (item) {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                multiplier = parseInt(this.dataset.x) || 1;
            });
        });

        openBtn.onclick = function (e) {
            e.preventDefault();

            var caseId = window.caseIdFromOld || 'case1';
            var data = caseDatabase[caseId];
            if (!data) return;

            // Проверка баланса (кроме бесплатного)
            if (caseId !== 'case0') {
                var totalPrice = data.price * multiplier;
                var balanceEl = document.getElementById('balance-display');
                var balanceText = balanceEl ? balanceEl.textContent.replace(/[^0-9]/g, '') : '0';
                var currentBalance = parseInt(balanceText) || 0;

                if (currentBalance < totalPrice) {
                    alert('Недостаточно звёзд!');
                    return;
                }

                // Списываем звёзды
                updateBalanceDisplay(currentBalance - totalPrice);
            }

            // Очищаем карусель
            carouselTrack.innerHTML = '';

            // Заполняем карусель копиями предметов
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

            overlayContainer.style.display = 'none';
            overlayContainer.querySelector('.overlay-content').innerHTML = '';

            // Анимация
            var startTime = Date.now();
            var duration = 3000;
            var container = document.querySelector('.carousel');

            function animate() {
                var elapsed = Date.now() - startTime;
                container.scrollLeft += 5;

                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    // Выбор предмета с учётом шансов
                    var items = data.items;
                    var totalChance = items.reduce(function (sum, item) {
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
                    overlayContainer.style.display = 'flex';
                    var overlayContent = overlayContainer.querySelector('.overlay-content');
                    overlayContent.innerHTML = '';

                    var resultDiv = document.createElement('div');
                    resultDiv.className = 'result-overlay-item';

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

                    var nameSpan = document.createElement('div');
                    nameSpan.className = 'result-name';
                    nameSpan.textContent = selected.name;

                    var valueSpan = document.createElement('div');
                    valueSpan.className = 'result-price';
                    valueSpan.textContent = selected.value + ' ★';

                    resultDiv.appendChild(nameSpan);
                    resultDiv.appendChild(valueSpan);
                    overlayContent.appendChild(resultDiv);

                    // Кнопки с реальной логикой
                    var buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'result-buttons';

                    // Кнопка "В ИНВЕНТАРЬ"
                    var invBtn = document.createElement('button');
                    invBtn.className = 'result-btn inventory-btn';
                    invBtn.textContent = 'В ИНВЕНТАРЬ';
                    invBtn.onclick = function () {
                        // Добавляем предмет в инвентарь
                        window.userInventory.push({
                            name: selected.name,
                            value: selected.value,
                            img: selected.img,
                            icon: selected.icon,
                            obtained: new Date().toLocaleString()
                        });
                        alert('✅ Предмет добавлен в инвентарь!');
                        overlayContainer.style.display = 'none';
                    };

                    // Кнопка "ПРОДАТЬ"
                    var sellBtn = document.createElement('button');
                    sellBtn.className = 'result-btn sell-btn';
                    sellBtn.textContent = 'ПРОДАТЬ';
                    sellBtn.onclick = function () {
                        var sellPrice = Math.floor(selected.value * 0.5); // 50% стоимости

                        // Получаем текущий баланс
                        var balanceEl = document.getElementById('balance-display');
                        var balanceText = balanceEl ? balanceEl.textContent.replace(/[^0-9]/g, '') : '0';
                        var currentBalance = parseInt(balanceText) || 0;

                        // Начисляем звёзды
                        updateBalanceDisplay(currentBalance + sellPrice);

                        alert('💰 Продано за ' + sellPrice + ' ★');
                        overlayContainer.style.display = 'none';
                    };

                    buttonsDiv.appendChild(invBtn);
                    buttonsDiv.appendChild(sellBtn);
                    overlayContent.appendChild(buttonsDiv);
                    // Восстанавливаем карусель
                    setTimeout(function () {
                        carouselTrack.innerHTML = originalItems;
                    }, 3000);
                }
            }

            requestAnimationFrame(animate);
        };
    }, 1000);
});
