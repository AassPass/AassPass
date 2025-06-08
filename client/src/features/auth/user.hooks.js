// features/auth/auth.hooks.ts
import { BACKEND_USER_URL } from '@/app/Utils/backendUrl';
import { useQuery } from '@tanstack/react-query';
import axios from "axios";

export function useUserProfile() {
    return useQuery(['user'], async () => {
        const res = await axios.get(`${BACKEND_USER_URL}`)
        .then(res => {
            return res.data || {};
        })
        .catch(err => {
            console.error("Error fetching user profile:", err);
            return {};
        });
    });
}
