// AuthInitializer.tsx
import useUserStore from "@/store/User";
import { useEffect, useState } from "react";
// import { getUser } from "@/api/auth";
// import getCookie from "@/utils/getCookie";
// import useUserStore from "@/store/userStore";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = getCookie("sessionToken");
      if (token) {
        const data = await getUser();
        if (data.user) setUser(data.user);
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return null; // or splash screen
  return <>{children}</>;
}
