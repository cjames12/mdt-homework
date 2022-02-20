import axios from 'axios'

const baseUrl = 'https://green-thumb-64168.uc.r.appspot.com';

export const signupRequest = async (requestBody) => {

  try {
    const response = await axios.post(`${baseUrl}/register`, requestBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }

}

export const loginRequest = async (requestBody) => {

  try {
    const response = await axios.post(`${baseUrl}/login`, requestBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }

}

export const getBalance = async (token) => {

  try {
    const response = await axios.get(`${baseUrl}/balance`, {
      headers: {
        'Authorization' : token
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data.error;
  }

}

export const getTransactions = async (token) => {

  try {
    const response = await axios.get(`${baseUrl}/transactions`, {
      headers: {
        'Authorization' : token
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data.error;
  }

}

export const getPayees = async (token) => {

  try {
    const response = await axios.get(`${baseUrl}/payees`, {
      headers: {
        'Authorization' : token
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data.error;
  }

}

export const transferAmount = async (token, requestBody) => {
  try {
    const response = await axios.post(`${baseUrl}/transfer`, requestBody,{
      headers: {
        'Authorization' : token
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}