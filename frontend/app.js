document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const tasksList = document.getElementById('tasks-list');

    const apiUrl = 'http://localhost:8000/tasks/';
    
    const fetchTasks = async () => {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task.title;
            if (task.completed) {
                taskItem.classList.add('complete');
            }
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete');
            completeButton.addEventListener('click', async () => {
                await fetch(apiUrl + task.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...task, completed: !task.completed })
                });
                fetchTasks();
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', async () => {
                await fetch(apiUrl + task.id, {
                    method: 'DELETE'
                });
                fetchTasks();
            });

            taskItem.appendChild(completeButton);
            taskItem.appendChild(deleteButton);
            tasksList.appendChild(taskItem);
        });
    };

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        if (title) {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            taskTitle.value = '';
            fetchTasks();
        }
    });

    fetchTasks();
});
