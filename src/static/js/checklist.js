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


    checklist.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('task-input')) {
            showEditingToolbar(e);
        }
    });


    checklist.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('task-input')) {
            showEditingToolbar(e);
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


    function showEditingToolbar(event) {
        event.preventDefault();

        const topToolbar = document.querySelector('.topToolbar');
        const bottomToolbar = document.querySelector('.bottomToolbar');

        const taskInput = event.target;
        const checkbox = taskInput.previousElementSibling;

        const { top, left } = checkbox.getBoundingClientRect();
        topToolbar.style.top = `${top + 35}px`;
        topToolbar.style.left = `${left + 35}px`;
        bottomToolbar.style.top = `${top + 95}px`;
        bottomToolbar.style.left = `${left + 35}px`;

        topToolbar.style.display = 'block';
        bottomToolbar.style.display = 'block';

        function hideToolbar(e) {
            if ((!topToolbar.contains(e.target) && e.target !== taskInput) ||
                (!bottomToolbar.contains(e.target) && e.target !== taskInput) || e.type === 'keydown'){
                topToolbar.style.display = 'none';
                bottomToolbar.style.display = 'none';
                document.removeEventListener('click', hideToolbar);
            }
        }
        document.addEventListener('click', hideToolbar);
        document.addEventListener('keydown', hideToolbar);
    }

});



