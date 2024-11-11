'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from '@/app/(root)/context/user.context';

function ImageToPDFUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Convert to PDF");
  const [pdfFile, setPdfFile] = useState(null);
  const fileRef = useRef();
  const [authenticated]=useContext(UserContext);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const userId = authenticated?.user?.id;

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('userId', userId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/load/convert-to-pdf`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.success(response.data.message);
      setPdfFile(response.data.files[0]);
      setSelectedFiles([]);
    } catch (error) {
      console.log('Error converting images to PDF:', error);
      toast.error("An Error occured while creating PDF");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      let dotCount = 0;
      const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 5;
        setLoadingText(`Converting${'.'.repeat(dotCount)}`);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setLoadingText("Convert to PDF");
    }
  }, [isLoading]);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Upload Images to Convert to PDF</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative h-32 rounded-md overflow-hidden border border-gray-700 flex items-center justify-center">
            <img 
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemoveFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        ))}

        <div
          className="border-dashed border-2 border-gray-700 h-32 flex items-center justify-center cursor-pointer rounded-md transition-transform transform hover:scale-105"
          onClick={() => fileRef.current.click()}
        >
          <span className="text-3xl text-gray-400">+</span>
        </div>
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
        className={`bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md w-full transition duration-200 flex justify-center items-center text-lg font-medium ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isLoading || selectedFiles.length === 0}
      >
        {isLoading ? loadingText : "Convert to PDF"}
      </button>

      {pdfFile && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold mb-2">PDF Created Successfully!</h3>
          <a 
            href={`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${pdfFile.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
            download={pdfFile.fileName}
          >
            Download PDF
          </a>
          <div className="mt-2">
            <iframe 
              src={`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${pdfFile.path}`}
              width="100%"
              height="30%"
              className="border border-gray-700 mt-2 rounded-md"
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageToPDFUploader;
