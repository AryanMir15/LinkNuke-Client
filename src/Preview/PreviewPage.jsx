import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { trackLink } from "../lib/linkApi";

const PreviewPage = () => {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
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
        const res = await fetch(
          import.meta.env.VITE_API_URL + `/public/links/${linkId}`
        );
        if (!res.ok) {
          if (res.status === 404) {
            setError("File not found or expired.");
          } else if (res.status === 410) {
            setError("Link has expired.");
          } else {
            setError("Failed to load file.");
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("Fetched link data:", data);
        setLink(data);
        if (data?.linkId) {
          await trackLink(data.linkId);
        }
      } catch (error) {
        console.error("Error fetching link:", error);
        setError("Network error. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [linkId]);

  // Only show the file (e.g., image) in a secure, centered, mobile-friendly way
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Toaster position="top-center" />
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Toaster position="top-center" />
        <div className="text-red-400 text-xl font-semibold mb-4">
          {error || "File not found."}
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
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
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

          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#00ffff]/20 border-t-[#00ffff] rounded-full animate-spin"></div>
                <p className="text-[#00ffff] text-sm font-medium">
                  Loading image...
                </p>
              </div>
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
    const isPDF = filename.toLowerCase().endsWith(".pdf");

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
          {link.extraSecure ? (
            <img
              src={link.documentUrl}
              alt="Secure Document Preview"
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain select-none pointer-events-none"
              draggable={false}
              style={{ userSelect: "none" }}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 z-10">
              {isPDF ? (
                <div className="flex flex-col items-center gap-4">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-red-500"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14,2 14,8 20,8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="10,9 9,9 8,9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white font-semibold text-lg text-center">
                    {filename}
                  </span>
                  <p className="text-gray-400 text-sm text-center max-w-xs">
                    Click the download button above to view this PDF document
                  </p>
                  <a
                    href={link.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-6 py-3 bg-[#00ffff] text-black rounded-lg font-semibold hover:bg-[#00ffff]/80 transition-colors"
                  >
                    Open PDF
                  </a>
                </div>
              ) : (
                <>
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="mb-4 text-[#00ffff]"
                  >
                    <rect width="24" height="24" rx="4" fill="#002b2b" />
                    <path
                      d="M7 7h10v10H7V7z"
                      stroke="#00ffff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 9h6v6H9V9z"
                      stroke="#00ffff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white font-semibold text-lg select-none pointer-events-none break-all">
                    {filename}
                  </span>
                </>
              )}
            </div>
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
