import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../context/useSession";

export default function useLimits() {
  const { user } = useContext(SessionContext);
  const [cachedUsage, setCachedUsage] = useState(null);

  // Dynamic plan limits from backend or defaults
  const getPlanLimits = () => {
    const plan = user?.subscription?.plan || "free";
    
    // Default fallback limits if not provided by backend
    const defaultLimits = {
      free: { links: 5, files: 1, storage: 52428800 }, // 50MB
      starter: { links: 10, files: 5, storage: 1073741824 }, // 1GB
      pro: { links: 500, files: 10, storage: 10737418240 }, // 10GB
      lifetime: { links: 9999, files: 9999, storage: 107374182400 }, // 100GB
    };
    
    const baseLimits = defaultLimits[plan] || defaultLimits.free;
    
    return {
      links: user?.subscription?.usageLimits?.links || baseLimits.links,
      files: baseLimits.files,
      storage: baseLimits.storage,
    };
  };

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
