document.addEventListener('DOMContentLoaded', () => {
    const checklist = document.querySelector('.checklist');
    const topToolbar = document.querySelector('.topToolbar');
    const bottomToolbar = document.querySelector('.bottomToolbar');
    let activeTaskInput = null;

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


    // needs improvement
    checklist.addEventListener('change', (e) => {
        if (e.target.classList.contains('checkbox')) {
            const taskInput = e.target.nextElementSibling;
            if (e.target.checked) {
                // Store the current color before changing to grey
                taskInput.dataset.originalColor = window.getComputedStyle(taskInput).color;
                taskInput.style.color = 'grey';
            } else {
                // Restore the stored color when unchecked
                taskInput.style.color = taskInput.dataset.originalColor;
            }
            saveChecklist();
        }
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
                text: taskInput.value,
                color: window.getComputedStyle(taskInput).color,
                fontWeight: taskInput.style.fontWeight,
                fontStyle: taskInput.style.fontStyle,
                textDecoration: taskInput.style.textDecoration
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
            savedItems.forEach(({ checked, text, color, fontWeight, fontStyle, textDecoration }) => {
                const newItem = document.createElement('div');
                newItem.classList.add('checklist-item');
                newItem.innerHTML = `
                <input type="checkbox" class="checkbox" ${checked ? 'checked' : ''}>
                <input type="text" class="task-input" placeholder="Task" value="${text}" style="color: ${color}; 
                font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}" 
                data-original-color="${color}">
            `;
                checklist.appendChild(newItem);
            });
        }
    }


    function showEditingToolbar(e) {
        e.preventDefault();
        activeTaskInput = e.target;

        const taskInput = activeTaskInput;
        const checkbox = taskInput.previousElementSibling;

        const { top, left } = checkbox.getBoundingClientRect();
        topToolbar.style.top = `${top + 35}px`;
        topToolbar.style.left = `${left + 35}px`;
        bottomToolbar.style.top = `${top + 95}px`;
        bottomToolbar.style.left = `${left + 35}px`;

        topToolbar.style.display = 'block';
        bottomToolbar.style.display = 'block';
    }


    function handleColorChange(e) {
        if (activeTaskInput && e.target.classList.contains('colour-button')) {
            const selectedColor = window.getComputedStyle(e.target).backgroundColor;
            activeTaskInput.style.color = selectedColor;
            saveChecklist();
        }
    }
    document.querySelectorAll('.colour-button').forEach(button => {
        button.addEventListener('click', handleColorChange);
    });


    function handleStyleChange(e) {
        if (activeTaskInput && e.currentTarget.classList.contains('button-icon')) {
            console.log(`Style button clicked: ${e.currentTarget.id}`);
            switch (e.currentTarget.id) {
                case 'bold-button':
                    activeTaskInput.style.fontWeight = 'bold';
                    break;
                case 'italics-button':
                    activeTaskInput.style.fontStyle = 'italic';
                    break;
                case 'underline-button':
                    activeTaskInput.style.textDecoration = 'underline';
                    break;
                case 'strikethrough-button':
                    activeTaskInput.style.textDecoration = 'line-through';
                    break;
            }
            saveChecklist();
        }
    }
    document.querySelectorAll('.button-icon').forEach(button => {
        button.addEventListener('click', handleStyleChange);
    });


    function hideToolbar(e) {
        if ((!topToolbar.contains(e.target) && e.target !== activeTaskInput) ||
            (!bottomToolbar.contains(e.target) && e.target !== activeTaskInput) || e.type === 'keydown') {
            topToolbar.style.display = 'none';
            bottomToolbar.style.display = 'none';
            activeTaskInput = null;
        }
    }
    document.addEventListener('click', hideToolbar);
    document.addEventListener('keydown', hideToolbar);


    window.onbeforeunload = function(e) {
        saveChecklist(e);
    };
});