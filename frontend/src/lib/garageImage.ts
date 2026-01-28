import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadGarageImageAndSave(
  garageId: string,
  file: File
) {
  const imageUrl = await uploadToCloudinary(file);

  const { error } = await supabase
    .from("garages")
    .update({ image_url: imageUrl })
    .eq("id", garageId);

  if (error) throw error;

  return imageUrl;
}
