/**
 * StudySync - Student Productivity Dashboard Master Logic
 * Vanilla JavaScript implementation (ES6+), highly optimized, accessible,
 * with full persistent localStorage support.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. SELECTORS & STATE INITIALIZATION
  // ==========================================
  
  // Theme Toggle Elements
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  
  // Mobile Header Navigation Elements
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');
  
  // Task Manager Selector Elements
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskPriority = document.getElementById('task-priority');
  const taskList = document.getElementById('task-list');
  const taskCompletionBanner = document.getElementById('task-completion-banner');
  
  // Assignment Tracker Elements
  const assignmentForm = document.getElementById('assignment-form');
  const assignName = document.getElementById('assign-name');
  const assignSubject = document.getElementById('assign-subject');
  const assignDate = document.getElementById('assign-date');
  const assignStatus = document.getElementById('assign-status');
  const assignmentsGrid = document.getElementById('assignments-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const assignmentsCountBadge = document.getElementById('assignments-count-badge');
  
  // Study Timer Elements
  const timerBtnStart = document.getElementById('timer-btn-start');
  const timerBtnPause = document.getElementById('timer-btn-pause');
  const timerBtnReset = document.getElementById('timer-btn-reset');
  const timerAdjMinus = document.getElementById('timer-adj-minus');
  const timerAdjPlus = document.getElementById('timer-adj-plus');
  const timerCustomInput = document.getElementById('timer-custom-input');
  const timerText = document.getElementById('timer-text');
  const timerStatusText = document.getElementById('timer-status-text');
  const timerCycleType = document.getElementById('timer-cycle-type');
  const timerProgressRing = document.getElementById('timer-progress-ring');
  
  // Dashboard Metrics & Achievements
  const statsTotalTasks = document.getElementById('stats-total-tasks');
  const statsCompletedTasks = document.getElementById('stats-completed-tasks');
  const statsPendingAssignments = document.getElementById('stats-pending-assignments');
  const statsStudyHours = document.getElementById('stats-study-hours');
  const progressValCompletion = document.getElementById('progress-val-completion');
  const progressBarCompletion = document.getElementById('progress-bar-completion');
  const progressValAssignments = document.getElementById('progress-val-assignments');
  const progressBarAssignments = document.getElementById('progress-bar-assignments');
  const streakDaysDisplay = document.getElementById('streak-days-display');
  const streakIncrementBtn = document.getElementById('streak-increment-btn');
  const studyLogAmount = document.getElementById('study-log-amount');
  const studyLogBtn = document.getElementById('study-log-btn');
  const dateHighlight = document.getElementById('date-highlight');
  
  // Student Profile Elements
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileDisplayCourse = document.getElementById('profile-display-course');
  const profileDisplayGoal = document.getElementById('profile-display-goal');
  const profileUpdateForm = document.getElementById('profile-update-form');
  const editName = document.getElementById('edit-name');
  const editCourse = document.getElementById('edit-course');
  const editGoal = document.getElementById('edit-goal');
  
  // Contact & Feedback Form
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessage = document.getElementById('contact-message');
  const contactAlert = document.getElementById('contact-alert');
  const contactAlertText = document.getElementById('contact-alert-text');
  
  // Global Extras
  const backToTop = document.getElementById('back-to-top');
  const toastContainer = document.getElementById('toast-container');

  // Multi-state configuration
  let taskState = JSON.parse(localStorage.getItem('studysync_tasks')) || [];
  let assignmentState = JSON.parse(localStorage.getItem('studysync_assignments')) || [];
  let currentFilter = 'all';
  let studyHoursState = parseFloat(localStorage.getItem('studysync_study_hours')) || 12.5;
  let studyStreakState = parseInt(localStorage.getItem('studysync_study_streak')) || 5;

  // Set default due dates on form input to today + 3 days
  if (assignDate) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    assignDate.value = defaultDate.toISOString().split('T')[0];
  }

  // Set Human Header Date
  if (dateHighlight) {
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    dateHighlight.textContent = today.toLocaleDateString('en-US', dateOptions);
  }

  // Pre-seed mock database if empty to provide a beautiful initial loading dashboard experience
  if (taskState.length === 0) {
    taskState = [
      { id: 't1', text: 'Prepare syllabus paper summary for Computer Science', priority: 'medium', completed: false },
      { id: 't2', text: 'Review relational database Normal Forms assignment', priority: 'high', completed: false },
      { id: 't3', text: 'Commit first responsive UI code to GitHub', priority: 'low', completed: true }
    ];
    localStorage.setItem('studysync_tasks', JSON.stringify(taskState));
  }

  if (assignmentState.length === 0) {
    // Generate dates related to today to keep demonstration accurate
    const tPlus3 = new Date(); tPlus3.setDate(tPlus3.getDate() + 3);
    const tPlus7 = new Date(); tPlus7.setDate(tPlus7.getDate() + 7);
    const tMinus1 = new Date(); tMinus1.setDate(tMinus1.getDate() - 2);

    assignmentState = [
      { id: 'a1', name: 'Software Architectural Specification Proposal', subject: 'Computer Science', date: tPlus3.toISOString().split('T')[0], status: 'In Progress' },
      { id: 'a2', name: 'Differential Calculus Practicum Notebook', subject: 'Calculus', date: tPlus7.toISOString().split('T')[0], status: 'Pending' },
      { id: 'a3', name: 'Polymerization Chemical Synthesis Report', subject: 'Chemistry', date: tMinus1.toISOString().split('T')[0], status: 'Completed' }
    ];
    localStorage.setItem('studysync_assignments', JSON.stringify(assignmentState));
  }


  // ==========================================
  // 2. THEME CONTROLLER SYSTEM (Light / Dark)
  // ==========================================
  const activeTheme = localStorage.getItem('studysync_theme') || 'light';
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeUI(activeTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('studysync_theme', newTheme);
    updateThemeUI(newTheme);
    triggerToast(`Theme set to ${newTheme} mode!`, 'info');
  });

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      themeIconSun.classList.remove('hidden');
      themeIconMoon.classList.add('hidden');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeIconSun.classList.add('hidden');
      themeIconMoon.classList.remove('hidden');
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }


  // ==========================================
  // 3. RESPONSIVE MOBILE MENU SYSTEMS
  // ==========================================
  function toggleMobileMenu(forceClose = false) {
    const isOpen = menuToggle.classList.contains('active');
    const shouldClose = forceClose || isOpen;

    if (shouldClose) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      menuToggle.classList.add('active');
      mobileNav.classList.add('active');
      mobileNavOverlay.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  menuToggle.addEventListener('click', () => toggleMobileMenu());
  mobileNavOverlay.addEventListener('click', () => toggleMobileMenu(true));

  // Auto close menu drawer when navigation items are clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Handle header sticky appearance changes during system scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll reveal logic
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    trackActiveNavigation();
  });

  // Smooth back to top trigger
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Track active section to apply high contrast styles to navigation items
  /*function trackActiveNavigation() {
    const sections = document.querySelectorAll('main > section, header');
    let scrollPos = window.scrollY + 120; // accounting for sticky nav offsetting

    sections.forEach(section => {
      if (section.id) {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          // Sync desktop links
          desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section.id}`) {
              link.classList.add('active');
            }
          });

          // Sync mobile links
          mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section.id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  }*/


  // ==========================================
  // 4. TASK MANAGER LOGIC (LOCALSTORAGE ENGINE)
  // ==========================================
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textVal = taskInput.value.trim();
    if (!textVal) return;

    const newTask = {
      id: 'task_' + Date.now(),
      text: textVal,
      priority: taskPriority.value,
      completed: false
    };

    taskState.push(newTask);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
    triggerToast('New academic task added!', 'success');
  });

  function saveTasks() {
    localStorage.setItem('studysync_tasks', JSON.stringify(taskState));
    syncStateMetrics();
  }

  function renderTasks() {
    taskList.innerHTML = '';
    
    if (taskState.length === 0) {
      taskList.innerHTML = `
        <li class="empty-state pulse-element">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <p>No remaining tasks assigned. Create some to stay aligned!</p>
        </li>
      `;
      return;
    }

    // Sorting incomplete tasks first, then sorted by priority (high -> medium -> low)
    const sortedTasks = [...taskState].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });

    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.id = task.id;

      li.innerHTML = `
        <div class="task-item-left">
          <label class="checkbox-container">
            <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark completed">
            <span class="checkmark"></span>
          </label>
          <span class="task-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="task-meta">
          <span class="priority-tag priority-${task.priority}">${task.priority}</span>
          <button class="btn-delete" aria-label="Delete this task" title="Delete Task">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      // Set events on triggers
      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        const found = taskState.find(t => t.id === task.id);
        if (found) {
          found.completed = checkbox.checked;
          saveTasks();
          renderTasks();
          if (found.completed) {
            triggerToast('Task marked as completed!', 'success');
          }
        }
      });

      const delBtn = li.querySelector('.btn-delete');
      delBtn.addEventListener('click', () => {
        taskState = taskState.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
        triggerToast('Task removed.', 'info');
      });

      taskList.appendChild(li);
    });
  }


  // ==========================================
  // 5. ASSIGNMENT TRACKER (CRUD LOGIC ENGINE)
  // ==========================================
  assignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = assignName.value.trim();
    const subjectVal = assignSubject.value.trim();
    const dateVal = assignDate.value;
    const statusVal = assignStatus.value;

    if (!nameVal || !subjectVal || !dateVal) return;

    const newAssignment = {
      id: 'assign_' + Date.now(),
      name: nameVal,
      subject: subjectVal,
      date: dateVal,
      status: statusVal
    };

    assignmentState.push(newAssignment);
    localStorage.setItem('studysync_assignments', JSON.stringify(assignmentState));
    syncStateMetrics();
    renderAssignments();

    // Reset fields except defaults
    assignName.value = '';
    assignSubject.value = '';
    
    // Set focus back safely
    assignName.focus();
    triggerToast('New assignment timeline documented!', 'success');
  });

  // Filter Selection triggers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.getAttribute('data-filter');
      renderAssignments();
    });
  });

  function renderAssignments() {
    assignmentsGrid.innerHTML = '';

    const filtered = assignmentState.filter(assign => {
      if (currentFilter === 'all') return true;
      return assign.status === currentFilter;
    });

    assignmentsCountBadge.textContent = `Active Cards: ${filtered.length}`;

    if (filtered.length === 0) {
      assignmentsGrid.innerHTML = `
        <div class="empty-state pulse-element" style="grid-column: 1 / -1;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p>No assignments found matching selection criteria.</p>
        </div>
      `;
      return;
    }

    // Sort assignments with closest due date first
    const sortedAssignments = [...filtered].sort((a,b) => new Date(a.date) - new Date(b.date));

    sortedAssignments.forEach(assign => {
      const card = document.createElement('article');
      card.className = 'assignment-card';
      card.id = assign.id;

      // Create dynamic display variables
      const rawDate = new Date(assign.date + 'T00:00:00');
      const formattedDate = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const badgeClass = assign.status === 'Completed' ? 'badge-completed' :
                          assign.status === 'In Progress' ? 'badge-progress' : 'badge-pending';

      card.innerHTML = `
        <div class="assignment-top">
          <span class="assignment-subject">${escapeHtml(assign.subject)}</span>
          <button class="btn-delete-assignment" aria-label="Delete assignment card" title="Delete Assignment">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <h4 class="assignment-name">${escapeHtml(assign.name)}</h4>
        <div class="assignment-info-row">
          <div class="assignment-date" title="Due Date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${formattedDate}</span>
          </div>
          <!-- Dropdown Status Editor -->
          <select class="assignment-status-select badge ${badgeClass}" aria-label="Update assignment status">
            <option value="Pending" ${assign.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${assign.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${assign.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      `;

      // Event triggers on state dropdown mutation
      const select = card.querySelector('.assignment-status-select');
      select.addEventListener('change', (e) => {
        const found = assignmentState.find(a => a.id === assign.id);
        if (found) {
          found.status = e.target.value;
          localStorage.setItem('studysync_assignments', JSON.stringify(assignmentState));
          syncStateMetrics();
          renderAssignments();
          triggerToast(`Assignment updated to ${e.target.value}!`, 'info');
        }
      });

      // Delete Assignment
      const delBtn = card.querySelector('.btn-delete-assignment');
      delBtn.addEventListener('click', () => {
        assignmentState = assignmentState.filter(a => a.id !== assign.id);
        localStorage.setItem('studysync_assignments', JSON.stringify(assignmentState));
        syncStateMetrics();
        renderAssignments();
        triggerToast('Assignment listing removed.', 'info');
      });

      assignmentsGrid.appendChild(card);
    });
  }


  // ==========================================
  // 6. DEEP MULTI-FLOW SYNCHRONIZATION METRICS
  // ==========================================
  function syncStateMetrics() {
    // 1. Core Task metrics variables
    const totalTasks = taskState.length;
    const completedTasks = taskState.filter(t => t.completed).length;
    
    // Core visual display bindings
    if (statsTotalTasks) statsTotalTasks.textContent = totalTasks;
    if (statsCompletedTasks) statsCompletedTasks.textContent = completedTasks;

    const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    if (progressValCompletion) progressValCompletion.textContent = `${taskPercentage}%`;
    if (progressBarCompletion) progressBarCompletion.style.width = `${taskPercentage}%`;

    if (taskCompletionBanner) {
      taskCompletionBanner.textContent = `${completedTasks}/${totalTasks} Tasks Done (${taskPercentage}%)`;
    }

    // 2. Core Assignment State tracking
    const totalAssignments = assignmentState.length;
    const completedAssignments = assignmentState.filter(a => a.status === 'Completed').length;
    const pendingAssignments = totalAssignments - completedAssignments;

    if (statsPendingAssignments) statsPendingAssignments.textContent = pendingAssignments;

    const assignPercentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
    if (progressValAssignments) progressValAssignments.textContent = `${assignPercentage}%`;
    if (progressBarAssignments) progressBarAssignments.style.width = `${assignPercentage}%`;

    // 3. Sync Other Persistent metrics
    if (statsStudyHours) statsStudyHours.textContent = studyHoursState.toFixed(1);
    if (streakDaysDisplay) streakDaysDisplay.textContent = `${studyStreakState} Consecutive Days`;
    // Check if streak is already logged today, updating the button's interactiveness
    const todayStr = new Date().toDateString();
    const lastStreakDate = localStorage.getItem('studysync_last_streak_date');
    if (streakIncrementBtn) {
      if (lastStreakDate === todayStr) {
        streakIncrementBtn.disabled = true;
        streakIncrementBtn.setAttribute('disabled', 'true');
        streakIncrementBtn.title = "Streak already logged for today!";
        streakIncrementBtn.style.opacity = "0.5";
        streakIncrementBtn.style.cursor = "not-allowed";
      } else {
        streakIncrementBtn.disabled = false;
        streakIncrementBtn.removeAttribute('disabled');
        streakIncrementBtn.title = "Extend daily streak!";
        streakIncrementBtn.style.opacity = "1";
        streakIncrementBtn.style.cursor = "pointer";
      }
    }
  }


  // ==========================================
  // 7. STUDY REACTION TOOLS (Hours & Streaks)
  // ==========================================
  if (studyLogBtn) {
    studyLogBtn.addEventListener('click', () => {
      const value = parseFloat(studyLogAmount.value);
      if (isNaN(value) || value <= 0) {
        triggerToast('Invalid hours logged.', 'error');
        return;
      }

      studyHoursState += value;
      localStorage.setItem('studysync_study_hours', studyHoursState.toString());
      syncStateMetrics();
      triggerToast(`Successfully logged ${value} additional study hours!`, 'success');
    });
  }

  if (streakIncrementBtn) {
    streakIncrementBtn.addEventListener('click', () => {
      const todayStr = new Date().toDateString();
      const lastStreakDate = localStorage.getItem('studysync_last_streak_date');
      
      if (lastStreakDate === todayStr) {
        triggerToast("Daily streak already logged for today! Come back tomorrow! 🌟", "info");
        return;
      }

      studyStreakState += 1;
      localStorage.setItem('studysync_study_streak', studyStreakState.toString());
      localStorage.setItem('studysync_last_streak_date', todayStr);
      syncStateMetrics();
      triggerToast('Daily study streak extended! Keep going! 🔥', 'success');
    });
  }


  // ==========================================
  // 8. INTERACTIVE STUDY TIMER ENGINE
  // ==========================================
  let timerInterval = null;
  let timerMinutes = 25;
  let timerSeconds = 0;
  let timerIsActive = false;
  let timerMaxDuration = 25 * 60; // tracks max duration to compute SVG stroke ring percentage correctly

  // Retrieve any previously configured timer duration from localStorage or default to 25
  let savedDuration = parseInt(localStorage.getItem('studysync_timer_duration')) || 25;
  if (timerCustomInput) {
    timerCustomInput.value = savedDuration;
  }
  timerMinutes = savedDuration;
  timerMaxDuration = savedDuration * 60;

  function updateTimerDisplay() {
    const formattedMins = String(timerMinutes).padStart(2, '0');
    const formattedSecs = String(timerSeconds).padStart(2, '0');
    timerText.textContent = `${formattedMins}:${formattedSecs}`;

    // Calculate circular ring SVG offset metrics
    const totalSecondsRemaining = timerMinutes * 60 + timerSeconds;
    const ringPercentage = timerMaxDuration > 0 ? (totalSecondsRemaining / timerMaxDuration) : 0;
    const strokeDashOffset = 760 - (760 * ringPercentage);
    
    if (timerProgressRing) {
      timerProgressRing.style.strokeDashoffset = strokeDashOffset;
    }
  }

  function applyCustomTime(durationMins) {
    let minutes = parseInt(durationMins);
    if (isNaN(minutes) || minutes < 1) {
      minutes = 1;
    } else if (minutes > 180) {
      minutes = 180;
    }
    
    if (timerCustomInput) {
      timerCustomInput.value = minutes;
    }
    
    localStorage.setItem('studysync_timer_duration', minutes.toString());
    
    timerMinutes = minutes;
    timerSeconds = 0;
    timerMaxDuration = minutes * 60;
    
    pauseTimer();
    updateTimerDisplay();
  }

  // Set events for adjust buttons
  if (timerAdjMinus) {
    timerAdjMinus.addEventListener('click', () => {
      let val = parseInt(timerCustomInput.value) || 25;
      val = Math.max(1, val - 5);
      applyCustomTime(val);
      triggerToast('Study duration adjusted!', 'info');
    });
  }

  if (timerAdjPlus) {
    timerAdjPlus.addEventListener('click', () => {
      let val = parseInt(timerCustomInput.value) || 25;
      val = Math.min(180, val + 5);
      applyCustomTime(val);
      triggerToast('Study duration adjusted!', 'info');
    });
  }

  if (timerCustomInput) {
    timerCustomInput.addEventListener('change', () => {
      let val = parseInt(timerCustomInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 180) val = 180;
      applyCustomTime(val);
      triggerToast(`Timer set to ${val} minutes!`, 'info');
    });
  }

  function startTimer() {
    if (timerIsActive) return;

    // Lock input selectors during active study session countdown
    if (timerCustomInput) timerCustomInput.disabled = true;
    if (timerAdjMinus) timerAdjMinus.disabled = true;
    if (timerAdjPlus) timerAdjPlus.disabled = true;

    timerIsActive = true;
    timerInterval = setInterval(() => {
      if (timerSeconds === 0) {
        if (timerMinutes === 0) {
          clearInterval(timerInterval);
          alarmToneFinish();
          
          triggerToast('Study session complete! Excellent focus and effort.', 'success');
          
          // Dynamically log study hours based on the actual duration completed
          const completedHours = (timerMaxDuration / 3600);
          studyHoursState += completedHours;
          localStorage.setItem('studysync_study_hours', studyHoursState.toString());
          syncStateMetrics();
          
          resetTimer();
          return;
        }

        timerMinutes -= 1;
        timerSeconds = 59;
      } else {
        timerSeconds -= 1;
      }

      timerStatusText.textContent = 'Learning in progress...';
      updateTimerDisplay();
    }, 1000);

    timerBtnStart.classList.add('hidden');
    timerBtnPause.classList.remove('hidden');
  }

  function pauseTimer() {
    timerIsActive = false;
    clearInterval(timerInterval);
    timerInterval = null;
    timerStatusText.textContent = 'Timer paused';
    
    // Enable controls while paused
    if (timerCustomInput) timerCustomInput.disabled = false;
    if (timerAdjMinus) timerAdjMinus.disabled = false;
    if (timerAdjPlus) timerAdjPlus.disabled = false;

    // Toggle Button View Layouts
    timerBtnStart.classList.remove('hidden');
    timerBtnPause.classList.add('hidden');
  }

  function resetTimer() {
    pauseTimer();
    const duration = parseInt(timerCustomInput ? timerCustomInput.value : 25) || 25;
    applyCustomTime(duration);
    timerStatusText.textContent = 'Ready to study';
    triggerToast('Timer state restored.', 'info');
  }

  timerBtnStart.addEventListener('click', startTimer);
  timerBtnPause.addEventListener('click', pauseTimer);
  timerBtnReset.addEventListener('click', resetTimer);


  // ==========================================
  // 9. REUSABLE CUSTOM AUDIO OSCILLATOR SYNTH
  // ==========================================
  function alarmToneFinish() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Ring sound sequential pattern
      const times = [0, 0.2, 0.4];
      times.forEach((start) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + start); // crisp high A node
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.18);
      });
    } catch(err) {
      console.log('Oscillator not allowed by browser security protocols until click interaction.');
    }
  }


  // ==========================================
  // 10. STUDENT PROFILE LOGIC INTERACTION
  // ==========================================
  if (profileUpdateForm) {
    profileUpdateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newName = editName.value.trim();
      const newCourse = editCourse.value.trim();
      const newGoal = editGoal.value.trim();

      if (!newName || !newCourse || !newGoal) return;

      // Persist profile to standard localStorage
      const userProfile = { name: newName, course: newCourse, goal: newGoal };
      localStorage.setItem('studysync_profile_meta', JSON.stringify(userProfile));

      // Update values in HTML view live
      profileDisplayName.textContent = newName;
      profileDisplayCourse.textContent = newCourse;
      profileDisplayGoal.textContent = newGoal;

      triggerToast('Student profile information successfully saved!', 'success');
    });

    // Populate profile from localStorage if exists
    const storedProfile = JSON.parse(localStorage.getItem('studysync_profile_meta'));
    if (storedProfile) {
      profileDisplayName.textContent = storedProfile.name;
      profileDisplayCourse.textContent = storedProfile.course;
      profileDisplayGoal.textContent = storedProfile.goal;

      // Populate input values
      editName.value = storedProfile.name;
      editCourse.value = storedProfile.course;
      editGoal.value = storedProfile.goal;
    }
  }


  // ==========================================
  // 11. CONTACT & FEEDBACK SUBMISSION VALIDATION
  // ==========================================
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactAlert.style.display = 'none';

    let hasErrors = false;

    // Validate Name
    const nameVal = contactName.value.trim();
    const nameFeedback = document.getElementById('name-feedback');
    if (nameVal.length < 2) {
      nameFeedback.classList.add('error-message');
      contactName.setAttribute('aria-invalid', 'true');
      hasErrors = true;
    } else {
      nameFeedback.classList.remove('error-message');
      contactName.removeAttribute('aria-invalid');
    }

    // Validate Email format regex
    const emailVal = contactEmail.value.trim();
    const emailFeedback = document.getElementById('email-feedback');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      emailFeedback.classList.add('error-message');
      contactEmail.setAttribute('aria-invalid', 'true');
      hasErrors = true;
    } else {
      emailFeedback.classList.remove('error-message');
      contactEmail.removeAttribute('aria-invalid');
    }

    // Validate Messages
    const messageVal = contactMessage.value.trim();
    const messageFeedback = document.getElementById('message-feedback');
    if (!messageVal) {
      messageFeedback.classList.add('error-message');
      contactMessage.setAttribute('aria-invalid', 'true');
      hasErrors = true;
    } else {
      messageFeedback.classList.remove('error-message');
      contactMessage.removeAttribute('aria-invalid');
    }

    // Process output or display feedback alerts
    if (hasErrors) {
      triggerToast('Please complete all form fields correctly.', 'error');
      return;
    }

    // Simulating Success Event
    contactAlert.style.display = 'flex';
    contactAlertText.innerHTML = `Excellent, <strong>${escapeHtml(nameVal)}</strong>! Your valuable suggestions has been submitted successfully to our team.`;
    
    // Clear Form Fields
    contactName.value = '';
    contactEmail.value = '';
    contactMessage.value = '';

    triggerToast('Thank you! Feedback received.', 'success');
  });


  // ==========================================
  // 12. UTILITY HELPER & INTERACTIVE COMPONENT
  // ==========================================
  
  // Custom toast notification trigger engine
  function triggerToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-info'}`;
    
    // Use proper informative symbol icons
    const icon = type === 'success' ? 
      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-green);"><polyline points="20 6 9 17 4 12"></polyline></svg>` :
      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-blue-dark);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `
      ${icon}
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Timeout trigger slide out animation
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3200);
  }

  // Escape HTML helper function preventing cross-site scripting (XSS) injection flaws
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  // ==========================================
  // 13. ACCESSIBLE SCROLL REVEAL METRICS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve once revealed to save CPU performance cycles
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(elem => {
      elem.classList.add('revealed');
    });
  }


  // ==========================================
  // 14. INITIATE FIRST MOUNT RENDERS
  // ==========================================
  syncStateMetrics();
  renderTasks();
  renderAssignments();
  applyCustomTime(savedDuration);
});

