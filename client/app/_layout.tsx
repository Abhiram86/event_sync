import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUserStore from "@/store/User";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/SecureStore";
import { me } from "@/api/auth";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTokenHandler = async () => {
      const token = await getToken();
      if (token) {
        const res = await me(token);
        if (res.error) return console.log(res.error);
        setUser(res.data.me);
      }
      setLoading(false);
      console.log("token is ", token);
    };
    getTokenHandler();
  }, [setUser]);

  if (loading) return null;

  if (!user)
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />;
      </Stack>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
