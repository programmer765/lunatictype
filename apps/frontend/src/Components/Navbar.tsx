import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div className="py-5 text-white px-2">
            <div className="text-center text-5xl font-semibold font-mono text-[#d4dce4] hover:cursor-pointer">
                <Link to="/">
                    Lunatictype
                </Link>
            </div>
        </div>
    );
};