document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
  
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      if (taskText && taskList.children.length < 5) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          ${taskText}
          <button class="delete-task">✖</button>
        `;
        taskList.appendChild(listItem);
        taskInput.value = '';
      }
    });
  
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-task')) {
        e.target.parentElement.remove();
      }
    });
  });
  