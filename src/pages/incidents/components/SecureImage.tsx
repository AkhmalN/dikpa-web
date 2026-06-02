import { useEffect, useState } from "react";

export const SecureImage = ({ path }) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    // Panggil backend Anda untuk mendapatkan Presigned URL
    fetch(
      `http://localhost:5001/api/v1/incidents/image-url?path=${encodeURIComponent(path)}`,
    )
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
