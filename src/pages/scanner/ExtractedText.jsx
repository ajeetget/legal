
import { useState} from "react";
import {
  Copy,
  Download,
  Check,
  FileDown,
  Search,
  X,
} from "lucide-react";
import "./ExtractedText.css";

function ExtractedText({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

const filteredResults = results.filter((result) => {
  const search = searchTerm.trim().toLocaleLowerCase();

  if (!search) return true;

  const fileName = String(result.fileName || "").toLocaleLowerCase();
  const text = String(result.text || "").toLocaleLowerCase();

  return (
    fileName.includes(search) ||
    text.includes(search)
  );
});

  const getCombinedText = () => {
    return results
      .map((result) => {
        const page = result.pageNumber
          ? ` - Page ${result.pageNumber}`
          : "";

        return `${result.fileName}${page}\n\n${result.text || "No text detected."}`;
      })
      .join("\n\n----------------------------------------\n\n");
  };

  const copyText = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy text.");
    }
  };

  const downloadText = (text, fileName) => {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    downloadText(getCombinedText(), "scanned-documents.txt");
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="extracted-results">
      <div className="extracted-header">
        <div>
          <h2>Extracted Text</h2>
          <p>{results.length} page(s) or image(s) scanned</p>
        </div>

        <div className="extracted-header-actions">
          <button
            type="button"
            className="download-all-button"
            onClick={downloadAll}
          >
            <Download size={17} />
            Download TXT
          </button>

          <button
            type="button"
            className="download-pdf-button"
            onClick={downloadPDF}
          >
            <FileDown size={17} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="extracted-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search in extracted text..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            title="Clear search"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <p className="search-results-count">
        {filteredResults.length} of {results.length} result(s)
      </p>

      <div className="pdf-export-content">
        <h2 className="pdf-document-title">
          LegalCare - Scanned Documents
        </h2>

        {filteredResults.length > 0 ? (
          filteredResults.map((result) => {
            const originalIndex = results.indexOf(result);

            const heading = result.pageNumber
              ? `${result.fileName} - Page ${result.pageNumber}`
              : result.fileName;

            return (
              <div className="extracted-card" key={originalIndex}>
                <div className="extracted-card-header">
                  <h3>{heading}</h3>

                  <div className="extracted-actions">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(result.text || "", originalIndex)
                      }
                      title="Copy text"
                    >
                      {copiedIndex === originalIndex ? (
                        <Check size={17} />
                      ) : (
                        <Copy size={17} />
                      )}

                      {copiedIndex === originalIndex ? "Copied" : "Copy"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadText(
                          result.text || "",
                          `${result.fileName}${result.pageNumber ? `-page-${result.pageNumber}` : ""}.txt`
                        )
                      }
                      title="Download text"
                    >
                      <Download size={17} />
                      Download
                    </button>
                  </div>
                </div>

                <pre>{result.text || "No text detected."}</pre>
              </div>
            );
          })
        ) : (
          <div className="no-search-results">
            <Search size={30} />
            <h3>No matching documents found</h3>
            <p>Try searching with another word or phrase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtractedText;
