import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import KeyboardIcon from '@mui/icons-material/Keyboard';

export const Navbar = () => {
    return (
        <div className="py-5 text-white px-5">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <div className="text-5xl font-semibold font-mono text-[#d4dce4] hover:cursor-pointer">
                        <Link to="/">
                            lunatictype
                        </Link>
                    </div>
                    <div className="px-3">
                        <KeyboardIcon />
                    </div>
                </div>
                <div className="flex">
                    <div className='px-2'>
                        <LoginButton />
                    </div>
                    <div className='px-2'>
                        <SignUpButton />
                    </div>
                </div>
            </div>
        </div>
    );
};