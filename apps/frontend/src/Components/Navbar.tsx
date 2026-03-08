import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { FaHome } from "react-icons/fa";
import Profile from "./Profile/Profile";
import { useNavigate } from "react-router-dom";
import useHomeStore from "../store/homeStore";
import useUserStore from "../store/userStore";

export const Navbar : React.FC = () => {

    const navigate = useNavigate();
    const setIsHome = useHomeStore((state) => state.setIsHome);
    const isHome = useHomeStore((state) => state.isHome);
    const user = useUserStore((state) => state.user);

    const handleHomeBtnClick = () => {
        if(isHome) return;
        setIsHome(true);
        navigate("/");
    }

    return (
        <div className="py-5 text-white px-5">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <div className="md:text-5xl text-1xl font-semibold font-mono text-[#d4dce4] hover:cursor-pointer" onClick={handleHomeBtnClick}>
                        <Link to="/">
                            lunatictype
                        </Link>
                    </div>
                    <div className="px-3">
                        <KeyboardIcon />
                    </div>
                    <div className={`${!isHome ? 'text-white transition-all duration-300' : 'text-gray-500 transition-all duration-300 delay-100'}`} onClick={handleHomeBtnClick}>
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