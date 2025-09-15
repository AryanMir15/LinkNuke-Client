// cloudinary.js - Utility for uploading files to Cloudinary

const CLOUD_NAME = "dnnfncv5m"; // User's Cloudinary cloud name
const UPLOAD_PRESET = "LinkNuke"; // User's unsigned upload preset

export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Add resource type for better handling
  if (file.type.startsWith("image/")) {
    formData.append("resource_type", "image");
  } else if (file.type.startsWith("video/")) {
    formData.append("resource_type", "video");
  } else if (file.type.startsWith("audio/")) {
    formData.append("resource_type", "video"); // Cloudinary uses video for audio
  } else {
    // For documents, use 'image' resource type to enable document conversion features
    // This allows Cloudinary to generate image previews of documents
    formData.append("resource_type", "image");
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to upload file to Cloudinary: ${res.status} ${res.statusText}`
      );
    }

    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}
