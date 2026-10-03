import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import StatCard from "../components/StatCard";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const monthlyChartData = {
        labels: dashboard?.monthlySummary?.map((item) => item.month) || [],
        datasets: [
            {
                label: "Income",
                data:
                    dashboard?.monthlySummary?.map(
                        (item) => Number(item.totalIncome)
                    ) || [],
                backgroundColor: "#20d9a4",
                borderColor: "#20d9a4",
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: "Expenses",
                data:
                    dashboard?.monthlySummary?.map(
                        (item) => Number(item.totalExpenses)
                    ) || [],
                backgroundColor: "#ff6b6b",
                borderColor: "#ff6b6b",
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const categoryChartData = {
        labels:
            dashboard?.expensesByCategory?.map(
                (item) => item.category
            ) || [],

        datasets: [
            {
                data:
                    dashboard?.expensesByCategory?.map(
                        (item) => Number(item.total)
                    ) || [],
                backgroundColor: [
                    "#20d9a4",
                    "#ff7b8a",
                    "#7aa2ff",
                    "#f7c873",
                    "#b58cff",
                    "#ff9f68",
                    "#63d8ff",
                    "#a7b0ad",
                ],
                borderWidth: 0,
            },
        ],
    };

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
                <>
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

                    <div className="dashboard-charts-grid">

                        <section className="dashboard-chart-card">
                            <div className="dashboard-chart-header">
                                <div>
                                    <span className="dashboard-chart-eyebrow">
                                        MONTHLY OVERVIEW
                                    </span>

                                    <h2>Income & Expenses</h2>

                                    <p>Compare your income and expenses by month.</p>
                                </div>
                            </div>

                            <div className="dashboard-chart">
                                <Bar
                                    data={monthlyChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,

                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#f5f7f6",
                                                    font: {
                                                        size: 12,
                                                        weight: "600",
                                                    },
                                                },
                                            },
                                        },

                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: "#74847f",
                                                },
                                                grid: {
                                                    color: "rgba(255, 255, 255, 0.05)",
                                                },
                                            },

                                            y: {
                                                ticks: {
                                                    color: "#74847f",
                                                },
                                                grid: {
                                                    color: "rgba(255, 255, 255, 0.05)",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </section>

                        <section className="dashboard-chart-card">
                            <div className="dashboard-chart-header">
                                <div>
                                    <span className="dashboard-chart-eyebrow">
                                        EXPENSE BREAKDOWN
                                    </span>

                                    <h2>Expenses by Category</h2>

                                    <p>See where your money is going.</p>
                                </div>
                            </div>

                            <div className="dashboard-category-chart">
                                <Doughnut
                                    data={categoryChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,

                                        plugins: {
                                            legend: {
                                                position: "right",
                                                labels: {
                                                    color: "#f5f7f6",
                                                    padding: 16,
                                                    font: {
                                                        size: 12,
                                                        weight: "600",
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </section>
                    </div>

                    <section className="recent-transactions-card">
                        <div className="recent-transactions-header">
                            <div>
                                <span className="dashboard-chart-eyebrow">
                                    RECENT ACTIVITY
                                </span>

                                <h2>Recent Transactions</h2>

                                <p>Your latest income and expenses.</p>
                            </div>
                        </div>

                        <div className="recent-transactions-list">
                            {dashboard.recentTransactions.map((transaction) => (
                                <div
                                    className="recent-transaction"
                                    key={transaction.id}
                                >
                                    <div className="recent-transaction-info">
                                        <div className="recent-transaction-name">
                                            {transaction.type === "EXPENSE"
                                                ? transaction.category_name
                                                : transaction.income_source_name}
                                        </div>

                                        <div className="recent-transaction-date">
                                            {transaction.date}
                                        </div>
                                    </div>

                                    <div
                                        className={`recent-transaction-amount ${transaction.type === "INCOME"
                                                ? "income"
                                                : "expense"
                                            }`}
                                    >
                                        {transaction.type === "INCOME" ? "+" : "-"}$
                                        {transaction.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default Dashboard;