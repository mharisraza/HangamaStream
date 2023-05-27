import UserFormData from "@/types/UserFormData";
import { apiCaller } from "../config/config"

export const RegisterUser = (data: UserFormData) => {
    return apiCaller.post('/register', data).then((response) => response.data);
}

export const LoginUser = (data: UserFormData) => {
    return apiCaller.post('/login', data).then((response) => response.data);
}