import http from './http';
import { getAuthData } from '../utils/storage'; // Auth bilgileri hala buradan alınacak

const CUSTOMERS_ENDPOINT = ''; // Controller'ınız zaten /api/customers'a map edilmiş

// --- Auth Bilgilerini Çekme Yardımcı Fonksiyonu ---
const getAuthHeaders = () => {
    const { username, password } = getAuthData();
    // Eğer kimlik bilgisi yoksa veya eksikse hata döndürmek isteyebiliriz
    if (!username || !password) {
        throw new Error("Giriş bilgileri eksik.");
    }
    return { Username: username, Password: password };
};

// --- 1. READ ALL (Listeleme) ---
// GET /api/customers/getAllCustomers
export const getCustomers = async () => {
    try {
        const headers = getAuthHeaders();

        const response = await http.get(`/customers/getAllCustomers`, {
            headers: headers // Başlıkları manuel olarak ekledik
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- 2. CREATE (Oluşturma) ---
// POST /api/customers/createCustomer (Body içinde username ve password bekliyor)
export const createCustomer = async (customer) => {
    try {
        const { username, password } = getAuthData();
        
        // Backend'in beklediği SecuredCustomerRequestDTO yapısını oluşturuyoruz
        const requestBody = {
            username: username,
            password: password,
            customer: customer
        };
        
        const response = await http.post(`/customers/createCustomer`, requestBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- 3. UPDATE (Güncelleme) ---
// PUT /api/customers/updateCustomer/{id} (Başlıkta username/password bekliyor)
export const updateCustomer = async (id, updatedCustomer) => {
    try {
        const headers = getAuthHeaders();
        
        const response = await http.put(`/customers/updateCustomer/${id}`, updatedCustomer, {
            headers: headers // Başlıkları manuel olarak ekledik
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- 4. DELETE (Silme) ---
// DELETE /api/customers/deleteCustomer/{id} (Başlıkta username/password bekliyor)
export const deleteCustomer = async (id) => {
    try {
        const headers = getAuthHeaders();
        
        const response = await http.delete(`/customers/deleteCustomer/${id}`, {
            headers: headers // Başlıkları manuel olarak ekledik
        });
        return response;
    } catch (error) {
        throw error;
    }
};