import { Outlet } from "react-router-dom";

/**
 * AuthLayout — thin wrapper that just renders the Outlet.
 * Login and Register already handle their own two-column split
 * (dark branding left + light form right) at min-h-screen.
 * This layout exists so the router can group auth routes cleanly.
 */
const AuthLayout = () => <Outlet />;

export default AuthLayout;