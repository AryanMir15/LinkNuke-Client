import { useContext } from "react";
import { SessionContext } from "../context/useSession";

export default function useLimits() {
  const { user } = useContext(SessionContext);

  const getPlanLimits = () => ({
    links: user?.subscription?.plan === "pro" ? 100 : 10, // Free:10, Pro:100
    files: user?.subscription?.plan === "pro" ? 50 : 5,
    storage: user?.subscription?.plan === "pro" ? 1073741824 : 52428800, // 1GB vs 50MB
  });

  const canCreateLink = () =>
    (user?.dailyUsage?.links || 0) < getPlanLimits().links;

  const getRemaining = (type) => {
    const limit = getPlanLimits()[type];
    const used = user?.dailyUsage?.[type] || 0;
    return Math.max(limit - used, 0);
  };

  return { canCreateLink, getRemaining };
}
