function initCameraButton(callback) {
    const cameraButton = document.getElementById("camera-button");
    cameraButton.addEventListener("click", callback);
}

export function initUI(callbacks) {
    initCameraButton(callbacks.cameraCallback);
}
