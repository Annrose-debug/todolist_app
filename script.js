

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements 
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskCount = document.getElementById('taskCount');

    // load tasks from localstorage 

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // render tasks 
    function renderTasks(filter = 'all') {
        taskList.innerHTML = ' ';

        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true; 
        });

        if (filteredTasks.length === 0) {
            const noTasksMsg = document.createElement('div')
            noTasksMsg.className = 'no-tasks';
            noTasksMsgMsg.textContent =
            filter === 'all' ? 'No tasks yet!' :
            filter === 'pending' ? 'No pending tasks!' :
            'No completed tasks!' ;
            taskList.appendChild(noTasksMsg);
            return;
            }

        filteredTasks.forEach((task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
             <button class="delete-btn"><i class="fa-solid fa-minus"></i></button>
             </div>
            `;

            taskList.appendChild(taskItem);
        }))

        updateTaskCount();
    }

    //add new task 
    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    }


    // delete task 

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }

    //toggle task completeion 
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderTasks(currentFilter);
    }

    // edit task 
    function editTask(id, newText) {
        tasks = task.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task
        });

        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }

    // clear all tasks 
    function clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    // update task counts 
    function updateTaskCount() {
        const pendingTasks = task.filter (task => !task.completed).length;
        taskCount.textContent = `${pendingTasks} ${pendingTasks === 1 ? 'task' : 'tasks'} remaining`;
    }

    // save task to local storage 
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // event listeners 
    addTaskBtn.addEventListener('click' ,addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    clearAllBtn.addEventListener('click' , clearAllTasks);
    filterBtns.forEach(btn => {
        btn.addEventListener('click' , function() {
            filterBtns.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');
            const currentFilter = this.dataset.filter; 
            renderTasks(this.dataset.filter);
        });
    });

    // Event elegation for dynamic elements 
    taskList.addEventListener('click' , function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.id);

        // delete button 
        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskId);
        }

        // edit button 
        else if (e.target.closest('.edit-btn')) {
            const  taskText = taskItem.querySelector('.task-text');
            const currentText = taskText.textContent;
            const newText = prompt('Edit your task:', currentText);

            if (newText !== null && newText.trim() !== '') {
                editTask(taskId, newText.trim());
            }
        }
    });

    // initial render 
    renderTasks(); 

})