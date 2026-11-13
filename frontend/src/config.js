const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        "VITE_API_URL is not set. Configure it in the Vercel project settings to point to the backend API."
    );
}

export const API = API_URL.replace(/\/+$/, "");
