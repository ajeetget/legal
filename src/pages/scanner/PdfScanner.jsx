
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import UploadDocument from "./UploadDocument";
import DocumentPreview from "./DocumentPreview";
import OCRProcessor from "./OCRProcessor";
import ExtractedText from "./ExtractedText";
import "./PdfScanner.css";

function PdfScanner() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [extractedResults, setExtractedResults] = useState([]);
  const [language, setLanguage] = useState("eng+hin");
  const [uploadKey, setUploadKey] = useState(0);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    setExtractedResults([]);
  };

  const handleOCRComplete = (results) => {
    setExtractedResults(results);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setExtractedResults([]);
    setUploadKey((previous) => previous + 1);
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container">
        <div className="scanner-heading">
          <span className="scanner-label">DOCUMENT SCANNER</span>
          <h1>PDF & Image Scanner</h1>
          <p>
            Upload your legal documents and extract text easily using OCR
            technology.
          </p>
        </div>

        <UploadDocument
          key={uploadKey}
          onFilesSelected={handleFilesSelected}
        />

        <DocumentPreview files={selectedFiles} />

        {selectedFiles.length > 0 && (
          <>
            <div className="scanner-controls">
              <div className="language-selector">
                <label htmlFor="ocr-language">Select OCR Language</label>

                <select
                  id="ocr-language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    setExtractedResults([]);
                  }}
                >
                  <option value="eng">English</option>
                  <option value="hin">Hindi</option>
                  <option value="eng+hin">
                    English + Hindi (Recommended)
                  </option>
                </select>
              </div>

              <button
                type="button"
                className="clear-all-button"
                onClick={handleClearAll}
              >
                <RotateCcw size={16} />
                Clear All
              </button>
            </div>

            <OCRProcessor
              files={selectedFiles}
              language={language}
              onComplete={handleOCRComplete}
            />
          </>
        )}

        {extractedResults.length > 0 && (
          <ExtractedText results={extractedResults} />
        )}
      </div>
    </div>
  );
}

export default PdfScanner;
