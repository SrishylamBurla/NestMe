import { useGetMeQuery } from "@/store/services/authApi";

export const useAuth = () => {
  const { data, isLoading, isError } = useGetMeQuery();

  return {
    user: data?.user || null,
    isLoading,
    isError,
  };
};