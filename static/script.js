// Показывает сообщение пользователю
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.display = 'block';
    status.style.background = isError ? '#ffebee' : '#e8f5e9';
    setTimeout(() => status.style.display = 'none', 5000);
}

// Запуск таймера
async function startTimer() {
    const project = document.getElementById('project').value;
    const description = document.getElementById('description').value;
    
    if (!project) {
        showStatus('⚠ Введите название проекта!', true);
        return;
    }

    const response = await fetch('/api/start', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({project, description})
    });
    const result = await response.json();
    showStatus(result.message);
    loadEntries();
}

// Остановка таймера
async function stopTimer() {
    const response = await fetch('/api/stop', {method: 'POST'});
    const result = await response.json();
    showStatus(result.message, result.status === 'error');
    loadEntries();
}

// Загрузка записей в таблицу
async function loadEntries() {
    const response = await fetch('/api/entries');
    const entries = await response.json();
    
    const tbody = document.getElementById('entriesTable');
    tbody.innerHTML = '';
    
    entries.forEach(e => {
        const row = `<tr>
            <td>${e.project}</td>
            <td>${e.description || '-'}</td>
            <td>${e.start_time ? e.start_time.slice(0,19).replace('T', ' ') : '-'}</td>
            <td>${e.end_time ? e.end_time.slice(0,19).replace('T', ' ') : '⏳ Активен'}</td>
            <td>${e.duration || '-'}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Экспорт отчёта
async function exportReport() {
    const response = await fetch('/api/export');
    const result = await response.json();
    showStatus(result.message);
}

// Загружаем записи при открытии страницы
loadEntries();