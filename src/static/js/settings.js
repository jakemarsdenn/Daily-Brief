document.addEventListener('DOMContentLoaded', () => {
    const settingsPanel = document.getElementById("settings-panel");
    const settingsButton = document.getElementById("settings-button")


    function showSettingsPanel(e) {
        e.preventDefault();
        e.stopPropagation();

        settingsPanel.style.display = "block";
        console.log("show");
    }
    settingsButton.addEventListener('click', showSettingsPanel);


    function hideSettingsPanel(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
            settingsPanel.style.display = "none";
            console.log("hide");
        }
    }
    document.addEventListener('click', hideSettingsPanel);

});