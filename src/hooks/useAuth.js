import { useGetMeQuery } from "@/store/services/authApi";

export function useAuth() {
  const { data, isLoading, isFetching, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return {
    user: data?.user || null,
    isLoading: isLoading || isFetching,
    refetch,
  };
}