import { useState, useRef, Fragment, useEffect } from "react";
import { X, Copy, ChevronDown, Check, Info } from "lucide-react";
import { useLinksContext } from "../../context/useLinksContext";
import { uploadToCloudinary } from "../../lib/cloudinary";
import dayjs from "dayjs";
import * as Popover from "@radix-ui/react-popover";
import Switch from "../../components/ui/Switch";
import InfoModal from "../../components/ui/InfoModal";
import { AnimatePresence } from "framer-motion";

const initialState = {
  title: "",
  maxViews: 1,
  expiresPreset: "1h",
  expiresAt: "",
};

const maxViewsOptions = [
  { label: "1 click", value: 1 },
  { label: "3 clicks", value: 3 },
  { label: "5 clicks", value: 5 },
  { label: "10 clicks", value: 10 },
  { label: "Custom", value: "custom" },
];

const expiryOptions = [
  { label: "1 hour", value: "1h" },
  { label: "1 day", value: "1d" },
  { label: "1 week", value: "1w" },
  { label: "Custom", value: "custom" },
];

const MAX_IMAGE_SIZE_MB = 100;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const shareOptions = [
  {
    name: "WhatsApp",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.987c-.003 5.451-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.336.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.681a11.86 11.86 0 0 0 5.741 1.466h.005c6.554 0 11.89-5.336 11.893-11.892a11.82 11.82 0 0 0-3.478-8.463" />
      </svg>
    ),
    getShareUrl: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" />
      </svg>
    ),
    getShareUrl: (url) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 13.065L.002 6.5V19.5A2.5 2.5 0 0 0 2.5 22h19a2.5 2.5 0 0 0 2.5-2.5V6.5l-12 6.565zm11.998-8.565A2.5 2.5 0 0 0 21.5 2h-19A2.5 2.5 0 0 0 .002 4.5l12 7.065 11.996-7.065z" />
      </svg>
    ),
    getShareUrl: (url) =>
      `mailto:?subject=Check%20out%20this%20link&body=${encodeURIComponent(
        url
      )}`,
  },
];

