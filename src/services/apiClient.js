import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Cambia la URL según tu entorno
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
