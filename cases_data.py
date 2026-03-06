# cases_data.py
cases = [
    {
        "id": 1,
        "name": "Базовый кейс",
        "description": "Простые подарки для начинающих",
        "price": 10,
        "photo_file_id": None,
    },
    {
        "id": 2,
        "name": "Редкий кейс",
        "description": "Шанс на эпические предметы",
        "price": 50,
        "photo_file_id": None,
    },
]

case_items = {
    1: [
        {"name": "Стикер", "chance": 50, "value": 1, "file_id": None},
        {"name": "Подарок", "chance": 30, "value": 2, "file_id": None},
        {"name": "Редкий стикер", "chance": 15, "value": 5, "file_id": None},
        {"name": "Эксклюзив", "chance": 5, "value": 10, "file_id": None},
    ],
    2: [
        {"name": "Обычный подарок", "chance": 40, "value": 3, "file_id": None},
        {"name": "Необычный подарок", "chance": 30, "value": 6, "file_id": None},
        {"name": "Редкий подарок", "chance": 20, "value": 12, "file_id": None},
        {"name": "Легендарный подарок", "chance": 10, "value": 25, "file_id": None},
    ],
}