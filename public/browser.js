const tasksDOM = document.querySelector('.tasks') // Получение элемента с классом 'tasks' из DOM
const loadingDOM = document.querySelector('.loading-text') // Получение элемента с классом 'loading-text' из DOM
const formDOM = document.querySelector('.task-form') // Получение формы с классом 'task-form' из DOM
const taskInputDOM = document.querySelector('.task-input') // Получение поля ввода с классом 'task-input' из DOM
const formAlertDOM = document.querySelector('.form-alert') // Получение элемента с классом 'form-alert' из DOM

// Функция для отображения списка задач
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible' // Показ индикатора загрузки

  try {
    const response = await axios.get('/api/people') // Отправка GET-запроса для получения списка задач
    const { data: { all_task } } = response // Извлечение данных всех задач из ответа сервера

    if (!all_task || all_task.length === 0) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>' // Если нет задач, показывается сообщение
      loadingDOM.style.visibility = 'hidden' // Скрытие индикатора загрузки
      return
    }

    // Генерация HTML для каждой задачи из полученного списка
    const allTasks = all_task
      .map((task) => {
        const { completed, _id: tasksID, name } = task
        return `<div class="single-task ${completed ? 'task-completed' : ''}">
          <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
          <div class="task-links">

            <a href="task.html?id=${tasksID}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            
            <button type="button" class="delete-btn" data-id="${tasksID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`
      })
      .join('')

    tasksDOM.innerHTML = allTasks // Вставка HTML задач в DOM
  } catch (error) {
    tasksDOM.innerHTML = `<h5 class="empty-list">${error}</h5>` // Если возникла ошибка, показ сообщения об ошибке
  }

  loadingDOM.style.visibility = 'hidden' // Скрытие индикатора загрузки после завершения загрузки данных
}

// Вызов функции для отображения задач после полной загрузки документа
document.addEventListener('DOMContentLoaded', async () => {
  await showTasks()
})

// Функция для удаления задачи
const deleteTask = async (id) => {
  loadingDOM.style.visibility = 'visible' // Показ индикатора загрузки

  try {
    await axios.delete(`/api/people/${id}`) // Отправка DELETE-запроса для удаления задачи по идентификатору
    await showTasks() // После удаления задачи, обновление списка задач
  } catch (error) {
    console.log(error) // Вывод ошибки в консоль при возникновении ошибки
  }

  loadingDOM.style.visibility = 'hidden' // Скрытие индикатора загрузки после завершения удаления задачи
}

// Обработчик события клика на список задач
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    const id = el.parentElement.dataset.id // Получение идентификатора задачи
    await deleteTask(id) // Вызов функции удаления задачи по идентификатору
  }
})

// Функция для добавления новой задачи
const addTask = async (name) => {
  try {
    await axios.post('/api/people', { name }) // Отправка POST-запроса для добавления новой задачи
    await showTasks() // Обновление списка задач после успешного добавления

    taskInputDOM.value = '' // Очистка поля ввода задачи

    // Отображение сообщения об успешном добавлении задачи
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `Success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    // Обработка ошибки, если добавление задачи не удалось
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `Error, please try again`
  }

  // Скрытие сообщения об успешном добавлении через 3 секунды
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
}

// Обработчик события отправки формы
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault() // Предотвращение стандартного поведения формы (перезагрузка страницы)

  const name = taskInputDOM.value.trim() // Получение значения задачи из поля ввода

  // Проверка наличия введенного значения задачи
  if (name) {
    await addTask(name) // Вызов функции для добавления задачи
  }
})
