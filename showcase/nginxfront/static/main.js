// Global variable to track the current project
let currentProject = null;

// Function to add delete event to a card
function addDeleteEvent(card) {
    const deleteBtn = card.querySelector('.delete-project');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent triggering card selection

            // Get project ID to delete from backend
            const projectId = card.getAttribute('data-id');

            try {
                const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    card.remove();
                    console.log(`Project ${projectId} deleted successfully`);
                } else {
                    console.error(`Failed to delete project: ${response.status}`);
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        });
    }
}

// Create a project card element from project data
function createProjectCard(project) {
    // Generate a color based on project ID for consistency
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#9B5DE5'];
    const colorIndex = project.id % colors.length;
    const projectColor = colors[colorIndex];

    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    card.innerHTML = `
        <div class="project-color" style="background-color: ${projectColor};"></div>
        <div class="project-info">
            <h3>${project.name}</h3>
            <span class="task-count">${project.tasks ? project.tasks.length : 0} tasks</span>
        </div>
        <button class="delete-project" title="Delete project">&times;</button>
    `;

    return card;
}

// Function to create a task card element
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);

    // Format the due date
    const dueDate = new Date(task.due_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Create tags HTML
    const tagsHtml = task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('');

    card.innerHTML = `
        <span class="task-type ${task.type}">${task.type.replace('_', ' ')}</span>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="task-meta">
            <span>Due: ${dueDate}</span>
            <span>${task.completed ? '✅ Done' : '⏳ Pending'}</span>
        </div>
        <div class="task-tags">
            ${tagsHtml}
        </div>
    `;

    // Add click event to open modal
    card.addEventListener('click', () => openTaskModal(task));

    return card;
}

