import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../app/api/uploadthing/core";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onUploadComplete, currentImage }: ImageUploadProps) => (
  <div className="w-full max-w-md mx-auto">
    <UploadDropzone<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
      }}
    />
    {currentImage && (
      <div className="relative w-32 h-32 mx-auto mt-4">
        <img src={currentImage} alt="Uploaded" className="object-cover rounded-full w-full h-full" />
      </div>
    )}
  </div>
);

export default ImageUpload; 