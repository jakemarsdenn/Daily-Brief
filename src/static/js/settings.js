document.addEventListener('DOMContentLoaded', () => {
    const settingsPanel = document.getElementById("settings-panel");
    const settingsButton = document.getElementById("settings-button")
    const imageUploadButton = document.getElementById("upload-image-button")
    const removeImageButton = document.getElementById("remove-image-button")

    loadBackgroundImage();


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


    function uploadImage(e) {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
                // Save the image in localStorage
                localStorage.setItem('backgroundImage', imageUrl);
                removeImageButton.style.display="block";
            };
            reader.readAsDataURL(file);

        } else {
            alert('Please upload a valid image file.');
        }
    }
    imageUploadButton.addEventListener('change', uploadImage)


    function loadBackgroundImage() {
        const storedImage = localStorage.getItem('backgroundImage');
        if (storedImage) {
            document.body.style.backgroundImage = `url('${storedImage}')`;
            console.log("image is stored")
            removeImageButton.style.display="block";
        }
        else {
            removeImageButton.style.display = "none";
        }
    }


    function removeBackgroundImage() {
        document.body.style.backgroundImage = '';
        localStorage.removeItem('backgroundImage');
        this.style.display = 'none';
    }
    removeImageButton.addEventListener('click', removeBackgroundImage);

});