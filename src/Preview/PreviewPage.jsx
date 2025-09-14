import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { trackLink } from "../lib/linkApi";
import { X } from "lucide-react";
import BouncingLoader from "../components/ui/BouncingLoader";
import {
  generateDocumentPreviewUrl,
  generateMultiPagePreview,
  supportsDocumentPreview,
  getDocumentTypeIcon,
} from "../lib/documentPreview";

const PreviewPage = () => {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState(false);
  const overlayRef = useRef(null);

  // Anti-screenshot/inspect/print measures
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    // Block print
    const style = document.createElement("style");
    style.innerHTML = `@media print { body * { display: none !important; } }`;
    document.head.appendChild(style);
    // Overlay for screenshot deterrence
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "none";
    }
    // Block F12, Ctrl+Shift+I, Ctrl+U, PrintScreen
    const blockKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        toast.error("Action blocked for security.");
      }
    };
    window.addEventListener("keydown", blockKeys);
    // Watermark overlay for extraSecure
    if (link && link.extraSecure) {
      const watermark = document.createElement("div");
      watermark.id = "secure-watermark";
      watermark.style.position = "fixed";
      watermark.style.top = 0;
      watermark.style.left = 0;
      watermark.style.width = "100vw";
      watermark.style.height = "100vh";
      watermark.style.pointerEvents = "none";
      watermark.style.zIndex = 9999;
      watermark.style.opacity = 0.12;
      watermark.style.background =
        "repeating-linear-gradient(135deg, #1de4bf22 0 2px, transparent 2px 40px), repeating-linear-gradient(-45deg, #1de4bf22 0 2px, transparent 2px 40px)";
      watermark.style.userSelect = "none";
      watermark.innerHTML = `<div style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-20deg);font-size:3rem;font-weight:bold;color:#1de4bf;opacity:0.18;pointer-events:none;'>SECURE PREVIEW</div>`;
      document.body.appendChild(watermark);
    }
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", blockKeys);
      document.head.removeChild(style);
      const wm = document.getElementById("secure-watermark");
      if (wm) wm.remove();
    };
  }, [link]);

  useEffect(() => {
    const fetchLink = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍🔍🔍 PREVIEW: Fetching public link:", linkId);
        console.log(
          "🔍🔍🔍 PREVIEW: API URL:",
          import.meta.env.VITE_API_URL + `/public/links/${linkId}`
        );

        const res = await fetch(
          import.meta.env.VITE_API_URL + `/public/links/${linkId}`,
          {
            // Explicitly no credentials for public endpoint
            credentials: "omit",
            headers: {
              "Content-Type": "application/json",
              // NO Authorization header for public endpoint
            },
          }
        );

        console.log("🔍🔍🔍 PREVIEW: Response status:", res.status);
        console.log("🔍🔍🔍 PREVIEW: Response ok:", res.ok);

        if (!res.ok) {
          console.log("🔍🔍🔍 PREVIEW: Response not ok, status:", res.status);
          if (res.status === 404) {
            setError("File not found or expired.");
          } else if (res.status === 410) {
            setError("Link has expired.");
          } else {
            setError(`Failed to load file (${res.status}).`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("🔍🔍🔍 PREVIEW: Fetched link data:", data);

        // Check if link is already expired/nuked before setting it
        if (data.status === "Expired") {
          setError("This link has been nuked by LinkNuke");
          setLoading(false);
          return;
        }

        setLink(data);

        // Track link view - but don't fail the preview if tracking fails
        if (data?._id) {
          try {
            // Check if this is a creator preview by looking at URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const isCreatorPreview = urlParams.get("preview") === "creator";

            console.log(
              "🔍🔍🔍 PREVIEW: Is creator preview:",
              isCreatorPreview
            );
            console.log("🔍🔍🔍 PREVIEW: Link data:", data);
            console.log("🔍🔍🔍 PREVIEW: Using _id for tracking:", data._id);
            console.log("🔍🔍🔍 PREVIEW: Link linkId:", data.linkId);

            await trackLink(data._id, isCreatorPreview);
          } catch (trackError) {
            console.log(
              "🔍🔍🔍 PREVIEW: Track link failed (non-critical):",
              trackError
            );
            // Don't throw - preview should still work even if tracking fails
          }
        } else {
          console.log(
            "🔍🔍🔍 PREVIEW: No _id found in link data, cannot track"
          );
        }
      } catch (error) {
        console.error("🔍🔍🔍 PREVIEW: Network error:", error);
        setError("Network error. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [linkId]);

  // Generate document previews when document link is loaded
  useEffect(() => {
    if (link && link.documentUrl) {
      const filename = link.documentUrl.split("/").pop();
      const fileExtension = filename.split(".").pop()?.toLowerCase();

      // Determine MIME type from file extension
      const mimeTypeMap = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        txt: "text/plain",
        rtf: "text/rtf",
      };

      const mimeType = mimeTypeMap[fileExtension] || "application/pdf";

      if (supportsDocumentPreview(mimeType)) {
        setDocumentLoading(true);
        setDocumentError(false);

        // Generate multi-page preview (up to 3 pages)
        const previews = generateMultiPagePreview(link.documentUrl, 3, {
          width: 800,
          height: 600,
          format: "jpg",
          quality: "auto",
        });

        setDocumentPreviews(previews);
        setCurrentPage(1);
        setDocumentLoading(false);
      } else {
        setDocumentError(true);
        setDocumentLoading(false);
      }
    }
  }, [link]);

  // Show the same loader style during initial loading
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <BouncingLoader />
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Toaster position="top-center" />
        <div className="text-center max-w-md mx-auto px-4">
          {error === "This link has been nuked by LinkNuke" ? (
            // Special styling for nuked links
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-red-400">Link Nuked</h1>
                <p className="text-gray-300 text-lg">
                  This link has been automatically destroyed by LinkNuke
                </p>
                <p className="text-gray-500 text-sm">
                  The link reached its view limit and has been permanently
                  removed
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                  <span className="text-gray-400 text-sm">Powered by </span>
                  <span className="ml-1 text-[#1de4bf] font-semibold">
                    LinkNuke
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Regular error styling
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="text-red-400 text-xl font-semibold">
                {error || "File not found."}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show only the image (or file) if present
  if (link.imageUrl) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <div className="relative bg-gray-900 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] p-0 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
          {/* Anti-screenshot overlay */}
          {link.extraSecure && (
            <div
              className="pointer-events-none select-none absolute inset-0 z-20"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #00ffff22 0 2px, transparent 2px 8px)",
              }}
            />
          )}
          {!link.extraSecure && (
            <a
              href={link.imageUrl}
              download
              className="absolute top-3 left-3 z-30 p-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-70 hover:opacity-90"
              title="Download Image"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          )}

          {/* Loading State - only for images */}
          {imageLoading && link.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <BouncingLoader />
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-red-400 text-sm font-medium">
                  Failed to load image
                </p>
                <button
                  onClick={() => {
                    setImageError(false);
                    setImageLoading(true);
                    // Force reload the image
                    const img = document.querySelector(
                      'img[src="' + link.imageUrl + '"]'
                    );
                    if (img) {
                      img.src = link.imageUrl + "?t=" + Date.now();
                    }
                  }}
                  className="px-4 py-2 bg-[#00ffff] text-black rounded-lg text-sm font-medium hover:bg-[#00ffff]/80 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <img
            src={link.imageUrl}
            alt="Preview"
            className={`max-w-full max-h-[80vh] w-auto h-auto object-contain transition-opacity duration-300 ${
              link.extraSecure ? "select-none pointer-events-none" : ""
            } ${imageLoading ? "opacity-0" : "opacity-100"}`}
            draggable={!link.extraSecure}
            style={{ userSelect: link.extraSecure ? "none" : "auto" }}
            onContextMenu={
              link.extraSecure ? (e) => e.preventDefault() : undefined
            }
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        </div>
      </div>
    );
  }
  // Show text preview if present
  if (link.text) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
          {link.extraSecure && (
            <div
              className="pointer-events-none select-none absolute inset-0 z-20"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #00ffff22 0 2px, transparent 2px 8px)",
              }}
            />
          )}
          {!link.extraSecure && (
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                link.text
              )}`}
              download="text.txt"
              className="absolute top-3 left-3 z-30 p-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-70 hover:opacity-90"
              title="Download Text"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          )}
          <div
            className={`p-8 w-full text-center text-lg text-white font-mono break-words ${
              link.extraSecure ? "select-none pointer-events-none" : ""
            }`}
            style={{
              userSelect: link.extraSecure ? "none" : "auto",
              zIndex: 1,
            }}
            onCopy={link.extraSecure ? (e) => e.preventDefault() : undefined}
          >
            {link.text}
          </div>
        </div>
      </div>
    );
  }
  // Show audio preview if present
  if (link.audioUrl) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
          {link.extraSecure && (
            <div
              className="pointer-events-none select-none absolute inset-0 z-20"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #00ffff22 0 2px, transparent 2px 8px)",
              }}
            />
          )}
          {!link.extraSecure && (
            <a
              href={link.audioUrl}
              download
              className="absolute top-3 left-3 z-30 p-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-70 hover:opacity-90"
              title="Download Audio"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          )}
          <audio
            src={link.audioUrl}
            controls
            className="w-full max-w-md my-8 z-10"
            style={{ userSelect: link.extraSecure ? "none" : "auto" }}
            onContextMenu={
              link.extraSecure ? (e) => e.preventDefault() : undefined
            }
            controlsList={link.extraSecure ? "nodownload" : undefined}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }
  // Show video preview if present
  if (link.videoUrl) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
          {link.extraSecure && (
            <div
              className="pointer-events-none select-none absolute inset-0 z-20"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #00ffff22 0 2px, transparent 2px 8px)",
              }}
            />
          )}
          {!link.extraSecure && (
            <a
              href={link.videoUrl}
              download
              className="absolute top-3 left-3 z-30 p-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-70 hover:opacity-90"
              title="Download Video"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          )}
          <video
            src={link.videoUrl}
            controls
            className="w-full max-w-md my-8 z-10"
            style={{ userSelect: link.extraSecure ? "none" : "auto" }}
            onContextMenu={
              link.extraSecure ? (e) => e.preventDefault() : undefined
            }
            controlsList={link.extraSecure ? "nodownload" : undefined}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }
  // Show document preview if present
  if (link.documentUrl) {
    const filename = link.documentUrl.split("/").pop();
    const fileExtension = filename.split(".").pop()?.toLowerCase();
    const mimeTypeMap = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
      rtf: "text/rtf",
    };
    const mimeType = mimeTypeMap[fileExtension] || "application/pdf";
    const documentType = getDocumentTypeIcon(mimeType);

    return (
      <div
        className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
        }}
      >
        <Toaster position="top-center" />
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
          {/* Anti-screenshot overlay */}
          {link.extraSecure && (
            <div
              className="pointer-events-none select-none absolute inset-0 z-20"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #00ffff22 0 2px, transparent 2px 8px)",
              }}
            />
          )}

          {/* Download button */}
          {!link.extraSecure && (
            <a
              href={link.documentUrl}
              download={filename}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 z-30 p-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-200 opacity-70 hover:opacity-90"
              title="Download Document"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          )}

          {/* Document type indicator */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <span className="text-2xl">{documentType.icon}</span>
            <span className="text-xs text-gray-300 bg-gray-800/60 px-2 py-1 rounded">
              {documentType.name}
            </span>
          </div>

          {/* Loading State */}
          {documentLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <BouncingLoader />
            </div>
          )}

          {/* Error State */}
          {documentError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-red-400 text-sm font-medium">
                  Preview not available for this document type
                </p>
                <a
                  href={link.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#00ffff] text-black rounded-lg text-sm font-medium hover:bg-[#00ffff]/80 transition-colors"
                >
                  Download to View
                </a>
              </div>
            </div>
          )}

          {/* Document Preview */}
          {!documentLoading &&
            !documentError &&
            documentPreviews.length > 0 && (
              <>
                <img
                  src={documentPreviews[currentPage - 1]?.url}
                  alt={`Document Preview - Page ${currentPage}`}
                  className={`max-w-full max-h-[80vh] w-auto h-auto object-contain transition-opacity duration-300 ${
                    link.extraSecure ? "select-none pointer-events-none" : ""
                  }`}
                  draggable={!link.extraSecure}
                  style={{ userSelect: link.extraSecure ? "none" : "auto" }}
                  onContextMenu={
                    link.extraSecure ? (e) => e.preventDefault() : undefined
                  }
                  onError={() => {
                    setDocumentError(true);
                  }}
                />

                {/* Page Navigation */}
                {documentPreviews.length > 1 && !link.extraSecure && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-1 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-300 px-2">
                        {currentPage} / {documentPreviews.length}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(documentPreviews.length, currentPage + 1)
                          )
                        }
                        disabled={currentPage === documentPreviews.length}
                        className="p-1 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    );
  }

  // If no supported file type is present, show a branded placeholder for video preview
  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 py-6 sm:px-4 sm:py-12"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,255,157,0.8) 100%)",
      }}
    >
      <Toaster position="top-center" />
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center justify-center border border-gray-700 overflow-hidden aspect-video">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 mb-2 text-[#00ffff] opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 48 48"
          >
            <circle cx="24" cy="24" r="22" strokeDasharray="4 4" />
            <polygon points="20,16 36,24 20,32" fill="#00ffff" opacity="0.7" />
          </svg>
          <span className="text-gray-400 text-base font-semibold text-center">
            Your video preview will appear here.
            <br />
            No data stored. No tracking.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
