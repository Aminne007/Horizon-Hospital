import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type GuardState = "checking" | "allowed" | "redirect";

const roleHome = (role: string | null) => {
  if (role === "CLIENT") return "/app/client/dashboard";
  if (role === "DOCTOR") return "/app/doctor/dashboard";
  if (role === "ADMIN") return "/app/admin/dashboard";
  return "/result";
};

const GuardShell = ({
  allowedRole,
  children,
}: {
  allowedRole: "CLIENT" | "DOCTOR" | "ADMIN";
  children: ReactNode;
}) => {
  const [state, setState] = useState<GuardState>("checking");
  const [redirect, setRedirect] = useState("/result");

  useEffect(() => {
    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setState("redirect");
        setRedirect("/result");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile?.role) {
        setState("redirect");
        setRedirect("/result");
        return;
      }

      if (profile.role === allowedRole) {
        setState("allowed");
      } else {
        setState("redirect");
        setRedirect(roleHome(profile.role));
      }
    }

    check();
  }, [allowedRole]);

  if (state === "checking") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#E8F4F8]">
        <div className="rounded-3xl border border-[#d3e8f2] bg-white px-4 py-6 shadow-sm shadow-[#4A90A4]/10">
          <p className="text-sm font-semibold text-[#2f5f6a]">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (state === "redirect") {
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};

export const ClientGuard = ({ children }: { children: ReactNode }) => (
  <GuardShell allowedRole="CLIENT">{children}</GuardShell>
);

export const DoctorGuard = ({ children }: { children: ReactNode }) => (
  <GuardShell allowedRole="DOCTOR">{children}</GuardShell>
);

export const AdminGuard = ({ children }: { children: ReactNode }) => (
  <GuardShell allowedRole="ADMIN">{children}</GuardShell>
);
