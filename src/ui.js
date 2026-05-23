function initCameraButton(callback) {
    const cameraButton = document.getElementById("camera-button");
    cameraButton.addEventListener("click", callback);
}

function initChangeScenePanel(callback) {
    /* Most of this code found here: https://blog.logrocket.com/creating-custom-select-dropdown-css/ */
    const customSelects = document.querySelectorAll(".custom-select");
    customSelects.forEach((customSelect) => {

        const selectButton = customSelect.querySelector(".select-button");
        const dropdown = customSelect.querySelector(".select-dropdown");

        const options = dropdown.querySelectorAll("li");
        const selectedValue = selectButton.querySelector(".selected-value");

        const toggleDropdown = (expand = null) => {
            const isOpen =
                expand !== null ? expand : dropdown.classList.contains("hidden");
            dropdown.classList.toggle("hidden", !isOpen);
            selectButton.setAttribute("aria-expanded", isOpen);
        };
        const handleOptionSelect = (option) => {
            options.forEach((opt) => opt.classList.remove("selected"));
            option.classList.add("selected");
            selectedValue.textContent = option.textContent.trim(); // Update selected value
            callback(option.dataset.value);
        };

        options.forEach((option) => {
            option.addEventListener("click", () => {
                handleOptionSelect(option);
                toggleDropdown(false);
            });
            option.addEventListener("keydown", (event) => {
                if (event.key === 'Enter' || event.keyCode === 13) {
                    handleOptionSelect(option);
                    toggleDropdown(false);
                }
            });
        });

        selectButton.addEventListener("click", () => {
            toggleDropdown();
        });

        document.addEventListener("click", (event) => {
            const isOutsideClick = !customSelect.contains(event.target);
            if (isOutsideClick) {
                toggleDropdown(false);
            }
        });
    });
}

export function initUI(callbacks) {
    initCameraButton(callbacks.cameraCallback);
    initChangeScenePanel(callbacks.shadingCallback);
}
