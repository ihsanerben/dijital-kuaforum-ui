import http from './http';

export const sendContactMessage = async (data) => {
    // POST /api/contact/send
    return http.post('/contact/send', data);
};