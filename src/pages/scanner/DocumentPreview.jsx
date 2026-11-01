
import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "./DocumentPreview.css";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function DocumentPreview({ files }) {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    const loadPreviews = async () => {
      setLoading(true);
      setError("");
      setPreviews([]);

      try {
        const result = [];

        for (const file of files) {
          if (file.type === "application/pdf") {
            const buffer = await file.arrayBuffer();

            const pdf = await getDocument({
              data: new Uint8Array(buffer),
            }).promise;

            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
              if (cancelled) return;

              const page = await pdf.getPage(pageNumber);
              const viewport = page.getViewport({ scale: 1.2 });

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");

              canvas.width = viewport.width;
              canvas.height = viewport.height;

              await page.render({
                canvasContext: context,
                viewport,
              }).promise;

              const imageUrl = canvas.toDataURL("image/png");

              result.push({
                name: file.name,
                pageNumber,
                type: "pdf",
                url: imageUrl,
              });
            }
          } else {
            const url = URL.createObjectURL(file);
            createdUrls.push(url);

            result.push({
              name: file.name,
              type: "image",
              url,
            });
          }
        }

        if (!cancelled) {
          setPreviews(result);
        }
      } catch (err) {
        console.error("Preview error:", err);
        if (!cancelled) {
          setError("Unable to preview this document. Please try another file.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (files.length > 0) {
      loadPreviews();
    }

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (!files.length) return null;

  return (
    <div className="document-preview">
      <h2>Document Preview</h2>

      {loading && <p>Loading document preview...</p>}

      {error && <p className="preview-error">{error}</p>}

      {!loading && !error && (
        <div className="preview-grid">
          {previews.map((preview, index) => (
            <div className="preview-card" key={index}>
              <img src={preview.url} alt={preview.name} />

              <div className="preview-info">
                <span>{preview.name}</span>
                <small>
                  {preview.type === "pdf"
                    ? `Page ${preview.pageNumber}`
                    : "Image"}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentPreview;
