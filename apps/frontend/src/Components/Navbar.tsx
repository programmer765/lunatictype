import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";

export const Navbar = () => {
    return (
        <div className="py-5 text-white px-4">
            <div className="flex justify-between">
                <div className="text-5xl font-semibold font-mono text-[#d4dce4] hover:cursor-pointer">
                    <Link to="/">
                        Lunatictype
                    </Link>
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