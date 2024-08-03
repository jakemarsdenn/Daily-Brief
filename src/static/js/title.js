window.addEventListener("DOMContentLoaded", function() {
    animateTitle();
    displayLocalDate();
});

function animateTitle() {
    const text = document.getElementById("title");
    const letters = text.textContent.split("");
    text.textContent = "";
    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${index * 100}ms`;
        span.classList.add("loading");
        text.appendChild(span);
    });
}

function displayLocalDate() {
    const dateElement = document.getElementById("date");
    const currentDate = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const datePart = currentDate.toLocaleDateString(undefined, dateOptions);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timePart = currentDate.toLocaleTimeString(undefined, timeOptions);
    const commaPosition = datePart.indexOf(' ');
    const formattedDatePart = datePart.slice(0, commaPosition) + ',' + datePart.slice(commaPosition);
    const formattedDateTime = `${formattedDatePart}, ${timePart}`;
    dateElement.textContent = formattedDateTime;
}

