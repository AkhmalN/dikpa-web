import { useEffect, useState } from "react";

const API_BASE = 
  import.meta.env.VITE_APP_BASE_URL || "http://localhost:5001/api/v1";

interface SecureImageProps {
  path: string;
}

export const SecureImage = ({ path }: SecureImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/incidents/image-url?path=${encodeURIComponent(path)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImgSrc(data.url); // Masukkan URL rahasia dari AWS/R2 ke state
        }
      })
      .catch((err) => console.error("Gagal load gambar", err));
  }, [path]);

  if (!imgSrc) {
    return (
      <div className="w-full h-24 bg-gray-200 animate-pulse flex items-center justify-center text-xs">
        Memuat foto...
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt="Bukti insiden"
      loading="lazy"
      className="w-full h-24 object-cover"
    />
  );
};
