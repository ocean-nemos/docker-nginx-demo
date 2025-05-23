// Function to add delete event to a card
function addDeleteEvent(card) {
    const deleteBtn = card.querySelector('.delete-project');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering card selection
            card.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addProjectBtn = document.getElementById('add-project');

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

    // Add click event to initial project cards and add delete event
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => setActiveProject(card));
        addDeleteEvent(card);
    });

    // Add new project button click handler
    addProjectBtn.addEventListener('click', () => {
        const projectName = prompt('Enter project name:');
        if (projectName && projectName.trim() !== '') {
            // Generate a random color
            const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#9B5DE5'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Create new project card
            const newCard = document.createElement('div');
            newCard.className = 'project-card';
            newCard.setAttribute('data-id', Date.now()); // Use timestamp as ID
            
            newCard.innerHTML = `
                <div class="project-color" style="background-color: ${randomColor};"></div>
                <div class="project-info">
                    <h3>${projectName}</h3>
                    <span class="task-count">0 tasks</span>
                </div>
                <button class="delete-project" title="Delete project">&times;</button>
            `;
            
            // Add click event to the new card using the shared function
            newCard.addEventListener('click', () => setActiveProject(newCard));
            addDeleteEvent(newCard);
            
            // Add to project cards container
            document.querySelector('.project-cards').appendChild(newCard);
            
            // Make the new card active
            setActiveProject(newCard);
        }
    });
});