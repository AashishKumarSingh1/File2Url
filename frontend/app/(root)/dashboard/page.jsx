'use client'
import React, { useContext, useEffect, useState } from 'react';
import { FaBeer } from "react-icons/fa";
import { IoIosImage } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { GiBackForth } from "react-icons/gi";
import { SiBetterstack } from "react-icons/si";
import ImageUploader from '@/app/components/dashboard/image.uploader';
import ImageToPDFUploader from '@/app/components/dashboard/image2pdf';
import UserFiles from '@/app/components/dashboard/histoy';
import ChatApp from '@/app/components/dashboard/chat';
import ProtectedRoute from '@/app/components/dashboard/protected_route';
import { UserContext, UserProvider } from '../context/user.context';
import { MdOutlineFollowTheSigns } from "react-icons/md";
import Login from '@/app/(auth)/auth/login';
import Auth from '@/app/(auth)/auth/page';
const App = () => {
  const [authenticated]=useContext(UserContext);
  const [collapsed, setCollapsed] = useState(true);
  const [active, setActive] = useState('LogIn /Sign-up');
  // const [loading,setLoading]=useState(false);
  useEffect(()=>{
    if(authenticated?.user?.username){
      setActive('Image Upload');
    }else{
      setActive('LogIn /Sign-up');
    }

  },[authenticated?.user?.username])

  const menuItems = [
    {
      key:'0',
      icon:<MdOutlineFollowTheSigns />,
      label:"LogIn /Sign-up",
      tooltip:"Register"
    },
    {
      key: '1',
      icon: <IoIosImage />,
      label: 'Image Upload',
      tooltip: "Get url of your image",
    },
    {
      key: '2',
      icon: <FaFilePdf />,
      label: 'Convert to PDF',
      tooltip: "Convert into PDF",
    },
    {
      key: '3',
      icon: <FaHistory />,
      label: 'Previous URLs',
      tooltip: "Previous URLs",
    },
    // {
    //     key: '4',
    //     icon: <SiBetterstack />,
    //     label: 'Give Reveiw',
    //     tooltip: "Tell us how we can improve this Application",
    //   },
  ];

  function getContent(active) {
    switch (active) {
      case 'LogIn /Sign-up':
        return <Auth />
      case 'Image Upload':
        return <ImageUploader />;
      case 'Convert to PDF':
        return <ImageToPDFUploader />; 
      case 'Previous URLs':
        return (<>
        {/* <ProtectedRoute> */}
        <UserFiles />
        {/* </ProtectedRoute> */}
        </>
      );
      // case 'Give Reveiw':
      //   return <ChatApp />; 
      default:
        return <div>Please select an option.</div>;
    }
  }
  

  return (

    // <ProtectedRoute >
    <div className="flex bg-black">
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } bg-[#1a1325] text-white flex-shrink-0 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center mt-4 space-y-2 sticky top-24">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`flex items-center justify-center w-full p-4 hover:bg-gray-700 transition-all cursor-pointer relative group ${
                active === item.label ? 'bg-gray-600' : ''
              }`}
              onClick={() => setActive(item.label)} 
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {!collapsed && item.label}

              <span className="absolute left-full ml-2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg whitespace-nowrap">
                {item.tooltip}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-col w-full">
        <header className="z-10 flex items-center justify-between bg-[#1a1325] text-white p-4 shadow-md">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded bg-gray-800 text-xl flex items-center justify-center hover:bg-gray-700"
            title="Toggle Menu"
          >
            <GiBackForth />
          </button>
        </header>
        
        <main className="flex-grow p-6 bg-white rounded-md shadow-md">
          {/* <h1 className="text-2xl font-bold">{active}</h1> Show the active menu item */}
          {/* <p>Your content goes here.</p>4 */}
          {getContent(active)}

        </main>
      </div>
    </div>
    // </ProtectedRoute>

  );
};

export default App;
