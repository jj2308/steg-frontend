const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function embedData(formData, onProgress) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.open("POST", `${API}/api/embed`);

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) {
          reject(new Error(data.error || "Embedding failed"));
        } else {
          resolve(data);
        }
      } catch {
        reject(new Error("Invalid server response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error — is the backend running?"));
    xhr.send(formData);
  });
}

export async function extractData(formData, onProgress) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.open("POST", `${API}/api/extract`);

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) {
          reject(new Error(data.error || "Extraction failed"));
        } else {
          resolve(data);
        }
      } catch {
        reject(new Error("Invalid server response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error — is the backend running?"));
    xhr.send(formData);
  });
}

export function getDownloadUrl(filename) {
  return `${API}/api/download/${encodeURIComponent(filename)}`;
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API}/api/health`);
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
