import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import User from '../../types/User';
import { IoMdClose } from "react-icons/io";
import { LuLogOut, LuMail, LuUser } from "react-icons/lu";
import { Avatar } from '@mui/material';
import { useLogout } from '../../server/router/getDataFromServer';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User
}

const Profile : React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const useHandleSignOut = async () => {
    // Handle sign out logic here
    console.log('Signing out...');
    setIsLoading(true);
    const res = await logout.refetch();
    setIsLoading(false);
    if(!res.data || !res.data.success) alert('Error signing out, please try again later.');
    navigate(0);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 border border-[#111111] bg-[#111111] rounded-xl px-4 py-2  transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Avatar src={user.picture} alt='profile' />
        <span className="text-sm font-medium text-foreground hidden sm:block">
          {user.username}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ 
              type: "spring", 
              duration: 0.3,
              damping: 25,
              stiffness: 300
            }}
            className="absolute bg-[#111111] right-0 top-full mt-2 w-64 border border-[#1f1f1f] rounded-xl shadow-lg overflow-hidden z-50"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Profile</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:shadow hover:shadow-white transition duration-300"
              >
                <IoMdClose className="w-4 h-4 " />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar src={user.picture} alt='profile' />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <LuUser className="w-4 h-4 " />
                    <p className="text-sm font-medium  truncate">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <LuMail className="w-4 h-4 " />
                    <p className="text-xs  truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              { isLoading && <Loading /> }
              {/* Sign Out Button */}
              <div className="border-t text-red-600">
                <motion.button
                  onClick={useHandleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-profile-hover transition-colors duration-200"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LuLogOut className="w-4 h-4 " />
                  <span className="text-sm text-foreground">Sign out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile