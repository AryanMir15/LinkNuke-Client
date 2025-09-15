import { useState, useRef, Fragment, useEffect } from "react";
import { X, Copy, ChevronDown, Check, Info } from "lucide-react";
import { useLinksContext } from "../../context/useLinksContext";
import { uploadToCloudinary } from "../../lib/cloudinary";
import dayjs from "dayjs";
import { Listbox, Transition } from "@headlessui/react";
import Switch from "../../components/ui/Switch";
import InfoModal from "../../components/ui/InfoModal";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import SuccessModal from "../../components/ui/SuccessModal";

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

const MAX_VIDEO_SIZE_MB = 500;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

const VideoModal = ({ closeModal }) => {
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

  const viewsBtnRef = useRef(null);
  const expiryBtnRef = useRef(null);
  const [viewsWidth, setViewsWidth] = useState(undefined);
  const [expiryWidth, setExpiryWidth] = useState(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewsOpen, setViewsOpen] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);

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
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.size <= MAX_VIDEO_SIZE_BYTES && file.type.startsWith("video/")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      (file) =>
        file.size <= MAX_VIDEO_SIZE_BYTES && file.type.startsWith("video/")
    );
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
    if (files.length > 0 && files[0].size > MAX_VIDEO_SIZE_BYTES)
      errs.file = `Video must be under ${MAX_VIDEO_SIZE_MB}MB`;
    if (expiryObj.value === "custom" && !form.expiresAt)
      errs.expiresAt = "Expiry is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    let videoUrl = "";
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadRes = await uploadToCloudinary(files[0]);
        videoUrl = uploadRes.secure_url;
      } catch {
        setErrors({ file: "Failed to upload video. Try again." });
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    let expiresAt = "";
    if (expiryObj.value === "custom") {
      expiresAt = dayjs(form.expiresAt).toISOString();
    } else {
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
    try {
      const newLink = await create({
        title: form.title,
        format: "video",
        maxViews,
        expiresAt,
        videoUrl,
        extraSecure,
      });
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
        setErrors({
          submit: "Link created but URL is missing. Please try again.",
        });
      }
    } catch {
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
    return (
      <SuccessModal
        isOpen={!!successLink}
        onClose={() => setSuccessLink(null)}
        linkUrl={successLink}
        linkType="video"
        onCopy={handleCopy}
      />
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 lg:gap-8 min-h-[400px] sm:min-h-[500px] transition-all duration-300 relative overflow-hidden ${
        window.innerWidth < 768
          ? "bg-[#2A2A2E] border border-gray-700 shadow-lg"
          : "bg-[#2A2A2E]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
            id="extra-secure-video"
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
            title="Extra Secure for Video"
          >
            <div className="text-gray-200">
              When enabled, your video will be playback-only. Download,
              right-click, inspect, and screenshot are blocked for maximum
              privacy.
            </div>
          </InfoModal>
        </div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-white/80">Upload Video</h3>
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
                disabled={loading}
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
                    disabled={loading}
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
                  className="mt-2 border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700/80 focus:border-[#1de4bf] focus:ring-2 focus:ring-[#1de4bf]/20"
                  placeholder="Enter custom max views"
                  disabled={loading}
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
                    disabled={loading}
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
                  className="mt-2 border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700/80 focus:border-[#1de4bf] focus:ring-2 focus:ring-[#1de4bf]/20"
                  disabled={loading}
                  required
                />
              )}
              {errors.expiresAt && (
                <span className="text-xs text-red-500">{errors.expiresAt}</span>
              )}
            </label>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center">
            <div
              className={`flex flex-col items-center justify-center bg-[#232326] text-gray-400 text-center transition-all duration-300 w-full h-full min-h-[280px] border-2 border-dashed rounded-md ${
                loading || uploading
                  ? "cursor-not-allowed opacity-50 border-gray-700"
                  : isDragOver
                  ? "cursor-pointer border-[#00ffff] bg-[#00ffff]/10"
                  : "cursor-pointer border-gray-700"
              }`}
              onClick={() =>
                !loading && !uploading && inputRef.current?.click()
              }
              onDrop={loading || uploading ? undefined : handleDrop}
              onDragOver={loading || uploading ? undefined : handleDragOver}
              onDragEnter={loading || uploading ? undefined : handleDragEnter}
              onDragLeave={loading || uploading ? undefined : handleDragLeave}
            >
              <p className="text-sm">
                {isDragOver
                  ? "Drop your video here!"
                  : "Choose a file or drop it here (optional)"}
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
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
                      <video
                        src={URL.createObjectURL(file)}
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
              className="w-full relative bg-gradient-to-r from-[#00ff9d] via-[#00ffc3] to-[#00fff7] text-black px-3 py-2 rounded text-sm font-semibold shadow-md transition-all duration-500 ease-in-out bg-[length:200%_200%] bg-left hover:from-[#00ff66] hover:via-[#00ffad] hover:to-[#00fff7] hover:brightness-125 hover:saturate-150 hover:shadow-[0_0_12px_#00ff9d] disabled:pointer-events-none"
              disabled={loading || uploading}
            >
              {/* Darker overlay when disabled */}
              {(loading || uploading) && (
                <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {uploading ? "Uploading..." : "Creating..."}
                  </span>
                </div>
              )}
              {/* Button text - hidden when disabled */}
              <span className={loading || uploading ? "invisible" : ""}>
                Create Link
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;
