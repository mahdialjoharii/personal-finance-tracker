import { useEffect, useState } from "react";
import {
    getTransactions,
    getCategories,
    getIncomeSources,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "../services/api";
import Navbar from "../components/Navbar";
import "./Transactions.css";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState("EXPENSE");
    const [amount, setAmount] = useState("");
    const [categories, setCategories] = useState([]);
    const [incomeSources, setIncomeSources] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [incomeSource, setIncomeSource] = useState("");
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (!date) {
            setError("Please select a date.");
            return;
        }

        if (type === "EXPENSE" && !categoryId) {
            setError("Please select a category.");
            return;
        }

        if (type === "INCOME" && !incomeSource) {
            setError("Please select an income source.");
            return;
        }

        try {
            const transactionData = {
                amount: Number(amount),
                type,
                categoryId: type === "EXPENSE" ? Number(categoryId) : null,
                incomeSourceId:
                    type === "INCOME" ? Number(incomeSource) : null,
                description,
                date,
            };

            if (editingTransaction) {
                const data = await updateTransaction(
                    editingTransaction.id,
                    transactionData
                );

                console.log("Transaction updated:", data);

                const updatedTransactions = await getTransactions();

                setTransactions(
                    updatedTransactions.sort((a, b) => {
                        return b.date.localeCompare(a.date);
                    })
                );
            } else {
                const data = await createTransaction(transactionData);

                console.log("Transaction created:", data);

                setTransactions((prev) =>
                    [...prev, data.transaction].sort((a, b) => {
                        return b.date.localeCompare(a.date);
                    })
                );
            }

            setEditingTransaction(null);
            setShowForm(false);

        } catch (error) {
            console.error("Save transaction error:", error);

            setError(error.message);
        }
    };

    const resetTransactionForm = () => {
        setAmount("");
        setType("EXPENSE");
        setCategoryId("");
        setIncomeSource("");
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
        setEditingTransaction(null);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);

        setAmount(transaction.amount);
        setType(transaction.type);
        setCategoryId(transaction.category_id || "");
        setIncomeSource(transaction.income_source_id || "");
        setDescription(transaction.description || "");
        setDate(transaction.date);

        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteTransaction(id);

            setTransactions((prev) =>
                prev.filter((transaction) => transaction.id !== id)
            );

            console.log("Transaction deleted:", id);
        } catch (error) {
            console.error("Delete transaction error:", error);
        }
    };

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await getTransactions();

                console.log("Transactions data:", data);
                console.log("First transaction date:", data[0]?.date);

                setTransactions(data);
            } catch (error) {
                console.error("Transactions error:", error);
            }
        };

        loadTransactions();

        const loadCategories = async () => {
            try {
                const data = await getCategories();

                console.log("Categories data:", data);

                setCategories(data);
            } catch (error) {
                console.error("Categories error:", error);
            }
        };

        loadCategories();

        const loadIncomeSources = async () => {
            try {
                const data = await getIncomeSources();

                console.log("Income sources data:", data);

                setIncomeSources(data);
            } catch (error) {
                console.error("Income sources error:", error);
            }
        };

        loadIncomeSources();
    }, []);

    return (
        <main className="transactions-page">
            <Navbar />

            <header className="transactions-header">
                <div className="transactions-header-content">
                    <h1>Transactions</h1>
                    <p>Manage your income and expenses.</p>
                </div>

                <button
                    className="add-transaction-button"
                    onClick={() => {
                        resetTransactionForm();
                        setShowForm(true);
                    }}
                >
                    <span>+</span>
                    Add Transaction
                </button>
            </header>

            {showForm && (
                <div className="transaction-form-card">
                    <div className="transaction-form-header">
                        <div>
                            <span>
                                {editingTransaction
                                    ? "EDIT TRANSACTION"
                                    : type === "EXPENSE"
                                        ? "NEW EXPENSE"
                                        : "NEW INCOME"}
                            </span>

                            <h2>
                                {editingTransaction
                                    ? "Edit Transaction"
                                    : type === "EXPENSE"
                                        ? "Add Expense"
                                        : "Add Income"}
                            </h2>

                            <p>
                                {type === "EXPENSE"
                                    ? "Record an expense from your account."
                                    : "Record money coming into your account."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="transaction-form-close"
                            onClick={() => {
                                resetTransactionForm();
                                setShowForm(false);
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="transaction-error">
                            {error}
                        </div>
                    )}

                    <div className="transaction-type">
                        <button
                            type="button"
                            className={type === "EXPENSE" ? "active" : ""}
                            onClick={() => {
                                setType("EXPENSE");
                                setIncomeSource("");
                                setError("");
                            }}
                        >
                            Expense
                        </button>

                        <button
                            type="button"
                            className={type === "INCOME" ? "active" : ""}
                            onClick={() => {
                                setType("INCOME");
                                setCategoryId("");
                                setError("");
                            }}
                        >
                            Income
                        </button>
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="amount">Amount</label>

                        <div className="amount-input">
                            <span>$</span>

                            <input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(event) => {
                                    setAmount(event.target.value);
                                    setError("");
                                }}
                            />
                        </div>
                    </div>

                    {type === "EXPENSE" ? (
                        <div className="transaction-form-field">
                            <label htmlFor="category">Category</label>

                            <select
                                id="category"
                                value={categoryId}
                                onChange={(event) => {
                                    setCategoryId(event.target.value);
                                    setError("");
                                }}
                            >
                                <option value="">Select a category</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="transaction-form-field">
                            <label htmlFor="incomeSource">Source</label>

                            <select
                                id="incomeSource"
                                value={incomeSource}
                                onChange={(event) => {
                                    setIncomeSource(event.target.value);
                                    setError("");
                                }}
                            >
                                <option value="">Select a source</option>

                                {incomeSources.map((source) => (
                                    <option key={source.id} value={source.id}>
                                        {source.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="transaction-form-field">
                        <label htmlFor="description">Description</label>

                        <input
                            id="description"
                            type="text"
                            placeholder="e.g. Monthly rent"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="date">Date</label>

                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(event) => {
                                setDate(event.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        className="transaction-submit-button"
                        onClick={handleSubmit}
                    >
                        {editingTransaction
                            ? "Update Transaction"
                            : type === "EXPENSE"
                                ? "Add Expense"
                                : "Add Income"}
                    </button>

                </div>
            )}

            <section className="transactions-list">
                {transactions.map((transaction) => (
                    <article className="transaction-card" key={transaction.id}>
                        <span className="transaction-description">
                            {transaction.description || "No description"}
                        </span>

                        <span className="transaction-category">
                            {transaction.type === "INCOME"
                                ? transaction.income_source_name
                                : transaction.category_name}
                        </span>

                        <span className="transaction-date">
                            {transaction.date}
                        </span>

                        <span
                            className={`transaction-amount ${transaction.type === "INCOME" ? "income" : "expense"
                                }`}
                        >
                            {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount}
                        </span>

                        <button
                            type="button"
                            className="transaction-edit-button"
                            onClick={() => handleEdit(transaction)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="transaction-delete-button"
                            onClick={() => handleDelete(transaction.id)}
                        >
                            Delete
                        </button>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Transactions;