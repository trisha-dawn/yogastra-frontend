import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:1337/api",
});
