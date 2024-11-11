'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from '@/app/(root)/context/user.context';

function ImageUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Upload Images");
  const [images, setImages] = useState([]);
  const fileRef = useRef();
  const [authenticated]=useContext(UserContext);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((urls) => {
      setImages((prev) => [...prev, ...urls]);
      // toast.success(`${files.length} image(s) selected`);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const userId = authenticated?.user?.id;
    toast.success(userId)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/load/upload-images`,
        {
          images,
          id: userId,
        }
      );

      setUploadedImages(response.data.urls);
      setImages([]);
      setSelectedFiles([]);
      toast.success('Images uploaded successfully!'); 
    } catch (error) {
      console.log('Error uploading images:', error);
      toast.error('Error uploading images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      let dotCount = 0;
      const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 5;
        setLoadingText(`Uploading${'.'.repeat(dotCount)}`);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setLoadingText("Upload Images");
    }
  }, [isLoading]);

  const handleShare = (url) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Sharing options opened!');
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out hover:shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Upload and Preview Image</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        {images.map((image, index) => (
          <div key={index} className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-md overflow-hidden border border-gray-700">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        ))}
    {
        images.length==0 && (
            <div
          className="border-dashed border-2 border-gray-700 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center cursor-pointer rounded-md transition transform hover:scale-105"
          onClick={() => fileRef.current.click()}
        >
        <span className="text-3xl text-gray-400">+</span>
        </div>
        )
    }
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileRef}
      />

      <button
        onClick={handleUpload}
        className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md w-full transition duration-200 flex justify-center items-center text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? loadingText : "Upload Images"}
      </button>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uploadedImages.map((image, index) => (
          <div key={index} className="flex flex-col items-center p-3 bg-gray-800 rounded-lg shadow hover:shadow-lg transition duration-200">
            <img src={image.url} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded-md mb-2 border border-gray-700" />
            <p className="text-sm text-gray-400 text-center mb-2 truncate w-full">{image.public_id}</p>
            <div className='flex flex-row gap-4 justify-between'>
            <button
              onClick={() => {
                navigator.clipboard.writeText(image.url).then(() => {
                  toast.success('URL copied to clipboard!'); // Toast for copying URL
                });
              }}
              className="mt-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition duration-200 text-sm order-2"
            >
              Copy URL
            </button>
            <button
              onClick={() => handleShare(image.url)}
              className="mt-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md transition duration-200 text-sm"
            >
              Share
            </button>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
