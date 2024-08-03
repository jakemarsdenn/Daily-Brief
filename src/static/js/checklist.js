document.addEventListener('DOMContentLoaded', () => {
    const checklist = document.querySelector('.checklist');

    checklist.addEventListener('keydown', (e) => {
        const currentInput = e.target;
        if (e.target.classList.contains('task-input')) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCheckbox(currentInput);
            } else if (e.key === 'Backspace' && currentInput.value === '') {
                e.preventDefault();
                deleteCheckbox(currentInput);
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
    });

    function addCheckbox(currentInput) {
        const newItem = document.createElement('div');
        newItem.classList.add('checklist-item');
        newItem.innerHTML = `
            <input type="checkbox" class="checkbox">
            <input type="text" class="task-input" placeholder="Task">
        `;
        checklist.insertBefore(newItem, currentInput.parentElement.nextSibling);
        newItem.querySelector('.task-input').focus();
    }

    function deleteCheckbox(currentInput) {
        const currentItem = currentInput.parentElement;
        const previousItem = currentItem.previousElementSibling;
        if (previousItem) {
            previousItem.querySelector('.task-input').focus();
        }
        if (checklist.children.length > 1) {
            currentItem.remove();
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
});
