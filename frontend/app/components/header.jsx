"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { UserContext, UserProvider } from "../(root)/context/user.context";
UserContext;
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoutModal from '../(auth)/auth/logout'
import toast from "react-hot-toast";
const Header = () => {
  const [toggle, setToggleNav] = useState(false);
  const [authenticated,setAuthenticated] = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const handleToggle = () => setToggleNav((prev) => !prev);
const router=useRouter();

const handleLogout = () => {
  setAuthenticated({ user: {}, token: null });
  Cookies.remove('tokenx');
  setShowModal(false)
  toast.success('Logged out successfully!');
};

const openModal = () => {
  setShowModal(true);
  setToggleNav(false)
}
const closeModal = () => setShowModal(false);
  return (
    <>
      <UserProvider>
      {showModal && (
          <LogoutModal onClose={closeModal} onConfirm={handleLogout} />
        )}
        <nav className="sticky top-0 w-full z-50 bg-[#1a1325] flex justify-between items-center p-5">
          <Link href="/">
            <h1 className="text-transparent text-4xl font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 drop-shadow-2xl shadow-xl rounded-lg p-0 transition-transform transform hover:scale-110 -rotate-6 cursor-pointer duration-300 ease-in-out border-b-8">
              File2Url
            </h1>
          </Link>

          <ul className="hidden md:flex space-x-8 text-white">
            {authenticated?.user?.username ? (
              <>
                <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-yellow-800 font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    // href="/log-out"
                    onClick={openModal}
                    className="hover:scale-110 hover:bg-rose-800 hover:font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Log Out
                  </button>
                </li>
                {/* <li>
                <Link
                  href="/upload"
                  className="hover:scale-110 hover:bg-blue-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                >
                  Upload
                </Link>
              </li> */}
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-amber-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-green-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Login / Sign-up
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="#create-pdf"
                    className="hover:scale-110 hover:bg-amber-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Contact Us
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    href="/register"
                    className="hover:scale-110 hover:bg-indigo-600 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Register
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-green-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                  >
                    Login / Sign-up
                  </Link>
                </li> */}
              </>
            )}
          </ul>

          <button
            className="md:hidden flex flex-col items-center space-y-1 focus:outline-none"
            onClick={handleToggle}
          >
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                toggle ? "transform rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                toggle ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                toggle ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>

        <div
          className={`md:hidden fixed inset-0 bg-gray-900 z-[10] transition-all duration-300 ${
            toggle ? "h-screen" : "h-0"
          }`}
        >
          <ul className="flex flex-col items-center justify-center h-full space-y-8 text-white text-2xl">
            {authenticated?.user?.username ? (
              <>
                <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-yellow-800 font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                    onClick={() => setToggleNav(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    // href="/log-out"
                    className="hover:scale-110 hover:bg-rose-800 hover:font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                    // onClick={() => setToggleNav(false)}
                    onClick={openModal}
                  >
                    Log Out
                  </button>
                </li>
                {/* <li>
                  <Link
                    href="/contact"
                    className="hover:scale-110 hover:bg-blue-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                    onClick={() => setToggleNav(false)}
                  >
                    Contact Us
                  </Link>
                </li> */}
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/"
                    className="hover:scale-110 hover:bg-green-800 hover:text-white font-semibold hover:p-4 hover:rounded-lg transition-all ease-out"
                    onClick={() => setToggleNav(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:scale-110 hover:bg-blue-800 font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                    onClick={() => setToggleNav(false)}
                  >
                    Login
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/contact"
                    className="hover:scale-110 hover:bg-blue-800 font-semibold hover:text-white hover:p-4 hover:rounded-lg transition-all ease-out"
                    onClick={() => setToggleNav(false)}
                  >
                    Contact Us
                  </Link>
                </li> */}
                
              </>
            )}
          </ul>
        </div>
      </UserProvider>
    </>
  );
};

export default Header;
