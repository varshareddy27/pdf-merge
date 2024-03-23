const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pdf = require('pdf-parse');
const pdfMerger = new PDFMerger();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/merge', async (req, res) => {
  try {
    const pdfs = req.files;
    if (!pdfs || pdfs.length === 0) {
      return res.status(400).json({ error: 'No PDFs provided' });
    }

    for (const pdf of pdfs) {
      const pdfData = await pdf(pdf.path);
      pdfMerger.addBuffer(Buffer.from(pdfData.data));
    }

    const mergedPdf = await pdfMerger.saveAsBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(mergedPdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});