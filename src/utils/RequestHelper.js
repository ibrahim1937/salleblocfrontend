import axios from "axios";


// axios.defaults.withCredentials = true;

const headersJson = {
    'Content-Type': 'application/json'
}

const headersForm = {
    'Content-Type': 'multipart/form-data'
}


export const postRequest = async (url , props = {}) => {
    return await axios.post(url, { ...props }, {headersJson});
}
export const getRequest = async (url , props = {}) => {
    return await axios.get(url, { ...props }, {headersJson});
}
export const putRequest = async (url , props = {}) => {
    return await axios.put(url, props, {headersJson});
}
export const deleteRequest = async (url , props = {}) => {
    return await axios.delete(url, { ...props }, {headersJson});
}
