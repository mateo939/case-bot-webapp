from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo


@dp.message_handler(commands=['shop'])
async def cmd_shop(message: types.Message):
    web_app_button = InlineKeyboardButton(
        text="🎮 Открыть магазин кейсов",
        web_app=WebAppInfo(url="https://mateo939.github.io/case-bot-webapp/")
    )
    keyboard = InlineKeyboardMarkup().add(web_app_button)

    await message.answer(
        "Нажмите кнопку ниже, чтобы открыть магазин кейсов прямо в Telegram!",
        reply_markup=keyboard
    )