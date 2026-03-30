import sqlite3
from datetime import datetime

DB_NAME = 'timetracker.db'

def init_db():
    """Создаёт таблицу в базе данных, если её нет"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project TEXT NOT NULL,
            description TEXT,
            start_time TEXT NOT NULL,
            end_time TEXT,
            duration_seconds INTEGER
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ База данных готова!")

def add_entry(project, description, start_time):
    """Добавляет новую запись о начале работы"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO entries (project, description, start_time)
        VALUES (?, ?, ?)
    ''', (project, description, start_time))
    
    conn.commit()
    conn.close()

def close_entry(entry_id, end_time, duration):
    """Закрывает запись (когда таймер остановлен)"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE entries 
        SET end_time = ?, duration_seconds = ?
        WHERE id = ?
    ''', (end_time, duration, entry_id))
    
    conn.commit()
    conn.close()

def get_all_entries():
    """Получает все записи из базы"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM entries ORDER BY id DESC')
    rows = cursor.fetchall()
    
    conn.close()
    return rows

# Инициализируем базу при импорте этого файла
init_db()