let tasks = JSON.parse(localStorage.getItem('study_tasks')) || [
  {
    id: 1,
    title: 'Study Computer Networks Fundamentals',
    subject: 'Computer Networks',
    dueDate: '2026-10-12',
    priority: 'Medium',
    completed: true,
  },
  {
    id: 2,
    title: 'Complete Java Polymorphism Worksheet',
    subject: 'Java Programming',
    dueDate: '2026-10-15',
    priority: 'High',
    completed: false,
  }
];

let activeFilter = 'all';

// DOM Selectors
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskSubjectInput = document.getElementById('task-subject');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');

const tasksListEl = document.getElementById('tasks-list');
const statTotalEl = document.getElementById('stat-total');
const statCompletedEl = document.getElementById('stat-completed');
const statPendingEl = document.getElementById('stat-pending');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressSummary = document.getElementById('progress-summary');
const tabButtons = document.querySelectorAll('.tab-btn');

// Helpers
function saveTasks() {
  localStorage.setItem('study_tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  if (!dateStr) return 'No due date';
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, options);
}

// Render Logic
function displayTasks() {
  tasksListEl.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    tasksListEl.innerHTML = `<div class="empty-state">No tasks to display in this view.</div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    taskItem.innerHTML = `
      <div class="task-main">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleTask(${task.id})"
        />
        <div class="task-content">
          <span class="task-title">${task.title}</span>
          <div class="task-meta">
            <span class="badge badge-subject">${task.subject}</span>
            <span class="badge ${priorityClass}">${task.priority}</span>
            <span class="badge badge-date">📅 ${formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-icon" onclick="deleteTask(${task.id})" title="Delete task">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `;
    tasksListEl.appendChild(taskItem);
  });
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  statTotalEl.textContent = total;
  statCompletedEl.textContent = completed;
  statPendingEl.textContent = pending;

  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${pct}%`;
  progressSummary.textContent = `${completed} of ${total} tasks completed`;
}

// Handlers
function toggleTask(id) {
  tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
  displayTasks();
  updateStats();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  displayTasks();
  updateStats();
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    subject: taskSubjectInput.value,
    dueDate: taskDateInput.value,
    priority: taskPriorityInput.value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  
  taskTitleInput.value = '';
  taskDateInput.value = '';
  
  displayTasks();
  updateStats();
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    displayTasks();
  });
});

// Initial boot
displayTasks();
updateStats();