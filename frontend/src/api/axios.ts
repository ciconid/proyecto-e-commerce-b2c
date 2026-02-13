import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue : Array<any> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor para agregar el token a cada request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {

            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                return Promise.reject(error);
            }
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    throw new Error("No hay refresh token");
                }

                const response = await axios.post(
                    `${axiosInstance.defaults.baseURL}/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token } = response.data;
                localStorage.setItem("access_token", access_token);

                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                processQueue(null, access_token);

                return axiosInstance(originalRequest);

            } catch (error) {
                processQueue(error as Error, null);

                const hadSession = !!localStorage.getItem("refresh_token");

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                if (hadSession){
                    window.location.href = "/login";
                }
                
                return Promise.reject(error);

            } finally {
                isRefreshing = false;
            }


        }
        
        return Promise.reject(error);
    }
);


export default axiosInstance;