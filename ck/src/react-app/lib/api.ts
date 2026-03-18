export const getToken = () => localStorage.getItem("spendsmartToken");

export const authFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
};