// Function to open and populate the task modal
function openTaskModal(task) {
    const modal = document.getElementById('task-modal');
    const titleInput = document.getElementById('modal-task-title');
    const descriptionInput = document.getElementById('modal-task-description');
    const dueDateInput = document.getElementById('modal-task-due-date');
    const typeSelect = document.getElementById('modal-task-type');
    const completedCheckbox = document.getElementById('modal-task-completed');
    const createdDateInput = document.getElementById('modal-task-created-date');

    // Format dates
    const formattedDueDate = new Date(task.due_at).toISOString().split('T')[0];
    const formattedCreatedDate = new Date(task.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Populate modal with task data
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dueDateInput.value = formattedDueDate;
    typeSelect.value = task.type;
    completedCheckbox.checked = task.completed;
    createdDateInput.value = formattedCreatedDate;

    // Store current task ID and created_at in the modal
    modal.setAttribute('data-task-id', task.id);
    modal.setAttribute('data-project-id', currentProject.id);
    modal.setAttribute('data-task-created', task.created_at);

    // Show the modal
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const addProjectBtn = document.getElementById('add-project');
    const addTaskBtn = document.getElementById('add-task');
    const projectCardsContainer = document.querySelector('.project-cards');
    const taskGrid = document.querySelector('.task-grid');
    const currentProjectNameElement = document.getElementById('current-project-name');
    const saveDataBtn = document.getElementById('save-data');

    // Add save data functionality
    saveDataBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            const originalText = saveDataBtn.textContent;
            saveDataBtn.textContent = 'Saving...';
            saveDataBtn.disabled = true;

            const response = await fetch('http://localhost:8000/admin/save', {
                method: 'POST'
            });

            if (response.ok) {
                // Show success indication
                saveDataBtn.textContent = '✅ Saved!';
                setTimeout(() => {
                    saveDataBtn.textContent = originalText;
                    saveDataBtn.disabled = false;
                }, 2000);
            } else {
                console.error(`Failed to save data: ${response.status}`);
                saveDataBtn.textContent = '❌ Error!';
                setTimeout(() => {
                    saveDataBtn.textContent = originalText;
                    saveDataBtn.disabled = false;
                }, 2000);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            saveDataBtn.textContent = '❌ Error!';
            setTimeout(() => {
                saveDataBtn.textContent = 'Save Data';
                saveDataBtn.disabled = false;
            }, 2000);
        }
    });

    // Function to load tasks for the selected project
    async function loadProjectTasks(projectId) {
        try {
            taskGrid.innerHTML = '<div class="loading">Loading tasks...</div>';

            const response = await fetch(`http://localhost:8000/projects/${projectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const project = await response.json();
            currentProject = project;

            // Update project name in the header
            currentProjectNameElement.textContent = `${project.name} Tasks`;

            // Clear existing tasks
            taskGrid.innerHTML = '';

            if (!project.tasks || project.tasks.length === 0) {
                taskGrid.innerHTML = '<div class="no-tasks">No tasks yet. Create one!</div>';
                return;
            }

            // Add each task as a card
            project.tasks.forEach(task => {
                const card = createTaskCard(task);
                taskGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading tasks:', error);
            taskGrid.innerHTML = '<div class="error">Error loading tasks. Please try again.</div>';
        }
    }

    // Updated function to set active project and load its tasks
    const setActiveProject = (clickedCard) => {
        // Query for ALL project cards (including dynamically added ones)
        const allProjectCards = document.querySelectorAll('.project-card');

        // Remove active class from all cards
        allProjectCards.forEach(card => card.classList.remove('active'));

        // Add active class to clicked card
        clickedCard.classList.add('active');

        // Get project ID
        const projectId = clickedCard.getAttribute('data-id');
        console.log(`Selected project ID: ${projectId}`);

        // Load tasks for this project
        loadProjectTasks(projectId);
    };

    // Function to fetch and render all projects
    async function fetchAndRenderProjects() {
        try {
            const response = await fetch('http://localhost:8000/projects');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const projects = await response.json();

            // Clear existing projects
            projectCardsContainer.innerHTML = '';

            // Add each project as a card
            projects.forEach(project => {
                const card = createProjectCard(project);
                projectCardsContainer.appendChild(card);

                // Add click event to the card
                card.addEventListener('click', () => setActiveProject(card));
                addDeleteEvent(card);
            });

            // If there are projects, make the first one active
            if (projects.length > 0) {
                const firstCard = projectCardsContainer.querySelector('.project-card');
                if (firstCard) {
                    setActiveProject(firstCard);
                }
            } else {
                // No projects, show empty state
                taskGrid.innerHTML = '<div class="no-projects">No projects available. Create one to get started!</div>';
            }

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    // Load projects when page loads
    await fetchAndRenderProjects();

    // Add new project button click handler
    addProjectBtn.addEventListener('click', async () => {
        const projectName = prompt('Enter project name:');
        if (projectName && projectName.trim() !== '') {
            const projectDescription = prompt('Enter project description (optional):') || '';

            try {
                const response = await fetch('http://localhost:8000/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: projectName,
                        description: projectDescription,
                        tasks: []
                    })
                });

                if (response.ok) {
                    const newProject = await response.json();

                    // Create and add the new card
                    const newCard = createProjectCard(newProject);
                    projectCardsContainer.appendChild(newCard);

                    // Add event listeners
                    newCard.addEventListener('click', () => setActiveProject(newCard));
                    addDeleteEvent(newCard);

                    // Make the new card active
                    setActiveProject(newCard);
                } else {
                    console.error('Failed to create project:', response.status);
                }
            } catch (error) {
                console.error('Error creating project:', error);
            }
        }
    });

    // Add new task button click handler
    addTaskBtn.addEventListener('click', async () => {
        if (!currentProject) {
            alert('Please select a project first');
            return;
        }

        const taskTitle = prompt('Enter task title:');
        if (taskTitle && taskTitle.trim() !== '') {
            const taskDescription = prompt('Enter task description (optional):') || '';
            const taskDueDate = prompt('Enter due date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);

            try {
                const response = await fetch(`http://localhost:8000/projects/${currentProject.id}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: taskTitle,
                        description: taskDescription,
                        completed: false,
                        due_at: taskDueDate,
                        type: 'todo',
                        tags: []
                    })
                });

                if (response.ok) {
                    // Reload the current project's tasks
                    loadProjectTasks(currentProject.id);

                    // Also refresh the project cards to update task counts
                    await fetchAndRenderProjects();

                    // Re-select the current project
                    const projectCard = document.querySelector(`.project-card[data-id="${currentProject.id}"]`);
                    if (projectCard) {
                        setActiveProject(projectCard);
                    }
                } else {
                    console.error('Failed to create task:', response.status);
                }
            } catch (error) {
                console.error('Error creating task:', error);
            }
        }
    });

    // Modal functionality
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const updateTaskBtn = document.getElementById('modal-update-task');
    const deleteTaskBtn = document.getElementById('modal-delete-task');

    // Close modal when clicking the X button
    closeModalBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });

    // Update task button handler
    updateTaskBtn.addEventListener('click', async () => {
        const taskId = taskModal.getAttribute('data-task-id');
        const projectId = taskModal.getAttribute('data-project-id');
        const taskCreatedAt = taskModal.getAttribute('data-task-created');

        const titleInput = document.getElementById('modal-task-title');
        const descriptionInput = document.getElementById('modal-task-description');
        const dueDateInput = document.getElementById('modal-task-due-date');
        const typeSelect = document.getElementById('modal-task-type');
        const completedCheckbox = document.getElementById('modal-task-completed');

        try {
            const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: taskId,
                    title: titleInput.value,
                    description: descriptionInput.value,
                    due_at: dueDateInput.value,
                    created_at: taskCreatedAt,
                    type: typeSelect.value,
                    completed: completedCheckbox.checked,
                    // Preserve existing tags
                    tags: currentProject.tasks.find(t => t.id == taskId)?.tags || []
                })
            });

            if (response.ok) {
                // Close the modal
                taskModal.style.display = 'none';

                // Refresh tasks
                loadProjectTasks(projectId);

                // Also refresh project cards to update task status counts
                await fetchAndRenderProjects();
            } else {
                console.error('Failed to update task:', response.status);
                alert('Failed to update task. Please try again.');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please try again.');
        }
    });

    // Delete task button handler
    deleteTaskBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskId = taskModal.getAttribute('data-task-id');
            const projectId = taskModal.getAttribute('data-project-id');

            try {
                const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Close the modal
                    taskModal.style.display = 'none';

                    // Refresh tasks
                    loadProjectTasks(projectId);

                    // Also refresh project cards to update counts
                    await fetchAndRenderProjects();
                } else {
                    console.error('Failed to delete task:', response.status);
                    alert('Failed to delete task. Please try again.');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task. Please try again.');
            }
        }
    });

    // Apply custom styling to select elements
    const styleSelects = () => {
        const selects = document.querySelectorAll('select.modal-input');

        selects.forEach(select => {
            // Skip if already enhanced
            if (select.parentElement.querySelector('.custom-select-wrapper')) {
                return;
            }

            // Create custom select wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';

            // Create the visible select replacement
            const customSelect = document.createElement('div');
            customSelect.className = 'custom-select-trigger';
            customSelect.style.padding = '10px';
            customSelect.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            customSelect.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            customSelect.style.borderRadius = '8px';
            customSelect.style.color = 'white';
            customSelect.style.cursor = 'pointer';
            customSelect.style.display = 'flex';
            customSelect.style.justifyContent = 'space-between';
            customSelect.style.alignItems = 'center';

            // Add the selected text and arrow
            customSelect.innerHTML = `
                <span class="custom-select-value">${select.options[select.selectedIndex].text}</span>
                <span class="custom-select-arrow">▼</span>
            `;

            // Hide the original select while keeping it functional
            select.style.display = 'none';

            // Insert our custom elements
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(customSelect);
            wrapper.appendChild(select);

            // Handle custom select click
            customSelect.addEventListener('click', (e) => {
                e.stopPropagation();

                // Check if a dropdown is already open and remove it
                const existingDropdown = document.querySelector('.custom-select-dropdown');
                if (existingDropdown) {
                    document.body.removeChild(existingDropdown);
                    return;
                }

                const options = Array.from(select.options);

                // Create custom dropdown
                const dropdown = document.createElement('div');
                dropdown.className = 'custom-select-dropdown';
                dropdown.style.position = 'absolute';
                dropdown.style.width = `${customSelect.offsetWidth}px`;
                dropdown.style.maxHeight = '200px';
                dropdown.style.overflowY = 'auto';
                dropdown.style.backgroundColor = '#2a2a2a';
                dropdown.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                dropdown.style.borderRadius = '8px';
                dropdown.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                dropdown.style.zIndex = '1000';
                dropdown.style.color = 'white';

                // Position dropdown
                const rect = customSelect.getBoundingClientRect();
                dropdown.style.left = `${rect.left}px`;
                dropdown.style.top = `${rect.top + customSelect.offsetHeight + 5}px`;

                // Add options to dropdown
                options.forEach((option, index) => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'custom-select-option';
                    optionEl.textContent = option.textContent;
                    optionEl.style.padding = '10px 15px';
                    optionEl.style.cursor = 'pointer';
                    optionEl.style.transition = 'background-color 0.2s';

                    if (select.selectedIndex === index) {
                        optionEl.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                        optionEl.style.color = '#6C63FF';
                    }

                    optionEl.addEventListener('mouseover', function () {
                        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    });

                    optionEl.addEventListener('mouseout', function () {
                        if (select.selectedIndex !== index) {
                            this.style.backgroundColor = 'transparent';
                        }
                    });

                    optionEl.addEventListener('click', function (e) {
                        e.stopPropagation();
                        select.selectedIndex = index;

                        // Update the custom select text
                        customSelect.querySelector('.custom-select-value').textContent = option.textContent;

                        document.body.removeChild(dropdown);

                        // Dispatch change event
                        const event = new Event('change', { bubbles: true });
                        select.dispatchEvent(event);
                    });

                    dropdown.appendChild(optionEl);
                });

                // Add dropdown to body
                document.body.appendChild(dropdown);

                // Close dropdown when clicking outside
                const closeDropdown = (e) => {
                    if (!dropdown.contains(e.target) && !customSelect.contains(e.target)) {
                        // Check if dropdown still exists in DOM before removing
                        if (dropdown.parentNode === document.body) {
                            document.body.removeChild(dropdown);
                        }
                        document.removeEventListener('click', closeDropdown);
                    }
                };

                // Add the event listener with a slight delay to avoid immediate closure
                setTimeout(() => {
                    document.addEventListener('click', closeDropdown);
                }, 10);
            });
        });
    };

    // Apply custom styling to selects when modal is opened
    const enhanceModal = () => {
        styleSelects();
    };

    // Call enhanceModal when showing the modal
    const originalOpenTaskModal = openTaskModal;
    openTaskModal = function (task) {
        originalOpenTaskModal(task);
        enhanceModal();
    };
});