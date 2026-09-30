import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const location = useLocation();

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

            <div className="navbar-links">
                <Link
                    to="/dashboard"
                    className={location.pathname === "/dashboard" ? "active" : ""}
                >
                    Dashboard
                </Link>

                <Link
                    to="/transactions"
                    className={location.pathname === "/transactions" ? "active" : ""}
                >
                    Transactions
                </Link>
            </div>

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