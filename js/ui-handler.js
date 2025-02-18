import { createTemplate } from './image-processor.js';
import { getDimensions } from './battery-config.js';

const errorEl = document.getElementById('error-message');
const downloadLink = document.getElementById('download-link');

async function handleGenerate() {
    errorEl.style.display = 'none';

    const outputCanvas = document.getElementById('outputCanvas');
    const mainDiv = document.getElementById('mainDiv')
    const columns = parseInt(document.getElementById('columns').value);
    const rows = parseInt(document.getElementById('rows').value);
    const fileInput = document.getElementById('image-upload');
    const showGuides = document.getElementById('cutting-guides').checked;
    const scaleToFit = document.getElementById('scale-fit').checked;
    const paperType = document.getElementById('paper-select').value
    const batteryType = document.getElementById('battery-select').value
    const includeOverlap = document.getElementById('include-overlap').checked

    if (!fileInput.files[0]) {
        showError('Please select an image file');
        return;
    }

    try {
        const img = await loadImage(fileInput.files[0]);
        const canvas = await createTemplate(img, batteryType, columns, rows, showGuides, scaleToFit, paperType, includeOverlap);

        if (outputCanvas) outputCanvas.remove()
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = `battery-wraps-${Date.now()}.png`;
        downloadLink.style.display = 'block';
        canvas.id = 'outputCanvas'
        mainDiv.appendChild(canvas)
    } catch (err) {
        showError(err);
    }
}

function onPaperSelect(value){
    if(value=='custom'){

    }
}


function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject('Error loading image');
        img.src = URL.createObjectURL(file);
    });
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

window.handleGenerate = handleGenerate;
window.onPaperSelect = onPaperSelect;