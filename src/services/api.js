// API service for handling backend requests

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(credentials),
    });
    return response;
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response;
  },
};

// Trains API
export const trainsAPI = {
  getAllTrains: async () => {
    const response = await fetch(`${API_BASE_URL}/api/trains/`);
    return response;
  },

  getTrainById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/trains/${id}`);
    return response;
  },

  searchTrains: async (searchParams) => {
    const response = await fetch(`${API_BASE_URL}/api/trains/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });
    return response;
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return response;
  },

  getUserBookings: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response;
  },

  getBookingById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response;
  },

  cancelBooking: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response;
  },
};
