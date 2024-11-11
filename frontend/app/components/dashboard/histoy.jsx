"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSort } from "react-icons/fa";
import { BsImages, BsFileEarmarkPdf } from "react-icons/bs";
import { UserContext } from "@/app/(root)/context/user.context";
import Link from "next/link";
// import { useNavigate } from "react-router-dom";
// import Router from "next/navigation";
import { useRouter } from "next/navigation";
function UserFiles() {
  // const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState("Images");
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;
  const [authenticated] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const handleRefresh=()=>{
    // navigate(0);
    window.location.reload();
  }
  const fetchFiles = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/load/files`,
        {
          params: {
            type: type || activeTab.toLowerCase(),
            page,
            itemsPerPage,
            sortOrder,
            userId: authenticated?.user?.id,
          },
        }
      );

      if (response.data.files) {
        setFiles(response.data.files);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setFiles([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log("Error fetching files:", error);
      // toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab, page, sortOrder]);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  function handleClick() {
    fetchFiles("images");
    setActiveTab("Images");
  }

  return (
    <>
      {!authenticated?.user?.username ? (
        <main className=" font-sans">
          <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md mt-10 drop-shadow">
            <h1 className="text-3xl font-semibold text-center text-white mb-6">
              Uploaded Files and PDF Links
            </h1>

            <div className="bg-gray-700 border-l-4 border-blue-500 p-4 mb-6 text-white rounded-lg">
              <p className="text-lg">
                Here you will see your uploaded file URLs and PDF links with
                downloadable links.
              </p>
              <p className="mt-2 text-lg">
                To view the content, you can either{" "}
                <button onClick={handleRefresh} className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </button>{" "}
                or use the following login credentials:
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Login Credentials:
              </h3>
              <div className="bg-gray-300 p-4 rounded-lg">
                <p className="text-lg">
                  <strong className="text-gray-800">Username:</strong> file2url
                </p>
                <p className="text-lg">
                  <strong className="text-gray-800">Password:</strong> file2url
                </p>
                <div className="flex justify-end w-full">
                <button
                onClick={handleRefresh}
                // href="/"
                className="bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Log-In Now
              </button>
              </div>
              </div>
            </div>

            <div className="text-center">
              <button
                // href="/"
                onClick={handleRefresh}
                className="bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
              >
                Sign Up Now
              </button>
              
            </div>
          </div>
        </main>
      ) : (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto ">
          <div className="flex justify-between items-center mb-6 ">
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center space-x-2 py-2 px-4 ${
                  activeTab === "Images" ? "bg-blue-600" : "bg-gray-600"
                } rounded-md`}
                onClick={handleClick}
                // onClick={() => setActiveTab("Image")}
              >
                <BsImages size={18} />
                <span>Images</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-2 px-4 ${
                  activeTab === "PDFs" ? "bg-blue-600" : "bg-gray-600"
                } rounded-md`}
                onClick={() => setActiveTab("PDFs")}
              >
                <BsFileEarmarkPdf size={18} />
                <span>PDFs</span>
              </button>
            </div>
            <button
              onClick={handleSortChange}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
            >
              <span>Sort by Date</span>
              <FaSort
                size={16}
                className="ml-2"
                style={{
                  transform: sortOrder === "asc" ? "rotate(180deg)" : "none",
                }}
              />
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-400">Loading files...</p>
              <div className="loader" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {files.length === 0 ? (
                <p className="text-center text-gray-400">No files found.</p>
              ) : (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded-md shadow-md justify-evenly flex flex-col"
                  >
                    <p className="text-sm text-gray-400">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    {activeTab === "Images" ? (
                      <>
                        <img
                          src={file?.url[0]?.url || file?.fileName}
                          alt={file?.fileName}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <div className="mt-2 flex justify-between">
                          <button
                            onClick={() => handleCopy(file.url[0].url)}
                            className="text-green-400"
                          >
                            Copy URL
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <iframe
                          src={`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${file.path}`}
                          width="100%"
                          height="30%"
                          className="border border-gray-700 mt-2 rounded-md"
                          title="PDF Preview"
                        ></iframe>
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 mt-7 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
                          download={file?.fileName}
                        >
                          Download PDF
                        </a>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserFiles;
