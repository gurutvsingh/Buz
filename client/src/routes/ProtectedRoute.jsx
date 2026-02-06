import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f7fb]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-bold text-slate-600">
            Loading BUZ workspace
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
