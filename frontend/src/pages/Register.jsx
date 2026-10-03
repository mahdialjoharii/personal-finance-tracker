import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!name || !email || !password) {
            setError("Name, email, and password are required.");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(name, email, password);

            console.log("Registration successful:", data);

            navigate("/login", {
                state: {
                    success: "Account created successfully. You can now sign in.",
                },
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <section className="register-card">
                <div className="register-header">
                    <span className="eyebrow">PERSONAL FINANCE</span>

                    <h1>Create account</h1>

                    <p>
                        Start tracking your money and take control of your finances.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

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

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {error && <p className="register-error">{error}</p>}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}

                        {!loading && <span>→</span>}
                    </button>
                </form>

                <p className="register-login-link">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;