async function convertFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const downloadLink = document.getElementById('downloadLink');

    if (fileExtension === 'pdf') {
        // Convert PDF to Word
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pdfText = await pdfDoc.getTextContent();
        const docxContent = convertPdfToWord(pdfText);
        const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';
    } else if (fileExtension === 'docx') {
        // Convert Word to PDF
        const arrayBuffer = await file.arrayBuffer();
        const docxContent = await mammoth.extractRawText({ arrayBuffer });
        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage();
        const text = page.addText(docxContent.value, { size: 12 });
        const blob = await pdfDoc.save();
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';
    } else {
        alert("Invalid file type. Please upload a PDF or Word document.");
    }
}

function convertPdfToWord(text) {
    // Convert PDF text to Word format (basic example, real conversion can be more complex)
    const docx = new Docxtemplater();
    docx.loadFromFile('template.docx');
    docx.setData({ text: text });
    docx.render();
    return docx.getZip().generate({ type: 'blob' });
}
