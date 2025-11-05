import axios from 'axios';

export async function loginService(credentials) {
    try {
        const response = await axios.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function registerService(userData) {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function resendVerificationService(email) {
    try {
        const response = await axios.post('/api/auth/resend-verification', { email });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function verifyEmailService(token) {
    try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export async function getProfileService() {
    try {
        const response = await axios.get('/api/auth/profile');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function logoutService() {
    try {
        const response = await axios.post('/api/auth/logout');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
