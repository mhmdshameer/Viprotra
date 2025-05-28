import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '../app/api/uploadthing/core';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onUploadComplete, currentImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the dropped files if needed
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {currentImage ? (
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={currentImage}
              alt="Current profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="text-gray-500">
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag & drop an image here, or click to select</p>
            )}
          </div>
        )}
      </div>

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