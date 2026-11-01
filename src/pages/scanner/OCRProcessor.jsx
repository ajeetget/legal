
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { getDocument } from "pdfjs-dist";
import "./OCRProcessor.css";

function OCRProcessor({ files, language, onComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const startOCR = async () => {
    let worker;

    try {
      setIsProcessing(true);
      setProgress(0);
      setStatus("Initializing OCR...");

      worker = await createWorker(language, 1, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
            setStatus("Recognizing text...");
          }
        },
      });

      const extractedResults = [];
      let totalPages = 0;

      // Calculate total pages/images
      for (const file of files) {
        if (file.type === "application/pdf") {
          const pdf = await getDocument({
            data: new Uint8Array(await file.arrayBuffer()),
          }).promise;

          totalPages += pdf.numPages;
        } else {
          totalPages += 1;
        }
      }

      let completedPages = 0;

      // Process each selected file
      for (const file of files) {
        if (file.type === "application/pdf") {
          const pdf = await getDocument({
            data: new Uint8Array(await file.arrayBuffer()),
          }).promise;

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            setStatus(`Scanning ${file.name} - Page ${pageNumber}`);

            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 3 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
              canvasContext: context,
              viewport,
            }).promise;

            const result = await worker.recognize(canvas);

            extractedResults.push({
              fileName: file.name,
              pageNumber,
              text: result.data.text,
            });

            completedPages++;
            setProgress(Math.round((completedPages / totalPages) * 100));

            canvas.width = 0;
            canvas.height = 0;
          }
        } else {
          setStatus(`Scanning ${file.name}...`);

          const result = await worker.recognize(file);

          extractedResults.push({
            fileName: file.name,
            pageNumber: null,
            text: result.data.text,
          });

          completedPages++;
          setProgress(Math.round((completedPages / totalPages) * 100));
        }
      }

      onComplete(extractedResults);
      setStatus("Scanning completed!");
    } catch (error) {
      console.error("OCR Error:", error);
      setStatus("Unable to scan the document. Please try again.");
    } finally {
      if (worker) {
        await worker.terminate();
      }

      setIsProcessing(false);
    }
  };

  return (
    <div className="ocr-processor">
      <button
        type="button"
        className="scan-button"
        onClick={startOCR}
        disabled={isProcessing || !files.length}
      >
        {isProcessing ? "Scanning..." : "Start Scanning"}
      </button>

      {isProcessing && (
        <div className="ocr-progress">
          <p>{status}</p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span>{progress}%</span>
        </div>
      )}

      {!isProcessing && status && (
        <p className="ocr-status">{status}</p>
      )}
    </div>
  );
}

export default OCRProcessor;
