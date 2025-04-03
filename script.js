// Function to get current month and year
function getCurrentMonthYear() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Set this up to run when the document loads
const monthFields = document.querySelectorAll('.month-field');

// Save and load functionality using localStorage
document.addEventListener('DOMContentLoaded', () => {

    
    if (monthFields) {
        monthFields.forEach(field => {
            field.textContent = getCurrentMonthYear();
        });
    }

    const editableElements = document.querySelectorAll('[contenteditable="true"]');

    // Load saved content or use defaults
    loadContent();

    // Add event listeners for saving content on edit
    editableElements.forEach(element => {
        element.addEventListener('blur', saveContent);
    });

    // Print button
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
        footerText.innerHTML = 'Last Updated on ' + new Date().toLocaleString();
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetToDefault);

    // Add click handlers for the add/remove buttons
    document.querySelectorAll('.add-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const section = e.target.closest('.section');
            const grid = section.querySelector('.grid');
            const newItem = createGridItem();
            grid.appendChild(newItem);
            saveContent();
        });
    });

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const section = e.target.closest('.section');
            const grid = section.querySelector('.grid');
            const items = grid.querySelectorAll('.grid-item');
            if (items.length > 0) {
                grid.removeChild(items[items.length - 1]);
                saveContent();
            }
        });
    });
});

function saveContent() {
    const content = {};

    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        // Use a unique identifier based on content and position
        const id = element.dataset.default + '-' + Array.from(element.parentNode.children).indexOf(element);
        content[id] = element.innerHTML;
    });

    localStorage.setItem('monthlyGoals', JSON.stringify(content));
}

function loadContent() {
    const savedContent = localStorage.getItem('monthlyGoals');

    if (savedContent) {
        const content = JSON.parse(savedContent);

        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            const id = element.dataset.default + '-' + Array.from(element.parentNode.children).indexOf(element);

            if (content[id]) {
                element.innerHTML = content[id];
            }
        });
    }
}

const footerText = document.querySelector('.footer-text');

function resetToDefault() {
    if (confirm('Reset all content to default values? This cannot be undone.')) {
        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            // Check if element is a month field
            if (element.classList.contains('month-field')) {
                element.innerHTML = getCurrentMonthYear();
            } else {
                element.innerHTML = element.dataset.default;
            }
            footerText.innerHTML = 'Last Updated on ' + new Date().toLocaleString() + ' | Made by Atman Pandya';
        });
        saveContent();
    }
}

// Add this new function to create a new grid item
function createGridItem() {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    const title = document.createElement('div');
    title.className = 'goal-title';
    title.contentEditable = true;
    title.dataset.default = 'New Goal';
    title.textContent = 'New Goal';

    const description = document.createElement('div');
    description.className = 'goal-description';
    description.contentEditable = true;
    description.dataset.default = 'Simple description of the very next physical action you will take to work on this project.';
    description.textContent = 'Simple description of the very next physical action you will take to work on this project.';

    gridItem.appendChild(title);
    gridItem.appendChild(description);

    // Add event listeners for saving content
    title.addEventListener('blur', saveContent);
    description.addEventListener('blur', saveContent);

    return gridItem;
}