import React from 'react';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdHome, MdEmail, MdPhone, MdPrint } from 'react-icons/md';
import { FaHeart } from "react-icons/fa";
import { GrLocationPin } from "react-icons/gr";
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className="bg-[#1a1325] text-white py-10">
        <div className="flex flex-wrap justify-around m-4">
          {/* Brand Section */}
          <div className="w-full md:w-1/4 mb-8">
          <Link href="/">
            <h1 className="text-transparent text-4xl font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 drop-shadow-2xl shadow-xl rounded-lg p-0 transition-all hovr  cursor-pointer duration-300 ease-in-out">
              File2Url
            </h1>
          </Link>
            <p className="mb-4">From Files to Links, Simplifying Transfers.</p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF size={20} />, link: "#" },
                // { icon: <FaTwitter size={20} />, link: "#" },
                { icon: <FaGoogle size={20} />, link: "#" },
                { icon: <FaInstagram size={20} />, link: "#" },
                { icon: <FaLinkedin size={20} />, link: "#" },
                { icon: <FaGithub size={20} />, link: "#" },
              ].map((item, index) => (
                <a key={index} href={item.link} className="text-gray-400 hover:text-gray-300 transition duration-200">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          {/* <div className="w-full md:w-1/4 mb-8">
            <h6 className="text-lg font-semibold mb-4">Useful Links</h6>
            <ul className="space-y-2">
              {["Home", "Login", "Signup", "Help", "Dashboard"].map((link, index) => (
                <li key={index}>
                  <a href={`/${link.toLowerCase()}`} className="hover:text-orange-400 transition duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Information */}
          <div className="w-full md:w-1/4 mb-8">
            <h6 className="text-lg font-semibold mb-4">Contact</h6>
            <div className="flex items-center mb-2">
              <GrLocationPin className="mr-1" size={20} /> 
              <span>Gurugram, Haryana, India</span>
            </div>
            <div className="flex items-center mb-2">
              <MdEmail className="mr-2" size={20} /> 
              <span>aashishs.ug23.cs@nitp.ac.in</span>
            </div>
            <div className="flex items-center mb-2">
              <MdHome className="mr-2" size={20} /> 
              <span>National Institute of Technology, Patna, Bihar</span>
            </div>
            
          </div>
   
      </div>
              <hr className='mx-7' />
              <div className="text-center py-6 bg-gradient-to-r from-[#1a1325] via-[#282634] to-[#1a1325]">
  <p className="text-gray-200 flex justify-center items-center gap-1 font-semibold text-xl">
    Created with{" "}
    <FaHeart className="text-red-600 animate-pulse inline-block mx-1" /> by{" "}
    <a
      href="https://www.linkedin.com/in/aashish-kumar-singh-7110b02a9/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-400 font-bold hover:text-orange-300  duration-200 hover:border-b-amber-600 hover:border-b-4 px-4 rounded-3xl transition-all ease-in-out"
    >
      Aashish
    </a>
  </p>
</div>
    </footer>
  );
};

export default Footer;