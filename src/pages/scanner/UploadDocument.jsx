
import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FileImage,
  X,
  Trash2,
} from "lucide-react";

import "./UploadDocument.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function UploadDocument({ onFilesSelected }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Validate uploaded files
  const validateFiles = (selectedFiles) => {
    setError("");

    if (!selectedFiles.length) return;

    const hasInvalidType = selectedFiles.some(
      (file) => !ALLOWED_TYPES.includes(file.type)
    );

    if (hasInvalidType) {
      setError("Only PDF, JPG, JPEG, PNG and WEBP files are allowed.");
      return;
    }

    const hasLargeFile = selectedFiles.some(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (hasLargeFile) {
      setError("Each file must be smaller than 10 MB.");
      return;
    }

    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    const imageFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/")
    );

    // Allow one PDF OR multiple images
    if (pdfFiles.length > 0 && imageFiles.length > 0) {
      setError("Please upload a PDF or images separately.");
      return;
    }

    if (pdfFiles.length > 1) {
      setError("Please upload only one PDF at a time.");
      return;
    }

    updateFiles(selectedFiles);
  };

  // Update selected files
  const updateFiles = (selectedFiles) => {
    const newFiles = [...selectedFiles];

    setFiles(newFiles);

    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    validateFiles(selectedFiles);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    validateFiles(droppedFiles);
  };

  // Remove individual file
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    updateFiles(updatedFiles);
    setError("");
  };

  // Remove all files
  const clearFiles = () => {
    updateFiles([]);
    setError("");
  };

  return (
    <div className="upload-document">

      {/* Upload Area */}
      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="upload-icon">
          <UploadCloud size={34} />
        </div>

        <h3>Upload Your Document</h3>

        <p>
          Drag and drop your PDF or image files here
        </p>

        <span className="upload-or">OR</span>

        <button
          type="button"
          className="browse-button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse Files
        </button>

        <span className="upload-formats">
          Supported: PDF, JPG, JPEG, PNG, WEBP
        </span>

        <span className="upload-formats">
          Maximum size: 10 MB per file
        </span>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="selected-files">

          <div className="selected-files-header">
            <h3>
              Selected Documents ({files.length})
            </h3>

            <button
              type="button"
              className="clear-files-button"
              onClick={clearFiles}
            >
              <Trash2 size={15} />
              Remove All
            </button>
          </div>

          <div className="selected-files-list">
            {files.map((file, index) => {
              const isPdf = file.type === "application/pdf";

              return (
                <div className="selected-file" key={`${file.name}-${index}`}>

                  <div className={`file-icon ${isPdf ? "pdf" : "image"}`}>
                    {isPdf ? (
                      <FileText size={23} />
                    ) : (
                      <FileImage size={23} />
                    )}
                  </div>

                  <div className="file-info">
                    <h4>{file.name}</h4>
                    <span>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-file-button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => removeFile(index)}
                  >
                    <X size={19} />
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

export default UploadDocument;
