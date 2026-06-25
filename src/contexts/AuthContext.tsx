import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { onAuthChange } from "@/lib/supabase/auth";
import { getUserProfile, createUserProfile, type UserProfile } from "@/lib/supabase/db";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(u: User) {
    // Ensure profile row exists
    await createUserProfile(u.id, {
      uid: u.id,
      name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? "",
      email: u.email ?? "",
      photoURL: u.user_metadata?.avatar_url ?? "",
    });
    const p = await getUserProfile(u.id);
    setProfile(p);
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user);
  }

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        await fetchProfile(u);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === "admin",
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
