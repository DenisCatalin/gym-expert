import Cropper from "react-easy-crop";
import { useState, useCallback, useContext } from "react";
import { cropContext } from "../../../lib/cropContext";

type IPhotoCrop = {
  image: string | undefined;
};

const PhotoCrop = ({ image }: IPhotoCrop) => {
  const { cropImage, setCropImage } = useContext(cropContext);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCropImage(croppedAreaPixels);
  }, []);
  return (
    <>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </>
  );
};

export default PhotoCrop;
