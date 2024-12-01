async function convertFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Conversion failed');
        }

        const blob = await response.blob();
        const downloadLink = document.getElementById('downloadLink');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';
    } catch (error) {
        alert('Error converting file: ' + error.message);
    }
}
