import { useContext } from "react";
import { LinksContext } from "./LinksContext";

export function useLinksContext() {
  const ctx = useContext(LinksContext);
  if (!ctx)
    throw new Error("useLinksContext must be used within LinksProvider");
  return ctx;
}
