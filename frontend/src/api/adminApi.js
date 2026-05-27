import API from "./axios.js";

export const addStock = (data) => API.post("/admin/stocks", data);

export const getAdminStocks = () => API.get("/market/stocks");

export const deleteStock = (id) => API.delete(`/admin/stocks/${id}`);
