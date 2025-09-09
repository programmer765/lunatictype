import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { FaHome } from "react-icons/fa";
import User from "../types/User";
import Profile from "./Profile/Profile";

interface NavbarProps {
    isPractice: boolean;
    isOnline: boolean;
    setIsPractice: (isPractice: boolean) => void;
    setIsOnline: (isOnline: boolean) => void;
    user?: User
}

const handleLunaticTypeClick = (setIsPractice: (isPractice: boolean) => void, setIsOnline: (isOnline: boolean) => void) => {
    setIsPractice(false);
    setIsOnline(false);
}

export const Navbar : React.FC<NavbarProps> = ({ isPractice, isOnline, setIsPractice, setIsOnline, user }) => {
    return (
        <div className="py-5 text-white px-5">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <div className="md:text-5xl text-1xl font-semibold font-mono text-[#d4dce4] hover:cursor-pointer" onClick={() => handleLunaticTypeClick(setIsPractice, setIsOnline)}>
                        <Link to="/">
                            lunatictype
                        </Link>
                    </div>
                    <div className="px-3">
                        <KeyboardIcon />
                    </div>
                    <div className={`${isPractice || isOnline ? 'text-white transition-all duration-300' : 'text-gray-500 transition-all duration-300 delay-100'}`} onClick={() => handleLunaticTypeClick(setIsPractice, setIsOnline)}>
                        <FaHome className="text-2xl cursor-pointer" />
                    </div>
                </div>
                {
                    user !== null && user !== undefined ?
                    <Profile user={user} />
                    : 
                    (
                        <div className="flex">
                            <div className='px-2'>
                                <LoginButton />
                            </div>
                            <div className='px-2'>
                                <SignUpButton />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};