const ImageModal = ({ closeModal }) => {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState(initialState);
  const [maxViewsObj, setMaxViewsObj] = useState(maxViewsOptions[0]);
  const [expiryObj, setExpiryObj] = useState(expiryOptions[0]);
  const [errors, setErrors] = useState({});
  const [successLink, setSuccessLink] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extraSecure, setExtraSecure] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const inputRef = useRef(null);
  const { create, loading } = useLinksContext();
  const [viewsOpen, setViewsOpen] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const viewsBtnRef = useRef(null);
  const expiryBtnRef = useRef(null);
  const [viewsWidth, setViewsWidth] = useState(undefined);
  const [expiryWidth, setExpiryWidth] = useState(undefined);

  useEffect(() => {
    if (viewsBtnRef.current) {
      setViewsWidth(viewsBtnRef.current.offsetWidth);
    }
  }, [viewsOpen]);
  useEffect(() => {
    if (expiryBtnRef.current) {
      setExpiryWidth(expiryBtnRef.current.offsetWidth);
    }
  }, [expiryOpen]);

  // Lock scroll when success modal is open
  useEffect(() => {
    if (successLink) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [successLink]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    const maxViewsVal =
      maxViewsObj.value === "custom"
        ? Number(form.maxViewsCustom)
        : Number(maxViewsObj.value);
    if (!maxViewsVal || maxViewsVal < 1)
      errs.maxViews = "Views must be positive";
    if (files.length > 0 && files[0].size > MAX_IMAGE_SIZE_BYTES)
      errs.file = `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
    if (expiryObj.value === "custom" && !form.expiresAt)
      errs.expiresAt = "Expiry is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    let imageUrl = "";
    if (files.length > 0) {
      setUploading(true);
      try {
        console.log("Uploading image to Cloudinary...");
        const uploadRes = await uploadToCloudinary(files[0]);
        imageUrl = uploadRes.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        setErrors({ file: "Failed to upload image. Try again." });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    let expiresAt = "";
    if (expiryObj.value === "custom") {
      expiresAt = dayjs(form.expiresAt).toISOString();
    } else {
      // Calculate expiry from now
      const now = dayjs();
      if (expiryObj.value === "1h")
        expiresAt = now.add(1, "hour").toISOString();
      if (expiryObj.value === "1d") expiresAt = now.add(1, "day").toISOString();
      if (expiryObj.value === "1w")
        expiresAt = now.add(1, "week").toISOString();
    }

    const maxViews =
      maxViewsObj.value === "custom"
        ? Number(form.maxViewsCustom)
        : Number(maxViewsObj.value);

    const linkData = {
      title: form.title,
      imageUrl: imageUrl,
      format: "image",
      maxViews,
      expiresAt,
      extraSecure,
    };

    console.log("Creating link with data:", linkData);

    try {
      const newLink = await create(linkData);
      console.log("Link created successfully:", newLink);
      setForm(initialState);
      setFiles([]);

      // Handle different possible response structures
      let linkUrl = null;
      if (newLink && newLink.link) {
        // If the response has a nested link object
        linkUrl = newLink.link.url || newLink.link.linkId;
      } else if (newLink) {
        // If the response is the link object directly
        linkUrl = newLink.url || newLink.linkId;
      }

      if (linkUrl) {
        setSuccessLink(linkUrl);
      } else {
        console.error("No valid URL found in response:", newLink);
        setErrors({
          submit: "Link created but URL is missing. Please try again.",
        });
      }
    } catch (error) {
      console.error("Link creation failed:", error);
      setErrors({ submit: "Failed to create link. Try again." });
    }
  };

  const handleCopy = () => {
    if (successLink) {
      navigator.clipboard.writeText(successLink);
    }
  };

  // Success Modal
  if (successLink) {
    // Build the preview URL for the frontend
    let linkId = null;
    let previewUrl = null;

    try {
      // Try to extract linkId from the URL
      if (successLink.includes("/")) {
        linkId = successLink.split("/").pop();
      } else {
        // If it's just an ID, use it directly
        linkId = successLink;
      }
      previewUrl = `/preview/${linkId}`;
    } catch (error) {
      console.error("Error extracting linkId:", error);
      // Fallback: use the full successLink as the preview URL
      previewUrl = successLink;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1F23]/40 p-4">
        <div
          className={`w-full max-w-md mx-auto rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transition-all duration-300 relative overflow-hidden ${
            window.innerWidth < 768
              ? "bg-[#2A2A2E] border border-gray-700 shadow-lg"
              : "bg-[#2A2A2E]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          }`}
        >
          {/* Cyan gradient circles - only on desktop */}
          {window.innerWidth >= 768 && (
            <>
              <div className="absolute -top-12 -left-12 w-[120px] h-[120px] bg-gradient-to-tr from-[#00ffff]/20 to-transparent rounded-full blur-[400px] z-0" />
              <div className="absolute bottom-0 -right-10 w-[140px] h-[140px] bg-gradient-to-br from-[#00ffff]/15 to-transparent rounded-full blur-[400px] z-0" />
            </>
          )}
          <div className="relative z-10">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => {
                setSuccessLink(null);
                // Do not close the modal after link creation
              }}
              aria-label="Close"
            >
              <X />
            </button>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
                Link Created!
              </h2>
              <p className="mb-6 text-gray-300/80 text-sm sm:text-base">
                Your image link is ready to share:
              </p>
              <div className="flex items-center justify-center gap-2 bg-[#232326] border border-gray-700 rounded-lg px-4 py-3 mb-6">
                <span
                  className="truncate text-[#00ffff] font-mono text-sm"
                  style={{ maxWidth: 200 }}
                >
                  {successLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-[#00ffff] p-1 transition-colors duration-200"
                  title="Copy link"
                  aria-label="Copy link"
                >
                  <Copy size={18} />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
                <a
                  href={`${previewUrl}?preview=creator`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#00ff9d] via-[#00ffc3] to-[#00fff7] text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-500 ease-in-out bg-[length:200%_200%] bg-left hover:from-[#00ff66] hover:via-[#00ffad] hover:to-[#00fff7] hover:brightness-125 hover:saturate-150 hover:shadow-[0_0_12px_#00ff9d]"
                >
                  Preview Link
                </a>
                <div className="flex justify-center gap-2">
                  {shareOptions.map((opt) => (
                    <a
                      key={opt.name}
                      href={opt.getShareUrl(successLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#232326] border border-gray-700 hover:border-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg p-2 transition-all duration-200 text-gray-400 hover:text-[#00ffff]"
                      title={`Share via ${opt.name}`}
                      aria-label={`Share via ${opt.name}`}
                    >
                      {opt.icon}
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400/80">
                Share instantly to your favorite platform
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 lg:gap-8 min-h-[400px] sm:min-h-[500px] transition-all duration-300 relative overflow-hidden ${
        window.innerWidth < 768
          ? "bg-[#2A2A2E] border border-gray-700 shadow-lg"
          : "bg-[#2A2A2E]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      }`}
    >
      {/* Cyan gradient circles - only on desktop */}
      {window.innerWidth >= 768 && (
        <>
          <div className="absolute -top-12 -left-12 w-[120px] h-[120px] bg-gradient-to-tr from-[#00ffff]/20 to-transparent rounded-full blur-[400px] z-0" />
          <div className="absolute bottom-0 -right-10 w-[140px] h-[140px] bg-gradient-to-br from-[#00ffff]/15 to-transparent rounded-full blur-[400px] z-0" />
          <div className="absolute top-1/2 right-0 w-[80px] h-[80px] bg-gradient-to-tl from-[#00ffff]/10 to-transparent rounded-full blur-[400px] z-0" />
        </>
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Switch
            checked={extraSecure}
            onChange={() => setExtraSecure((v) => !v)}
            label={<span className="text-white">Extra Secure</span>}
            id="extra-secure-image"
            className="bg-[#232326] border border-gray-700 text-white"
          />
          <button
            type="button"
            className="rounded-full border-none border-gray-200 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#1de4bf] hover:border-[#1de4bf] transition"
            onClick={() => setShowInfo(true)}
            tabIndex={0}
            aria-label="Info about Extra Secure"
          >
            <Info size={16} />
          </button>
          <InfoModal
            open={showInfo}
            onClose={() => setShowInfo(false)}
            title="Extra Secure for Images"
          >
            <div className="text-gray-200">
              When enabled, your image will be view-only. Download, right-click,
              inspect, and screenshot are blocked for maximum privacy.
            </div>
          </InfoModal>
        </div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-white/80">Upload Image</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row w-full gap-6 transition-all duration-300"
        >
          <div className="flex-1 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-left">
              <span className="font-medium text-gray-300/80">
                Title <span className="text-red-500">*</span>
              </span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border border-gray-700 rounded px-3 py-2 bg-[#232326] text-gray-200 placeholder:text-gray-500 focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff]/20"
                disabled={loading || uploading}
                required
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
            </label>
            <label className="flex flex-col gap-1 text-left">
              <span className="font-medium text-gray-300/80">
                Max Views <span className="text-red-500">*</span>
              </span>
              <Popover.Root open={viewsOpen} onOpenChange={setViewsOpen}>
                <Popover.Trigger asChild>
                  <button
                    ref={viewsBtnRef}
                    type="button"
                    className="relative w-full cursor-pointer rounded border border-gray-700 bg-[#232326] py-2 pl-3 pr-10 text-left text-gray-200 focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff]/20"
                    disabled={loading || uploading}
                  >
                    <span className="block truncate">{maxViewsObj.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Content
                  align="start"
                  sideOffset={4}
                  style={viewsWidth ? { width: viewsWidth } : {}}
                  className="z-50 rounded bg-[#232326] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-700 max-h-60 overflow-auto"
                >
                  {maxViewsOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        option.value === maxViewsObj.value
                          ? "bg-[#222] text-[#00ffff] font-semibold"
                          : "text-gray-200"
                      }`}
                      onClick={() => {
                        setMaxViewsObj(option);
                        setViewsOpen(false);
                      }}
                    >
                      <span className="block truncate">{option.label}</span>
                      {option.value === maxViewsObj.value && (
                        <span className="absolute left-2 inset-y-0 flex items-center text-[#00ffff]">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  ))}
                </Popover.Content>
              </Popover.Root>
              {maxViewsObj.value === "custom" && (
                <input
                  name="maxViewsCustom"
                  type="number"
                  min={1}
                  value={form.maxViewsCustom || ""}
                  onChange={handleChange}
                  className="mt-2 border border-gray-700 rounded px-3 py-2 bg-[#232326] text-gray-200 placeholder:text-gray-500 focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff]/20"
                  placeholder="Enter custom max views"
                  disabled={loading || uploading}
                  required
                />
              )}
              {errors.maxViews && (
                <span className="text-xs text-red-500">{errors.maxViews}</span>
              )}
            </label>
            <label className="flex flex-col gap-1 text-left">
              <span className="font-medium text-gray-300/80">
                Expires In <span className="text-red-500">*</span>
              </span>
              <Popover.Root open={expiryOpen} onOpenChange={setExpiryOpen}>
                <Popover.Trigger asChild>
                  <button
                    ref={expiryBtnRef}
                    type="button"
                    className="relative w-full cursor-pointer rounded border border-gray-700 bg-[#232326] py-2 pl-3 pr-10 text-left text-gray-200 focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff]/20"
                    disabled={loading || uploading}
                  >
                    <span className="block truncate">{expiryObj.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Content
                  align="start"
                  sideOffset={4}
                  style={expiryWidth ? { width: expiryWidth } : {}}
                  className="z-50 rounded bg-[#232326] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-700 max-h-60 overflow-auto"
                >
                  {expiryOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        option.value === expiryObj.value
                          ? "bg-[#222] text-[#00ffff] font-semibold"
                          : "text-gray-200"
                      }`}
                      onClick={() => {
                        setExpiryObj(option);
                        setExpiryOpen(false);
                      }}
                    >
                      <span className="block truncate">{option.label}</span>
                      {option.value === expiryObj.value && (
                        <span className="absolute left-2 inset-y-0 flex items-center text-[#00ffff]">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  ))}
                </Popover.Content>
              </Popover.Root>
              {expiryObj.value === "custom" && (
                <input
                  name="expiresAt"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="mt-2 border border-gray-700 rounded px-3 py-2 bg-[#232326] text-gray-200 placeholder:text-gray-500 focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff]/20"
                  disabled={loading || uploading}
                  required
                />
              )}
              {errors.expiresAt && (
                <span className="text-xs text-red-500">{errors.expiresAt}</span>
              )}
            </label>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div
              className={`flex flex-col items-center justify-center bg-[#232326] text-gray-400 text-center cursor-pointer transition-all duration-300 w-full h-full min-h-[280px] border-2 border-dashed border-gray-700 rounded-md`}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-sm">
                Choose a file or drop it here (optional)
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={loading || uploading}
              />
            </div>
            {files.length > 0 && (
              <div className="rounded-lg p-4">
                <div className="flex flex-row flex-wrap gap-3 w-full justify-center">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-600 bg-gray-800 shadow-md"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors text-xs font-bold"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              type="submit"
              className={`w-full 
              bg-gradient-to-r from-[#00ff9d] via-[#00ffc3] to-[#00fff7] 
              text-black px-3 py-2 rounded text-sm font-semibold shadow-md
              transition-all duration-500 ease-in-out bg-[length:200%_200%] bg-left
              hover:from-[#00ff66] hover:via-[#00ffad] hover:to-[#00fff7]
              hover:brightness-125 hover:saturate-150
              hover:shadow-[0_0_12px_#00ff9d]
              disabled:opacity-60`}
              disabled={loading || uploading}
            >
              {loading || uploading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageModal;
