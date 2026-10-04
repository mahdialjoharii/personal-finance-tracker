const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
};

const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return true;
    }

    return false;
};

const handleResponse = async (response, defaultMessage) => {
    const data = await response.json();

    if (!response.ok) {
        if (handleAuthError(response)) {
            return null;
        }

        throw new Error(data.message || defaultMessage);
    }

    return data;
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

    return handleResponse(
        response,
        "Failed to fetch dashboard"
    );
};

export const getTransactions = async () => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(
        response,
        "Failed to fetch transactions"
    );
};

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(
        response,
        "Failed to fetch categories"
    );
};

export const getIncomeSources = async () => {
    const response = await fetch(`${API_URL}/income-sources`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(
        response,
        "Failed to fetch income sources"
    );
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

    return handleResponse(
        response,
        "Failed to create transaction"
    );
};

export const deleteTransaction = async (id) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    return handleResponse(
        response,
        "Failed to delete transaction"
    );
};

export const updateTransaction = async (id, transactionData) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
    });

    return handleResponse(
        response,
        "Failed to update transaction"
    );
};

export const registerUser = async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};