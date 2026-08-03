"use client";
import { useState, useEffect, Suspense } from "react";
import { addToast } from "@heroui/react";
import axios from "axios";
import NavBar from "@/app/components/NavBar";
import { useSearchParams, useRouter } from "next/navigation";
import CustomAlert from "@/app/components/CustomAlert";

export const TYPOLOGY_VALUES = [
  "Culture",
  "Education",
  "Work",
  "Hospitality",
  "Residential",
  "Infrastructure",
  "Space",
  "Sports",
  "Health",
  "Religion",
  "Exhibition",
] as const;

const categories = [
  { label: "Architecture", category: "ARCHITECTURAL" },
  { label: "Interior", category: "INTERIOR" },
  { label: "Landscape", category: "LANDSCAPE" },
  { label: "Structural", category: "STRUCTURAL" },
];

const MAX_TOTAL_MEDIA_ITEMS = 20;

function getCloudinaryConfig() {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "drpc1o6de";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "gomor_assets";
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "gomor";

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary upload is not configured correctly. Please verify the public environment variables."
    );
  }

  return { cloudName, uploadPreset, folder };
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UploadForm />
    </Suspense>
  );
}

function UploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    location: "",
    year: new Date().getFullYear().toString(),
    size: "",
    typology: "",
    category: "",
    status: "COMPLETED",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [successAlert, setSuccessAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  useEffect(() => {
    if (editId) {
      const fetchProject = async () => {
        try {
          // Since we need to get project details, we can fetch all projects and find it,
          // or if we have a direct GET endpoint.
          // Let's call /api/projects/list and filter, or we can assume there's a list route.
          // Wait, is there a project details route? We can use /api/projects/list.
          const response = await axios.get("/api/projects/list");
          const project = response.data.find((p: any) => p.id === parseInt(editId));
          if (project) {
            setFormData({
              title: project.title || "",
              description: project.description || "",
              client: project.client || "",
              location: project.location || "",
              year: project.year || "",
              size: project.size || "",
              typology: project.typology || "",
              category: project.category || "",
              status: project.status || "COMPLETED",
            });
            setExistingImages(project.imagePaths || []);
            setExistingVideos(project.videoPaths || []);
          }
        } catch (error) {
          console.error("Error fetching project for edit:", error);
        }
      };
      fetchProject();
    }
  }, [editId]);

  const uploadToCloudinary = async (
    file: File,
    resourceType: "image" | "video"
  ): Promise<string> => {
    const { cloudName, uploadPreset, folder } = getCloudinaryConfig();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("folder", folder);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        data
      );

      return response.data.secure_url;
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Cloudinary upload failed.";
      throw new Error(`Cloudinary upload failed: ${message}`);
    }
  };

  const uploadFilesSequentially = async () => {
    const uploadedImages: string[] = [];
    const uploadedVideos: string[] = [];
    const totalFiles = Math.max(files.length + videos.length, 1);
    let completed = 0;

    for (const file of files) {
      setUploadMessage(
        `Uploading image ${uploadedImages.length + 1} of ${files.length}...`
      );
      const url = await uploadWithRetry(file, "image", 2);
      uploadedImages.push(url);
      completed += 1;
      setUploadProgress(Math.round((completed / totalFiles) * 100));
    }

    for (const video of videos) {
      setUploadMessage(
        `Uploading video ${uploadedVideos.length + 1} of ${videos.length}...`
      );
      const url = await uploadWithRetry(video, "video", 2);
      uploadedVideos.push(url);
      completed += 1;
      setUploadProgress(Math.round((completed / totalFiles) * 100));
    }

    return { imageUrls: uploadedImages, videoUrls: uploadedVideos };
  };

  const uploadWithRetry = async (
    file: File,
    resourceType: "image" | "video",
    retries: number
  ): Promise<string> => {
    try {
      return await uploadToCloudinary(file, resourceType);
    } catch (error) {
      if (retries > 0) {
        return uploadWithRetry(file, resourceType, retries - 1);
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    setUploadMessage("");

    const totalSelectedMedia = files.length + videos.length;
    if (totalSelectedMedia > MAX_TOTAL_MEDIA_ITEMS) {
      addToast({
        title: "Upload limit",
        description: `You can upload up to ${MAX_TOTAL_MEDIA_ITEMS} images and videos in total.`,
        color: "danger",
      });
      setLoading(false);
      return;
    }

    try {
      const uploadedUrls = await uploadFilesSequentially();
      const imageUrls = uploadedUrls.imageUrls;
      const videoUrls = uploadedUrls.videoUrls;

      // Step 2: Send only project metadata + Cloudinary URLs to backend
      const projectPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        client: formData.client,
        location: formData.location,
        size: formData.size,
        typology: formData.typology,
        year: formData.year,
        status: formData.status,
        imageUrls: imageUrls.length > 0 ? imageUrls : existingImages,
        videoUrls: videoUrls.length > 0 ? videoUrls : existingVideos,
      };

      let response;
      if (editId) {
        response = await axios.put(`/api/projects/${editId}`, projectPayload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post("/api/projects/upload", projectPayload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(editId ? "Update failed" : "Project creation failed");
      }
      
      setUploadProgress(100);
      setUploadMessage("Upload complete.");
      setSuccessAlert({
        isOpen: true,
        message: editId 
          ? "The project has been updated successfully." 
          : "The project has been uploaded successfully."
      });
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Upload failed";
      addToast({
        title: editId ? "Update" : "Upload",
        description: message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessAlert({ isOpen: false, message: "" });
    router.push("/");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e5e5e5",
    borderRadius: "0",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1a1a1a",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    color: "#999",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <>
      <NavBar />
      <div
        style={{
          paddingTop: "var(--nav-height)",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "calc(var(--nav-height) + 60px) 24px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: "40px",
          }}
        >
          {editId ? "Edit Project" : "Post Project"}
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              placeholder="Project title"
              style={inputStyle}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Client</label>
            <input
              type="text"
              placeholder="Client name"
              style={inputStyle}
              value={formData.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
              onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                placeholder="City, Country"
                style={inputStyle}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="text"
                placeholder="2025"
                style={inputStyle}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Size</label>
              <input
                type="text"
                placeholder="e.g., 5,000 m²"
                style={inputStyle}
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Typology</label>
              <select
                style={{
                  ...inputStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  paddingRight: "40px",
                }}
                value={formData.typology}
                onChange={(e) =>
                  setFormData({ ...formData, typology: e.target.value })
                }
                required
              >
                <option value="" disabled hidden>
                  Select typology
                </option>
                {TYPOLOGY_VALUES.map((typology) => (
                  <option key={typology} value={typology}>
                    {typology}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{
                ...inputStyle,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                paddingRight: "40px",
              }}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="" disabled hidden>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.category} value={category.category}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Project description"
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              onFocus={(e) => (e.target.style.borderColor = "#1a1a1a")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{
                ...inputStyle,
                padding: "10px 16px",
                cursor: "pointer",
              }}
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                const nextFiles = selectedFiles.slice(0, MAX_TOTAL_MEDIA_ITEMS - videos.length);
                setFiles(nextFiles);
              }}
              required={!editId}
            />
            {files.length > 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "6px",
                }}
              >
                {files.length} image{files.length > 1 ? "s" : ""} selected
              </p>
            ) : editId && existingImages.length > 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "6px",
                }}
              >
                Keeping {existingImages.length} existing image{existingImages.length > 1 ? "s" : ""}
              </p>
            ) : null}
          </div>

          <div>
            <label style={labelStyle}>Videos (optional)</label>
            <input
              type="file"
              multiple
              accept="video/*"
              style={{
                ...inputStyle,
                padding: "10px 16px",
                cursor: "pointer",
              }}
              onChange={(e) => {
                const selectedVideos = Array.from(e.target.files || []);
                const nextVideos = selectedVideos.slice(0, MAX_TOTAL_MEDIA_ITEMS - files.length);
                setVideos(nextVideos);
              }}
            />
            {videos.length > 0 && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "6px",
                }}
              >
                {videos.length} video{videos.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ width: "100%", height: "8px", background: "#f0f0f0", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "#1a1a1a",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              {uploadMessage ? (
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  {uploadMessage}
                </p>
              ) : null}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "#1a1a1a",
              color: "#fff",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
              marginTop: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.target as HTMLButtonElement).style.background = "#333";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                (e.target as HTMLButtonElement).style.background = "#1a1a1a";
            }}
          >
            {loading ? "Saving..." : editId ? "Save Project" : "Upload Project"}
          </button>
        </form>
      </div>

      {/* Success Notification Alert Modal */}
      <CustomAlert
        isOpen={successAlert.isOpen}
        title="Success"
        message={successAlert.message}
        type="info"
        confirmText="OK"
        onClose={handleSuccessClose}
      />
    </>
  );
}
