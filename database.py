import aiosqlite

DB_NAME = "case_bot.db"

async def init_db():
    """Создаёт таблицы при первом запуске."""
    async with aiosqlite.connect(DB_NAME) as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                balance INTEGER DEFAULT 100,
                opened_cases INTEGER DEFAULT 0
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                item_name TEXT,
                item_value INTEGER,
                obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        await db.commit()

async def get_user(user_id: int):
    """Возвращает запись пользователя или создаёт новую."""
    async with aiosqlite.connect(DB_NAME) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
        row = await cursor.fetchone()
        if row:
            return dict(row)
        else:
            await db.execute('INSERT INTO users (user_id, balance) VALUES (?, ?)', (user_id, 100))
            await db.commit()
            return {"user_id": user_id, "balance": 100, "opened_cases": 0}

async def update_balance(user_id: int, new_balance: int):
    async with aiosqlite.connect(DB_NAME) as db:
        await db.execute('UPDATE users SET balance = ? WHERE user_id = ?', (new_balance, user_id))
        await db.commit()

async def add_item_to_inventory(user_id: int, item_name: str, item_value: int):
    async with aiosqlite.connect(DB_NAME) as db:
        await db.execute(
            'INSERT INTO inventory (user_id, item_name, item_value) VALUES (?, ?, ?)',
            (user_id, item_name, item_value)
        )
        await db.commit()

async def get_inventory(user_id: int):
    async with aiosqlite.connect(DB_NAME) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            'SELECT item_name, item_value, obtained_at FROM inventory WHERE user_id = ? ORDER BY obtained_at DESC',
            (user_id,)
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]