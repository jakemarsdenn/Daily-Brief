document.addEventListener('DOMContentLoaded', () => {
    const checklist = document.querySelector('.checklist');

    loadChecklist();

    checklist.addEventListener('keydown', (e) => {
        const currentInput = e.target;
        if (e.target.classList.contains('task-input')) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addChecklistItem(currentInput);
            } else if (e.key === 'Backspace' && currentInput.value === '') {
                e.preventDefault();
                deleteChecklistItem(currentInput);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateChecklist(currentInput, 'up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateChecklist(currentInput, 'down');
            }
        }
    });

    checklist.addEventListener('change', (e) => {
        if (e.target.classList.contains('checkbox')) {
            const taskInput = e.target.nextElementSibling;
            if (e.target.checked) {
                taskInput.style.color = 'grey';
            } else {
                taskInput.style.color = 'black';
                taskInput.style.textDecoration = 'none';
            }
        }
        saveChecklist();
    });

    function addChecklistItem(currentInput) {
        const newItem = document.createElement('div');
        newItem.classList.add('checklist-item');
        newItem.innerHTML = `
            <input type="checkbox" class="checkbox">
            <input type="text" class="task-input" placeholder="Task">
        `;
        checklist.insertBefore(newItem, currentInput.parentElement.nextSibling);
        newItem.querySelector('.task-input').focus();
        saveChecklist();
    }

    function deleteChecklistItem(currentInput) {
        const currentItem = currentInput.parentElement;
        const previousItem = currentItem.previousElementSibling;
        if (previousItem) {
            const previousInput = previousItem.querySelector('.task-input');
            previousInput.focus();
            previousInput.setSelectionRange(previousInput.value.length, previousInput.value.length);
        }
        if (checklist.children.length > 1) {
            currentItem.remove();
            saveChecklist();
        }
    }

    function navigateChecklist(currentInput, direction) {
        const currentItem = currentInput.parentElement;
        let targetItem;
        if (direction === 'up') {
            targetItem = currentItem.previousElementSibling;
        } else if (direction === 'down') {
            targetItem = currentItem.nextElementSibling;
        }
        if (targetItem) {
            targetItem.querySelector('.task-input').focus();
        }
    }

    function saveChecklist() {
        const items = Array.from(checklist.children).map(item => {
            const checkbox = item.querySelector('.checkbox');
            const taskInput = item.querySelector('.task-input');
            return {
                checked: checkbox.checked,
                text: taskInput.value
            };
        });
        // Store checklist state with Web Storage API
        localStorage.setItem('checklist', JSON.stringify(items));
    }

    function loadChecklist() {
        checklist.innerHTML = '';
        // Retrieve checklist state with Web Storage API
        const savedItems = JSON.parse(localStorage.getItem('checklist'));
        if (savedItems) {
            savedItems.forEach(({ checked, text }) => {
                const newItem = document.createElement('div');
                newItem.classList.add('checklist-item');
                newItem.innerHTML = `
                    <input type="checkbox" class="checkbox" ${checked ? 'checked' : ''}>
                    <input type="text" class="task-input" placeholder="Task" value="${text}">
                `;
                checklist.appendChild(newItem);
            });
        }
    }
});
