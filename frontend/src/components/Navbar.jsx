import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                <span className="navbar-logo">PF</span>
                <span>Finance</span>
            </Link>

            <div className="navbar-user">
                <span>{user?.name}</span>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;