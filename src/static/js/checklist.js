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


    checklist.addEventListener('change', (e) => {
        if (e.target.classList.contains('checkbox')) {
            const taskInput = e.target.nextElementSibling;

            if (e.target.checked) {
                // Store the current color and decoration before making changes
                taskInput.dataset.originalColor = window.getComputedStyle(taskInput).color;
                taskInput.dataset.originalDecoration = window.getComputedStyle(taskInput).textDecoration;

                taskInput.style.textDecoration = 'line-through';
                taskInput.style.color = '#AEB1B5';

            } else {
                // Restore the stored color and decoration when unchecked
                taskInput.style.color = taskInput.dataset.originalColor;
                taskInput.style.textDecoration = taskInput.dataset.originalDecoration;

                // handle bug where grey stays grey
                if (taskInput.style.color === 'rgb(128, 128, 128)'){
                    taskInput.style.color = 'black';
                }
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
                color: taskInput.style.color,
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

        updateButtonStatus();
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
        if (activeTaskInput && e.currentTarget.classList.contains('style-button')) {
            switch (e.currentTarget.id) {
                case 'bold-button':
                    activeTaskInput.style.fontWeight = activeTaskInput.style.fontWeight === 'bold' ? 'normal' : 'bold';
                    break;
                case 'italics-button':
                    activeTaskInput.style.fontStyle = activeTaskInput.style.fontStyle === 'italic' ? 'normal' : 'italic';
                    break;
                case 'underline-button':
                    activeTaskInput.style.textDecoration = activeTaskInput.style.textDecoration === 'underline' ? 'none' : 'underline';
                    break;
            }
            updateButtonStatus();
            saveChecklist();
        }
    }
    document.querySelectorAll('.style-button').forEach(button => {
        button.addEventListener('click', handleStyleChange);
    });


    function updateButtonStatus() {
        const isBold = activeTaskInput.style.fontWeight === 'bold';
        const isItalic = activeTaskInput.style.fontStyle === 'italic';
        const isUnderline = activeTaskInput.style.textDecoration.includes('underline');

        // If style matches, make button background grey, otherwise, make it white
        document.getElementById('bold-button').style.backgroundColor = isBold ? '#E8E8E8' : 'white';
        document.getElementById('italics-button').style.backgroundColor = isItalic ? '#E8E8E8' : 'white';
        document.getElementById('underline-button').style.backgroundColor = isUnderline ? '#E8E8E8' : 'white';
    }


    function hideToolbar(e) {
        if ((topToolbar.style.display === 'block' || bottomToolbar.style.display === 'block') &&
            (!topToolbar.contains(e.target) && !bottomToolbar.contains(e.target) && e.target !== activeTaskInput) ||
            e.type === 'keydown') {
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