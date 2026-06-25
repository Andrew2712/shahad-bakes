import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/config";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract code from URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Code exchange error:", error.message);
            navigate({ to: "/login" });
            return;
          }
          if (data.session) {
            navigate({ to: "/" });
            return;
          }
        }

        // Fallback: check if session already exists (hash-based flow)
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate({ to: "/" });
        } else {
          navigate({ to: "/login" });
        }
      } catch (err) {
        console.error("Callback error:", err);
        navigate({ to: "/login" });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <p className="text-sm text-foreground/60" style={{ fontFamily: "var(--font-button)" }}>
          Signing you in…
        </p>
      </div>
    </div>
  );
}