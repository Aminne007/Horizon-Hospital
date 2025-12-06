import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResultGateway = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        setIsGuest(true);
        setChecking(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (error || !profile) {
        setIsGuest(true);
        setChecking(false);
        return;
      }

      const role = profile.role;

      if (role === "CLIENT") {
        navigate("/app/client/results", { replace: true });
      } else if (role === "DOCTOR") {
        navigate("/app/doctor/patients", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/app/admin/stats", { replace: true });
      } else {
        navigate("/result", { replace: true });
      }
    }

    checkUserRole();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking your role...</p>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-3">Access your results</h1>
          <p className="mb-4 text-slate-600">Login or create an account to view your results.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-5 py-2 bg-sky-600 text-white rounded-xl">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 border border-sky-600 text-sky-600 rounded-xl">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultGateway;
