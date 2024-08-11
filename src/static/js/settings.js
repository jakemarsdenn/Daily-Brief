document.addEventListener('DOMContentLoaded', () => {
    const settingsPanel = document.getElementById("settings-panel");
    const settingsButton = document.getElementById("settings-button")


    function showSettingsPanel(e) {
        e.preventDefault();
        e.stopPropagation();
        document.dispatchEvent(new CustomEvent('hideToolbar'));

        settingsPanel.style.display = "block";
    }
    settingsButton.addEventListener('click', showSettingsPanel);


    function hideSettingsPanel(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
            settingsPanel.style.display = "none";
        }
    }
    document.addEventListener('click', hideSettingsPanel);

});