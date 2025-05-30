import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '../app/api/uploadthing/core';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onUploadComplete, currentImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      {currentImage ? (
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={currentImage}
            alt="Current profile"
            fill
            className="object-cover rounded-full"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300">
          <div className="text-gray-500">
            <p>Click the button below to upload your photo</p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onUploadComplete(res[0].url);
            }
            setIsUploading(false);
          }}
          onUploadError={(error: Error) => {
            console.error('Upload error:', error);
            setIsUploading(false);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
        />
      </div>
    </div>
  );
};

export default ImageUpload; 