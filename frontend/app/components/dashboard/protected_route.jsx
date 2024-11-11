'use client';
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../(root)/context/user.context';
import toast from 'react-hot-toast';
import App from '@/app/(root)/dashboard/page';

const ProtectedRoute = ({ children }) => {
  const [authenticated] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!authenticated?.user?.username) {
      toast.error("Please log in to store the files url.");
      // <App />
      router.push('/');
    }
  }, [authenticated, router]);
  return authenticated?.user?.username ? children : null;
};

export default ProtectedRoute;
