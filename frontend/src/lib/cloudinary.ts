export async function uploadToCloudinary(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("只能上傳圖片");
  if (file.size > 5 * 1024 * 1024) throw new Error("圖片不能超過 5MB");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset); // garages_unsigned
  form.append("folder", "garages");

  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary 上傳失敗");

  const data = await res.json();
  return data.secure_url as string;
}

