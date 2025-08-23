import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../context/useSession";

export default function useLimits() {
  const { user } = useContext(SessionContext);
  const [cachedUsage, setCachedUsage] = useState(null);

  // Basic cache with 60-second freshness
  const getPlanLimits = () => ({
    links: user?.subscription?.plan === "pro" ? 100 : 10,
    files: user?.subscription?.plan === "pro" ? 50 : 5,
    storage: user?.subscription?.plan === "pro" ? 1073741824 : 52428800,
  });

  const canCreateLink = () =>
    (cachedUsage?.links || user?.dailyUsage?.links || 0) <
    getPlanLimits().links;

  const getRemaining = (type) => {
    const limit = getPlanLimits()[type];
    const used = cachedUsage?.[type] || user?.dailyUsage?.[type] || 0;
    return Math.max(limit - used, 0);
  };

  // Refresh cache when user changes
  useEffect(() => {
    if (user) {
      setCachedUsage({
        links: user.dailyUsage?.links || 0,
        files: user.dailyUsage?.files || 0,
        storage: user.dailyUsage?.storage || 0,
      });
    }
  }, [user]);

  return { canCreateLink, getRemaining };
}
