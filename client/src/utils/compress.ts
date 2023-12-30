import imageCompression from "browser-image-compression";

export const compress = async (imageFile: File): Promise<File | undefined> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 720,
  };
  if (!/image/.test(imageFile.type)) return imageFile;
  let compressedFile;
  try {
    compressedFile = await imageCompression(imageFile, options);
  } catch (error) {
    console.log(error);
  }
  return compressedFile;
};
