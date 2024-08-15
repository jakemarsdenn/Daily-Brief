document.addEventListener('DOMContentLoaded', () => {
    const checklist = document.getElementById('checklist');
    const topToolbar = document.getElementById('top-toolbar');
    const bottomToolbar = document.getElementById('bottom-toolbar');
    let activeTaskInput = null;
    let textOn;
    let highlightOn;

    loadChecklist();


    function loadChecklist() {
        checklist.innerHTML = '';
        // Retrieve checklist state with Web Storage API
        const savedItems = JSON.parse(localStorage.getItem('checklist'));

        if (savedItems) {
            savedItems.forEach(({ checked, text, color, originalColor, backgroundColor, fontWeight, fontStyle, textDecoration}) => {
                const newItem = document.createElement('div');
                newItem.classList.add('checklist-item');
                newItem.innerHTML = `
                    <input type="checkbox" class="checkbox" name="checkbox" ${checked ? 'checked' : ''}>
                    <input type="text" class="task-input" name="task-input" placeholder="Task" value="${text}" 
                    style="color: ${color}; background-color: ${backgroundColor}; font-weight: ${fontWeight}; 
                    font-style: ${fontStyle}; text-decoration: ${textDecoration}" data-original-color="${originalColor}">
                `;
                checklist.appendChild(newItem);
            });
        }
        updateProgressBar();
    }


    function saveChecklist() {
        const items = Array.from(checklist.children).map(item => {
            const checkbox = item.querySelector('.checkbox');
            const taskInput = item.querySelector('.task-input');
            return {
                checked: checkbox.checked,
                text: taskInput.value,
                color: taskInput.style.color,
                originalColor: taskInput.dataset.originalColor,
                backgroundColor: taskInput.style.backgroundColor,
                fontWeight: taskInput.style.fontWeight,
                fontStyle: taskInput.style.fontStyle,
                textDecoration: taskInput.style.textDecoration
            };
        });
        // Store checklist state with Web Storage API
        localStorage.setItem('checklist', JSON.stringify(items));
    }


    function addChecklistItem(currentInput) {
        const newItem = document.createElement('div');
        newItem.classList.add('checklist-item');
        newItem.innerHTML = `
            <input type="checkbox" class="checkbox" name="checkbox">
            <input type="text" class="task-input" name="task-input" placeholder="Task">
        `;
        checklist.insertBefore(newItem, currentInput.parentElement.nextSibling);
        newItem.querySelector('.task-input').focus();
        saveChecklist();
    }


    function deleteChecklistItem(currentInput) {
        const currentItem = currentInput.parentElement;
        const previousItem = currentItem.previousElementSibling;
        const nextItem = currentItem.nextElementSibling;

        if (checklist.children.length > 1) {
            currentItem.remove();
            saveChecklist();
        }
        if (nextItem) {
            const nextInput = nextItem.querySelector('.task-input');
            nextInput.focus();
            nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
        } else if (previousItem) {
            // If the deleted item was the first item, move focus to the previous item
            const previousInput = previousItem.querySelector('.task-input');
            previousInput.focus();
            previousInput.setSelectionRange(previousInput.value.length, previousInput.value.length);
        }
    }


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


    function handleCheckboxChange(e) {
        if (e.target.classList.contains('checkbox')) {
            const taskInput = e.target.nextElementSibling;

            if (e.target.checked) {
                // Store the current color and decoration before making changes
                taskInput.dataset.originalColor = window.getComputedStyle(taskInput).color;
                taskInput.dataset.originalDecoration = window.getComputedStyle(taskInput).textDecoration;

                taskInput.style.textDecoration = 'line-through';
                taskInput.style.color = 'rgb(128, 128, 128)';

            } else {
                // Restore the stored color and decoration when unchecked
                if (taskInput.dataset.originalColor === 'rgb(128, 128, 128)'){
                    taskInput.style.color = 'rgb(35, 37, 41)'
                }
                else {
                    taskInput.style.color = taskInput.dataset.originalColor;
                }
                taskInput.style.textDecoration = taskInput.dataset.originalDecoration || 'none';
            }

            updateProgressBar()
            updateStyleButtonsStatus();
            saveChecklist();
        }
    }
    checklist.addEventListener('change', handleCheckboxChange);


    function navigateChecklist(currentInput, direction) {
        const currentItem = currentInput.parentElement;
        let targetItem;
        if (direction === 'up') {
            targetItem = currentItem.previousElementSibling;
        } else if (direction === 'down') {
            targetItem = currentItem.nextElementSibling;
        }
        if (targetItem) {
            const targetInput = targetItem.querySelector('.task-input');
            targetInput.focus();
            // Set the cursor to the end of the input text
            targetInput.setSelectionRange(targetInput.value.length, targetInput.value.length);
        }
    }


    function showEditingToolbar(e) {
        e.preventDefault();
        activeTaskInput = e.target;

        textOn = true;
        highlightOn = false;

        const taskInput = activeTaskInput;
        const checkbox = taskInput.previousElementSibling;

        const { top, left } = checkbox.getBoundingClientRect();
        topToolbar.style.top = `${top + 35}px`;
        topToolbar.style.left = `${left + 35}px`;
        bottomToolbar.style.top = `${top + 95}px`;
        bottomToolbar.style.left = `${left + 35}px`;

        topToolbar.style.display = 'block';
        bottomToolbar.style.display = 'block';

        toggleTextButtonsStatus();
        updateStyleButtonsStatus();
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
    // Custom event when settings panel is opened
    document.addEventListener('hideToolbar', hideToolbar);


    function text() {
        if (!textOn) {
            textOn = true;
            highlightOn = false;
            toggleTextButtonsStatus();
        }
    }
    document.getElementById('text-colour-button').addEventListener('click', text);


    function highlight() {
        if (!highlightOn) {
            highlightOn = true;
            textOn = false;
            toggleTextButtonsStatus();
        }
    }
    document.getElementById('highlight-colour-button').addEventListener('click', highlight);


    function highlightText(color) {
        activeTaskInput.style.backgroundColor = color;
    }


    function toggleTextButtonsStatus() {
        document.getElementById('text-colour-button').style.backgroundColor = textOn ? '#f7f7f7' : 'white';
        document.getElementById('highlight-colour-button').style.backgroundColor = highlightOn ? '#f7f7f7' : 'white';
    }


    function handleStyleChange(e) {
        if (activeTaskInput && e.currentTarget.classList.contains('style-button')) {
            // Uncheck the checkbox if it's currently checked
            const checkbox = activeTaskInput.previousElementSibling;
            if (checkbox && checkbox.type === 'checkbox' && checkbox.checked) {
                checkbox.checked = false;
                handleCheckboxChange({ target: checkbox });
            }

            switch (e.currentTarget.id) {
                case 'bold-button':
                    activeTaskInput.style.fontWeight = activeTaskInput.style.fontWeight === 'bold' ? 'normal' : 'bold';
                    break;
                case 'italics-button':
                    activeTaskInput.style.fontStyle = activeTaskInput.style.fontStyle === 'italic' ? 'normal' : 'italic';
                    break;
                case 'underline-button':
                    activeTaskInput.style.textDecoration = activeTaskInput.style.textDecoration.trim().split(/\s+/)[0] === 'underline' ? 'none' : 'underline';
                    break;
            }
            updateStyleButtonsStatus();
            updateProgressBar();
            saveChecklist();
        }
    }
    document.querySelectorAll('.style-button').forEach(button => {
        button.addEventListener('click', handleStyleChange);
    });


    function updateStyleButtonsStatus() {
        const isBold = activeTaskInput ? activeTaskInput.style.fontWeight === 'bold' : false;
        const isItalic = activeTaskInput ? activeTaskInput.style.fontStyle === 'italic' : false;
        const isUnderline = activeTaskInput
            ? activeTaskInput.style.textDecoration.trim().split(/\s+/)[0] === 'underline'
            : false;

        // If style matches, make button background grey, otherwise, make it white
        document.getElementById('bold-button').style.backgroundColor = isBold ? '#f7f7f7' : 'white';
        document.getElementById('italics-button').style.backgroundColor = isItalic ? '#f7f7f7' : 'white';
        document.getElementById('underline-button').style.backgroundColor = isUnderline ? '#f7f7f7' : 'white';
    }


    function handleColorChange(e) {
        // Change text colour
        if (textOn) {
            activeTaskInput.style.color = window.getComputedStyle(e.target).backgroundColor;
            activeTaskInput.style.textDecorationColor = activeTaskInput.style.color;
        }
        // Change highlight colour
        else {
            highlightText(window.getComputedStyle(e.target).backgroundColor);
        }
        saveChecklist();
    }
    document.querySelectorAll('.colour-button').forEach(button => {
        button.addEventListener('click', handleColorChange);
    });


    function updateProgressBar() {
        const items = checklist.children.length;
        const checkedItems = Array.from(checklist.children).filter(item =>
            item.querySelector('.checkbox').checked).length;
        const progressBar = document.getElementById('progress-bar');
        progressBar.value = checkedItems;
        progressBar.max = items;
    }


    window.onbeforeunload = function() {
        saveChecklist();
    };
});