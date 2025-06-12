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
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleCancel = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src={previewUrl}
              alt="Selected image"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex justify-center gap-4">
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
                setPreviewUrl(null);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
            />
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
        >
          <input {...getInputProps()} />
          <div className="text-gray-500">
            <p>Drag and drop your photo here, or click to select</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 