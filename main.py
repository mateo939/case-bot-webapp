import asyncio
import logging
import json
from random import choices

from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils import executor

import config
import database
from cases_data import cases, case_items

# Инициализация
bot = Bot(token=config.BOT_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

ANIMATION_FILE_ID = None

# Хэндлеры
@dp.message_handler(commands=['start'])
async def cmd_start(message: types.Message):
    # Простое приветствие
    await message.answer("👋 Добро пожаловать! Используй /shop для открытия кейсов.")

@dp.message_handler(commands=['balance'])
async def cmd_balance(message: types.Message):
    user = await database.get_user(message.from_user.id)
    await message.answer(f"💰 Ваш баланс: {user['balance']} ⭐️")

@dp.message_handler(commands=['shop'])
async def cmd_shop(message: types.Message):
    # Кнопка с Web App
    web_app_button = InlineKeyboardButton(
        text="🎮 Открыть магазин кейсов",
        web_app=WebAppInfo(url="https://mateo939.github.io/case-bot-webapp/")
    )
    keyboard = InlineKeyboardMarkup().add(web_app_button)
    await message.answer("Нажмите кнопку ниже, чтобы открыть магазин кейсов!", reply_markup=keyboard)

@dp.callback_query_handler(lambda c: c.data and c.data.startswith('open_'))
async def process_open_case(callback: types.CallbackQuery):
    # Этот хэндлер для inline-кнопок (если они есть)
    await callback.answer("Эта функция пока не реализована.")

@dp.message_handler(content_types=['web_app_data'])
async def handle_web_app_data(message: types.Message):
    data = message.web_app_data.data
    try:
        payload = json.loads(data)
        case_type = payload.get('case')
        item = payload.get('item')
        user_id = message.from_user.id

        user = await database.get_user(user_id)
        price = 10 if case_type == 'basic' else 50

        if user['balance'] >= price:
            new_balance = user['balance'] - price
            await database.update_balance(user_id, new_balance)
            # Для простоты ценность предмета = 1 (можно заменить на реальную)
            await database.add_item_to_inventory(user_id, item, 1)
            await message.answer(f"✅ Вы получили {item}! Остаток: {new_balance} ⭐️")
        else:
            await message.answer(f"❌ Недостаточно средств! Баланс: {user['balance']} ⭐️")
    except Exception as e:
        await message.answer(f"Ошибка обработки: {e}")

# Запуск
async def on_startup(dp):
    await database.init_db()
    logging.info("База данных инициализирована")

if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True, on_startup=on_startup)