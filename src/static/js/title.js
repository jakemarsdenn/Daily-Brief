window.addEventListener("DOMContentLoaded", function() {
    const enableAnimation = localStorage.getItem("animationEnabled") !== "false";
    if (enableAnimation) {
        animateTitle();
    } else {
        showTitleImmediately();
    }
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


function showTitleImmediately() {
    const text = document.getElementById("title");
    text.style.color = 'black'
    text.style.display='block';
}


function displayLocalDate() {
    const dateElement = document.getElementById("date");
    const date = new Date();
    const localTime = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    const localDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    const localDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    dateElement.textContent = localDay + ", " + localDate + ", " + localTime
    setTimeout(displayLocalDate, 1000);
}

