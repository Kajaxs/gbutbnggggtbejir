const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const file = req.files.file;

            // Ambil ekstensi file
            const fileExtension = file.name.split('.').pop().toLowerCase();
            let convertedFile;

            // Proses konversi file berdasarkan ekstensi
            if (fileExtension === 'pdf') {
                const pdfBytes = file.data;
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const text = await pdfDoc.getTextContent();
                const wordDoc = convertPdfToWord(text);
                convertedFile = wordDoc;
            } else if (fileExtension === 'docx') {
                const docxBuffer = file.data;
                const docText = await mammoth.extractRawText({ buffer: docxBuffer });
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage();
                page.drawText(docText.value);
                convertedFile = await pdfDoc.save();
            } else {
                throw new Error('Unsupported file type');
            }

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=converted-file.${fileExtension === 'pdf' ? 'docx' : 'pdf'}`);
            res.send(convertedFile);
        } catch (error) {
            res.status(500).send({ error: 'Conversion failed: ' + error.message });
        }
    } else {
        res.status(405).send({ error: 'Method Not Allowed' });
    }
};

function convertPdfToWord(text) {
    const docx = new Document();
    const paragraph = new Paragraph(text);
    docx.addParagraph(paragraph);
    return docx;
}
