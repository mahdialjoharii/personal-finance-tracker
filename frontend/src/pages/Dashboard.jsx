import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import StatCard from "../components/StatCard";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getDashboard();

                console.log("Dashboard data:", data);

                setDashboard(data);
            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };

        loadDashboard();
    }, []);

    return (
        <main className="dashboard-page">
            <Navbar />

            <header className="dashboard-header">
                <span className="dashboard-eyebrow">PERSONAL FINANCE</span>

                <h1>Welcome back, {user?.name}</h1>

                <p>Here’s an overview of your finances.</p>
            </header>

            {dashboard && (
                <section className="stats-grid">
                    <StatCard
                        label="Total Income"
                        value={`$${dashboard.totalIncome}`}
                    />

                    <StatCard
                        label="Total Expenses"
                        value={`$${dashboard.totalExpenses}`}
                    />

                    <StatCard
                        label="Balance"
                        value={`$${dashboard.balance}`}
                    />
                </section>
            )}
        </main>
    );
}

export default Dashboard;