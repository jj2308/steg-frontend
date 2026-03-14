import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Image, Video, Upload, FileUp, Key, Lock, Eye, EyeOff } from "lucide-react";
import { embedData } from "../lib/api";
import EmbedResult from "../components/EmbedResult";

export default function EmbedPage() {
  const [mediaType, setMediaType] = useState("image");
  const [coverFile, setCoverFile] = useState(null);
  const [secretMode, setSecretMode] = useState("text");
  const [secretText, setSecretText] = useState("");
  const [secretFile, setSecretFile] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setProgress(0);

    if (!coverFile) { setError("Please upload a cover file."); return; }
    if (!passphrase || passphrase.length < 4) { setError("Passphrase must be at least 4 characters."); return; }
    if (secretMode === "text" && !secretText.trim()) { setError("Please enter secret text."); return; }
    if (secretMode === "file" && !secretFile) { setError("Please upload a secret file."); return; }

    const formData = new FormData();
    formData.append("media_type", mediaType);
    formData.append("cover_file", coverFile);
    formData.append("passphrase", passphrase);
    if (secretMode === "text") {
      formData.append("secret_text", secretText);
    } else {
      formData.append("secret_file", secretFile);
    }

    setLoading(true);
    try {
      const data = await embedData(formData, setProgress);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <>
        <Head><title>Embedding Result — MultiSteg</title></Head>
        <EmbedResult data={result} />
        <div className="text-center mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium">Home</Link>
          <button onClick={() => setResult(null)} className="px-4 py-2 border border-blue-400 rounded-lg text-blue-600 hover:bg-blue-50 text-sm font-medium">Embed More</button>
          <Link href="/extract" className="px-4 py-2 border border-green-400 rounded-lg text-green-600 hover:bg-green-50 text-sm font-medium">Extract</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Embed — MultiSteg</title></Head>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-blue-500" /> Embed Secret Data
          </h2>
          <p className="text-slate-500">Encrypt and hide your data inside an image or video</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Media type */}
          <div className="form-section mb-5">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-700">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Choose Media Type
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMediaType("image")}
                className={`py-4 rounded-xl border-2 font-semibold flex flex-col items-center gap-1 transition-colors ${
                  mediaType === "image" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Image className="w-8 h-8" />
                Image Steganography
              </button>
              <button
                type="button"
                onClick={() => setMediaType("video")}
                className={`py-4 rounded-xl border-2 font-semibold flex flex-col items-center gap-1 transition-colors ${
                  mediaType === "video" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Video className="w-8 h-8" />
                Video Steganography
              </button>
            </div>
          </div>

          {/* Step 2: Cover file */}
          <div className="form-section mb-5">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-700">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Upload Cover Media
            </h5>
            <label className="file-upload-area block">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-1" />
              {coverFile ? (
                <p className="text-sm">
                  <strong>{coverFile.name}</strong>{" "}
                  ({(coverFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              ) : (
                <>
                  <p className="text-slate-500 text-sm mb-1">Click to upload cover image or video</p>
                  <p className="text-slate-400 text-xs">
                    Supported: PNG, JPG for images &middot; MP4, MOV for videos
                  </p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept={
                  mediaType === "image"
                    ? "image/png,image/jpeg"
                    : "video/mp4,video/quicktime,video/x-msvideo"
                }
                onChange={(e) => setCoverFile(e.target.files[0] || null)}
              />
            </label>
          </div>

          {/* Step 3: Secret data */}
          <div className="form-section mb-5">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-700">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Secret Data
            </h5>
            <div className="flex border-b border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setSecretMode("text")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  secretMode === "text" ? "border-accent text-accent" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setSecretMode("file")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  secretMode === "file" ? "border-accent text-accent" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                File
              </button>
            </div>
            {secretMode === "text" ? (
              <textarea
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                rows={4}
                placeholder="Type or paste your secret message here..."
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
              />
            ) : (
              <label className="file-upload-area block">
                <FileUp className="w-7 h-7 mx-auto text-slate-400 mb-1" />
                {secretFile ? (
                  <p className="text-sm">
                    <strong>{secretFile.name}</strong>{" "}
                    ({(secretFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm">Click to upload a secret file</p>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setSecretFile(e.target.files[0] || null)}
                />
              </label>
            )}
          </div>

          {/* Step 4: Passphrase */}
          <div className="form-section mb-5">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-700">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Encryption Passphrase
            </h5>
            <div className="flex">
              <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
                <Key className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type={showPass ? "text" : "password"}
                className="flex-1 border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="Enter a strong passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                minLength={4}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center px-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg"
              >
                {showPass ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              AES-256-CBC encryption with zlib compression. Remember this passphrase for extraction.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Progress bar */}
          {loading && progress > 0 && (
            <div className="mb-5">
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-center">Uploading... {progress}%</p>
            </div>
          )}

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-accent text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Encrypt &amp; Embed
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
