import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/api";

function Login() {
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState(
        location.state?.success || ""
    );

    useEffect(() => {
        if (location.state?.success) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required.");
            return;
        }

        if (!email.trim().includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (email.trim().length > 255) {
            setError("Email must be 255 characters or less.");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email.trim(), password);

            if (
                typeof data.token !== "string" ||
                !data.token.trim() ||
                typeof data.user !== "object" ||
                data.user === null
            ) {
                throw new Error("Invalid login response.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "/dashboard";
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-glow login-glow-one"></div>
            <div className="login-glow login-glow-two"></div>

            <section className="login-shell">
                <div className="login-intro">
                    <span className="eyebrow">PERSONAL FINANCE</span>

                    <h1>
                        Your money,
                        <span> your story.</span>
                    </h1>

                    <p>
                        A calmer way to understand where your money goes and where you want
                        it to take you.
                    </p>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <span>WELCOME BACK</span>
                        <h2>Sign in</h2>
                        <p>Enter your details to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="email">Email</label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>

                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {successMessage && (
                            <p className="login-success">{successMessage}</p>
                        )}

                        {error && <p className="login-error">{error}</p>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Continue"}

                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <p className="login-register-link">
                        Don't have an account?{" "}
                        <Link to="/register">Create account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;