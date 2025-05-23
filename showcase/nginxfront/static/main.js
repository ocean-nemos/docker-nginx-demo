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

document.addEventListener('DOMContentLoaded', async () => {
    const addProjectBtn = document.getElementById('add-project');
    const projectCardsContainer = document.querySelector('.project-cards');
    
    // Function to set active project card
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
});