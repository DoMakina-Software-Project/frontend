import axios from "axios";
import { API_URL } from "../config/vars";

const instance = axios.create({
	baseURL: `${API_URL}/v1`,
	withCredentials: true,
});

export default instance;
