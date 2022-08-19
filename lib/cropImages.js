import getCroppedImg from "../utils/cropImage";

export async function cropImages(pic, crop) {
  const { url } = await getCroppedImg(pic, crop);
  return url;
}
