/** Routes that actually need Auth.js session (navbar user state, dashboard). */
export function shouldLoadSession(pathname: string) {
  if (pathname === "/") return false;
  if (pathname.startsWith("/p/")) return false;
  return true;
}
