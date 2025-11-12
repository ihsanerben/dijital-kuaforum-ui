import http from "./http";
import { getAuthData } from "../utils/storage";

const CUSTOMERS_ENDPOINT = "/customers";

const getAuthHeaders = () => {
  const { username, password } = getAuthData();
  if (!username || !password) {
    throw new Error("Giriş bilgileri eksik.");
  }
  return { Username: username, Password: password };
};

export const getCustomers = async () => {
  try {
    const headers = getAuthHeaders();

    const response = await http.get(`${CUSTOMERS_ENDPOINT}/getAllCustomers`, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCustomer = async (customer) => {
  try {
    const { username, password } = getAuthData();

    const requestBody = {
      username: username,
      password: password,
      customer: customer,
    };

    const response = await http.post(`${CUSTOMERS_ENDPOINT}/createCustomer`, requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (id, updatedCustomer) => {
  try {
    const headers = getAuthHeaders();

    const response = await http.put(
      `/customers/updateCustomer/${id}`,
      updatedCustomer,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const headers = getAuthHeaders();

    const response = await http.delete(`${CUSTOMERS_ENDPOINT}/deleteCustomer/${id}`, {
      headers: headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
