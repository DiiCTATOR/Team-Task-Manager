const API_URL = '/api';
let currentUser = null;
let currentView = 'dashboard';
let users = [];
let projects = [];
let tasks = [];

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authForm = document.getElementById('auth-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const registerFields = document.getElementById('register-fields');
const authSubmitBtn = document.getElementById('auth-submit');
const authError = document.getElementById('auth-error');
const modalOverlay = document.getElementById('modal-overlay');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');

// Init
const init = () => {
  const token = localStorage.getItem('token');
  if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    showDashboard();
  } else {
    showAuth();
  }
};

// Auth Logic
let isLogin = true;
tabLogin.addEventListener('click', () => {
  isLogin = true;
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  registerFields.style.display = 'none';
  authSubmitBtn.innerText = 'Login';
  authError.innerText = '';
});
tabRegister.addEventListener('click', () => {
  isLogin = false;
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerFields.style.display = 'block';
  authSubmitBtn.innerText = 'Register';
  authError.innerText = '';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  try {
    let res;
    if (isLogin) {
      res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } else {
      const name = document.getElementById('auth-name').value;
      const role = document.getElementById('auth-role').value;
      res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
    }
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    currentUser = data;
    showDashboard();
  } catch (err) {
    authError.innerText = err.message;
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  showAuth();
});

// Navigation
const showAuth = () => {
  authScreen.style.display = 'flex';
  dashboardScreen.style.display = 'none';
};

const showDashboard = async () => {
  authScreen.style.display = 'none';
  dashboardScreen.style.display = 'flex';
  
  document.getElementById('user-name-display').innerText = currentUser.name;
  document.getElementById('user-role-display').innerText = currentUser.role;
  document.getElementById('user-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
  
  if (currentUser.role === 'Admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'inline-block');
  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }

  await fetchData();
  renderDashboard();
};

const fetchData = async () => {
  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  try {
    const [uRes, pRes, tRes] = await Promise.all([
      fetch(`${API_URL}/auth/users`, { headers }),
      fetch(`${API_URL}/projects`, { headers }),
      fetch(`${API_URL}/tasks`, { headers })
    ]);
    
    if (uRes.ok) users = await uRes.json();
    if (pRes.ok) projects = await pRes.json();
    if (tRes.ok) tasks = await tRes.json();
  } catch (err) {
    console.error('Error fetching data', err);
  }
};

// Render Views
document.getElementById('nav-dashboard').addEventListener('click', (e) => {
  e.preventDefault(); updateNav('dashboard'); renderDashboard();
});
document.getElementById('nav-projects').addEventListener('click', (e) => {
  e.preventDefault(); updateNav('projects'); renderProjects();
});
document.getElementById('nav-tasks').addEventListener('click', (e) => {
  e.preventDefault(); updateNav('tasks'); renderTasks();
});

const updateNav = (view) => {
  currentView = view;
  document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
  document.getElementById(`nav-${view}`).classList.add('active');
  pageTitle.innerText = view.charAt(0).toUpperCase() + view.slice(1);
};

const renderDashboard = () => {
  const myTasks = tasks.filter(t => t.assignee && t.assignee._id === currentUser._id);
  const pending = myTasks.filter(t => t.status === 'pending').length;
  const inProgress = myTasks.filter(t => t.status === 'in-progress').length;
  const completed = myTasks.filter(t => t.status === 'completed').length;
  
  let html = `
    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <h3>Total Projects</h3>
        <div class="value">${projects.length}</div>
      </div>
      <div class="stat-card glass-panel">
        <h3>My Pending Tasks</h3>
        <div class="value">${pending}</div>
      </div>
      <div class="stat-card glass-panel">
        <h3>My In-Progress</h3>
        <div class="value">${inProgress}</div>
      </div>
      <div class="stat-card glass-panel">
        <h3>My Completed</h3>
        <div class="value">${completed}</div>
      </div>
    </div>
    <h3 style="margin-bottom:1rem;">My Recent Tasks</h3>
    <div class="grid">
      ${myTasks.slice(0, 6).map(taskCard).join('')}
    </div>
  `;
  contentArea.innerHTML = html;
};

const renderProjects = () => {
  contentArea.innerHTML = `
    <div class="grid">
      ${projects.map(p => `
        <div class="card glass-panel">
          <div class="card-header">
            <h3 class="card-title">${p.name}</h3>
            ${currentUser.role === 'Admin' ? `<button onclick="deleteProject('${p._id}')" class="btn-outline" style="padding:0.25rem 0.5rem; width:auto; border:none;">🗑️</button>` : ''}
          </div>
          <p style="color:var(--text-muted); margin-bottom:1rem; font-size:0.9rem">${p.description || 'No description'}</p>
          <div style="font-size:0.8rem; color:var(--text-muted)">Owner: ${p.owner.name}</div>
        </div>
      `).join('')}
    </div>
  `;
};

const renderTasks = () => {
  contentArea.innerHTML = `
    <div class="grid">
      ${tasks.map(taskCard).join('')}
    </div>
  `;
};

const taskCard = (t) => {
  let isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
  return `
    <div class="card glass-panel">
      <div class="card-header">
        <h3 class="card-title">${t.title}</h3>
        <span class="badge ${isOverdue ? 'overdue' : t.status}">${isOverdue ? 'Overdue' : t.status}</span>
      </div>
      <p style="color:var(--text-muted); margin-bottom:1rem; font-size:0.9rem">${t.description || ''}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted)">
        <span>${t.project ? t.project.name : 'No Project'}</span>
        <span>Assignee: ${t.assignee ? t.assignee.name : 'Unassigned'}</span>
      </div>
      ${(currentUser.role === 'Admin' || (t.assignee && t.assignee._id === currentUser._id)) ? `
        <div style="margin-top:1rem; display:flex; gap:0.5rem">
          <select class="status-select" onchange="updateTaskStatus('${t._id}', this.value)" style="flex:1; background:var(--bg-color); color:white; border:1px solid var(--border-color); border-radius:4px; padding:0.25rem">
            <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="in-progress" ${t.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
          ${currentUser.role === 'Admin' ? `<button onclick="deleteTask('${t._id}')" class="btn-outline" style="padding:0.25rem 0.5rem; width:auto;">Delete</button>` : ''}
        </div>
      ` : ''}
    </div>
  `;
};

// Modals
document.getElementById('create-new-btn').addEventListener('click', () => {
  if (currentView === 'projects') openProjectModal();
  else openTaskModal();
});
document.getElementById('close-modal').addEventListener('click', () => modalOverlay.style.display = 'none');

const openProjectModal = () => {
  document.getElementById('modal-title').innerText = 'Create Project';
  document.getElementById('modal-body').innerHTML = `
    <form id="project-form">
      <div class="input-group">
        <label>Project Name</label>
        <input type="text" id="proj-name" required>
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea id="proj-desc" rows="3"></textarea>
      </div>
      <button type="submit" class="btn-primary">Create</button>
    </form>
  `;
  modalOverlay.style.display = 'flex';
  document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('proj-name').value;
    const description = document.getElementById('proj-desc').value;
    await apiCall('/projects', 'POST', { name, description });
    modalOverlay.style.display = 'none';
    await fetchData(); renderProjects();
  });
};

const openTaskModal = () => {
  if (projects.length === 0) {
    alert("Please create a project first.");
    return;
  }
  document.getElementById('modal-title').innerText = 'Create Task';
  document.getElementById('modal-body').innerHTML = `
    <form id="task-form">
      <div class="input-group">
        <label>Task Title</label>
        <input type="text" id="task-title" required>
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea id="task-desc" rows="2"></textarea>
      </div>
      <div class="input-group">
        <label>Project</label>
        <select id="task-proj">
          ${projects.map(p => `<option value="${p._id}">${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="input-group">
        <label>Assignee</label>
        <select id="task-assignee">
          <option value="">Unassigned</option>
          ${users.map(u => `<option value="${u._id}">${u.name}</option>`).join('')}
        </select>
      </div>
      <div class="input-group">
        <label>Due Date</label>
        <input type="date" id="task-date">
      </div>
      <button type="submit" class="btn-primary">Create</button>
    </form>
  `;
  modalOverlay.style.display = 'flex';
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-desc').value,
      project: document.getElementById('task-proj').value,
      assignee: document.getElementById('task-assignee').value || null,
      dueDate: document.getElementById('task-date').value || null
    };
    await apiCall('/tasks', 'POST', body);
    modalOverlay.style.display = 'none';
    await fetchData(); renderTasks();
  });
};

window.updateTaskStatus = async (id, status) => {
  await apiCall(`/tasks/${id}`, 'PUT', { status });
  await fetchData();
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'tasks') renderTasks();
};

window.deleteProject = async (id) => {
  if(confirm('Are you sure? This deletes all associated tasks.')) {
    await apiCall(`/projects/${id}`, 'DELETE');
    await fetchData(); renderProjects();
  }
};

window.deleteTask = async (id) => {
  if(confirm('Delete task?')) {
    await apiCall(`/tasks/${id}`, 'DELETE');
    await fetchData(); renderTasks();
  }
};

const apiCall = async (endpoint, method, body) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    const error = await res.json();
    alert(error.message);
  }
  return res.json();
};

init();
