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


    const taskInputs = document.querySelectorAll('.task-input');

    taskInputs.forEach(taskInput => {
        taskInput.addEventListener('dblclick', showEditingToolbar);
        taskInput.addEventListener('contextmenu', showEditingToolbar);
    });


    function showEditingToolbar(event) {
        event.preventDefault();

        let topToolbar = document.querySelector('.topToolbar');
        let bottomToolbar = document.querySelector('.bottomToolbar');

        if (!topToolbar) {
            topToolbar = document.createElement('div');
            topToolbar.className = 'toolbar';

            bottomToolbar = document.createElement('div');
            bottomToolbar.className = 'toolbar';

            const topButtonsHTML = `
                <button class="text-button">Text</button>
                <button class="text-button">Highlight</button>
                <button class="icon-button">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M16 64c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 128c0 53 43 96 96 96s96-43 96-96l0-128-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 128c0 88.4-71.6 160-160 160s-160-71.6-160-160L64 96 48 96C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
                <button class="icon-button">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M0 64C0 46.3 14.3 32 32 32l48 0 16 0 128 0c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128L96 480l-16 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-160L48 96 32 96C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64L112 96l0 128 112 0zM112 288l0 128 144 0c35.3 0 64-28.7 64-64s-28.7-64-64-64l-32 0-112 0z"/>
                    </svg>
                </button>
                <button class="icon-button">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><
                        <path d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0L160 416l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0L224 96l-64 0c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
                <button class="icon-button">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l448 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-209.9 0-.4-.1-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3c0 0 0 0 0 0s0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6c0 0 0 0 0 0l.2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1l-75.7 0c7 5.6 11.4 11.2 13.9 17.2z"/>
                    </svg>
                </button>
            `;

            const bottomButtonsHTML = `
                <span id="text-indicator">Text</span>
                <button class="colour-button color-black"></button>
                <button class="colour-button color-grey"></button>
                <button class="colour-button color-red"></button>
                <button class="colour-button color-pink"></button>
                <button class="colour-button color-orange"></button>
                <button class="colour-button color-yellow"></button>
                <button class="colour-button color-green"></button>
                <button class="colour-button color-light-blue"></button>
                <button class="colour-button color-dark-blue"></button>
                <button class="colour-button color-purple"></button>
            `;

            topToolbar.innerHTML = topButtonsHTML;
            bottomToolbar.innerHTML = bottomButtonsHTML;

            document.body.appendChild(topToolbar);
            document.body.appendChild(bottomToolbar);
        }

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
            (!bottomToolbar.contains(e.target) && e.target !== taskInput)) {
                topToolbar.style.display = 'none';
                bottomToolbar.style.display = 'none';
                document.removeEventListener('click', hideToolbar);
            }
        }
        document.addEventListener('click', hideToolbar);
    }

});

