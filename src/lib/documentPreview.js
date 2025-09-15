// documentPreview.js - Utility for generating document preview URLs using Cloudinary

/**
 * Generates a Cloudinary URL for document preview as an image
 * @param {string} documentUrl - The original Cloudinary document URL
 * @param {Object} options - Preview options
 * @param {number} options.page - Page number to preview (default: 1)
 * @param {number} options.width - Preview width (default: 800)
 * @param {number} options.height - Preview height (default: 600)
 * @param {string} options.format - Output format (default: 'jpg')
 * @param {number} options.quality - Image quality (default: 'auto')
 * @returns {string} - Cloudinary URL for document preview
 */
export function generateDocumentPreviewUrl(documentUrl, options = {}) {
  const {
    page = 1,
    width = 800,
    height = 600,
    format = "jpg",
    quality = "auto",
  } = options;

  // Extract the public ID from the Cloudinary URL
  const publicId = extractPublicIdFromUrl(documentUrl);

  if (!publicId) {
    return documentUrl; // Fallback to original URL
  }

  // Build Cloudinary transformation URL
  // Using Cloudinary's document conversion features
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_fit`, // Fit the content within the dimensions
    `f_${format}`, // Output format
    `q_${quality}`, // Quality
    `pg_${page}`, // Page number for multi-page documents
    `fl_progressive`, // Progressive JPEG for better loading
    `fl_immutable_cache`, // Cache the transformation
  ].join(",");

  // Construct the preview URL using proper Cloudinary format
  // Format: https://res.cloudinary.com/cloud_name/image/upload/transformations/public_id.format
  const urlParts = documentUrl.split("/");
  const cloudNameIndex =
    urlParts.findIndex((part) => part === "res.cloudinary.com") + 1;
  const cloudName = urlParts[cloudNameIndex];
  const resourceType = urlParts[cloudNameIndex + 1]; // Should be "image" for documents

  const previewUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/${publicId}.${format}`;

  return previewUrl;
}

/**
 * Generates multiple page previews for multi-page documents
 * @param {string} documentUrl - The original Cloudinary document URL
 * @param {number} maxPages - Maximum number of pages to preview (default: 3)
 * @param {Object} options - Preview options
 * @returns {Array} - Array of preview URLs for each page
 */
export function generateMultiPagePreview(
  documentUrl,
  maxPages = 3,
  options = {}
) {
  const previews = [];

  for (let page = 1; page <= maxPages; page++) {
    const previewUrl = generateDocumentPreviewUrl(documentUrl, {
      ...options,
      page,
    });
    previews.push({
      page,
      url: previewUrl,
    });
  }

  return previews;
}

/**
 * Extracts the public ID from a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null if not found
 */
function extractPublicIdFromUrl(url) {
  try {
    // Handle different Cloudinary URL formats
    const patterns = [
      // Standard format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/,
      // Raw format: https://res.cloudinary.com/cloud_name/raw/upload/v1234567890/folder/filename.ext
      /\/raw\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Determines if a document type supports preview
 * @param {string} mimeType - Document MIME type
 * @returns {boolean} - Whether preview is supported
 */
export function supportsDocumentPreview(mimeType) {
  const supportedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/rtf",
  ];

  return supportedTypes.includes(mimeType);
}

/**
 * Gets the document type icon based on MIME type
 * @param {string} mimeType - Document MIME type
 * @returns {Object} - Icon information
 */
export function getDocumentTypeIcon(mimeType) {
  const iconMap = {
    "application/pdf": {
      icon: "📄",
      color: "#dc2626",
      name: "PDF",
    },
    "application/msword": {
      icon: "📝",
      color: "#2563eb",
      name: "Word",
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      icon: "📝",
      color: "#2563eb",
      name: "Word",
    },
    "application/vnd.ms-excel": {
      icon: "📊",
      color: "#16a34a",
      name: "Excel",
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      icon: "📊",
      color: "#16a34a",
      name: "Excel",
    },
    "application/vnd.ms-powerpoint": {
      icon: "📈",
      color: "#ea580c",
      name: "PowerPoint",
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
        icon: "📈",
        color: "#ea580c",
        name: "PowerPoint",
      },
    "text/plain": {
      icon: "📄",
      color: "#6b7280",
      name: "Text",
    },
    "text/rtf": {
      icon: "📄",
      color: "#6b7280",
      name: "RTF",
    },
  };

  return (
    iconMap[mimeType] || {
      icon: "📄",
      color: "#6b7280",
      name: "Document",
    }
  );
}

/**
 * Generates a fallback preview URL for documents that don't support image preview
 * @param {string} documentUrl - The original document URL
 * @returns {string} - Fallback preview URL
 */
export function generateFallbackPreviewUrl(documentUrl) {
  // For documents that don't support preview, we can use Cloudinary's
  // document viewer or return the original URL
  return documentUrl;
}
