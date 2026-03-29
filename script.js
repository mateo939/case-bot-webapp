// Твой IP сервера
const SERVER_IP = "http://87.120.165.140:5000";

async function updateBalance() {
    try {
        // В Telegram Mini App мы можем получить ID пользователя
        // Пока для теста используем твой ID: 1326919289
        const userId = 1326919289; 

        const response = await fetch(${SERVER_IP}/api/get_balance?user_id=${userId});
        const data = await response.json();

        if (data.status === "ok") {
            // Ищем элемент на странице, где написано "Баланс" и обновляем цифру
            document.getElementById("balance-amount").innerText = data.balance;
            console.log("Баланс обновлен:", data.balance);
        }
    } catch (error) {
        console.error("Ошибка при получении баланса:", error);
    }
}

// Запускаем обновление при загрузке страницы
window.onload = updateBalance;
