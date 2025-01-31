import apiClient from "@/lib/apiClient";
import { safeAwait } from "@/lib/utils";
import { tokenState, userState } from "@/store/atom";
import { InternalAxiosRequestConfig } from "axios";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const useAuthEffects = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const setUser = useSetRecoilState(userState);

  const retryRef = useRef(false);

  useEffect(() => {
    const fetchme = async () => {
      try {
        const [err, response] = await safeAwait(
          apiClient.get("/api/auth/me", {
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })
        );
        if (err) {
          setUser(null)
          return;
        }
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchme();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        if (!config._retry && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const orginalRequest = error.config as CustomAxiosRequestConfig;

        if (
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized" &&
          !retryRef.current
        ) {
          retryRef.current = true;
          orginalRequest._retry = true;
          const [err, response] = await safeAwait(
            apiClient.get("api/auth/refreshToken")
          );
          if (err) {
            setToken(null);
            return;
          }
          console.log(response.data.accessToken);
          setToken(response.data.accessToken);

          orginalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          retryRef.current = false;
          return apiClient(orginalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);
};

export default useAuthEffects;
