function initCameraButton(callback) {
    const cameraButton = document.getElementById("camera-button");
    cameraButton.addEventListener("click", callback);
}

function initChangeScenePanel(callback) {
    const shadingSelect = document.getElementById("shading-select");
    shadingSelect.addEventListener("change", (event) => {
        callback(event.target.value);
    });
}

export function initUI(callbacks) {
    initCameraButton(callbacks.cameraCallback);
    initChangeScenePanel(callbacks.shadingCallback);
}
