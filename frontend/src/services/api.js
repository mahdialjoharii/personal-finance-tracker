const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};

export const getDashboard = async () => {
    const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard");
    }

    return data;
};

export const getTransactions = async () => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
    }

    return data;
};

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
    }

    return data;
};

export const getIncomeSources = async () => {
    const response = await fetch(`${API_URL}/income-sources`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch income sources");
    }

    return data;
};

export const createTransaction = async ({
    amount,
    type,
    categoryId,
    incomeSourceId,
    description,
    date,
}) => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            amount,
            type,
            categoryId,
            incomeSourceId,
            description,
            date,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create transaction");
    }

    return data;
};

export const deleteTransaction = async (id) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
    }

    return data;
};