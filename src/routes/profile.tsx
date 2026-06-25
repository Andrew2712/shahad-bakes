import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/firebase/db";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Save, Loader2, Package, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — Shahad Bakes" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        pincode: profile.pincode ?? "",
      });
    }
  }, [profile]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, form);
      await refreshProfile();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="py-14 md:py-20">
        <div className="container-x max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-5 mb-10">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="" className="h-20 w-20 rounded-full object-cover border-4 border-primary/30 shadow-lg" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-primary" />
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl text-secondary">{profile.name || "My Account"}</h1>
              <p className="text-sm text-foreground/60 mt-0.5">{profile.email}</p>
              {profile.role === "admin" && (
                <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-medium" style={{ fontFamily: "var(--font-button)" }}>
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar quick links */}
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary hover:shadow-md transition group"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary">My Orders</p>
                  <p className="text-xs text-foreground/50">View order history</p>
                </div>
              </Link>
              {profile.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary hover:shadow-md transition"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">Admin Panel</p>
                    <p className="text-xs text-foreground/50">Manage your bakery</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Edit form */}
            <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl text-secondary mb-5">Edit Profile</h2>

              <div className="space-y-4">
                <Field icon={<User className="h-4 w-4" />} label="Full Name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="input-base"
                  />
                </Field>

                <Field icon={<Mail className="h-4 w-4" />} label="Email">
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="input-base opacity-50 cursor-not-allowed"
                  />
                </Field>

                <Field icon={<Phone className="h-4 w-4" />} label="Phone Number">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="input-base"
                  />
                </Field>

                <Field icon={<MapPin className="h-4 w-4" />} label="Delivery Address">
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street address, apartment, etc."
                    rows={2}
                    className="input-base resize-none"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field icon={null} label="City">
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Bangalore"
                      className="input-base"
                    />
                  </Field>
                  <Field icon={null} label="Pincode">
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="560001"
                      maxLength={6}
                      className="input-base"
                    />
                  </Field>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"
                  style={{ fontFamily: "var(--font-button)" }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground/70 mb-1.5" style={{ fontFamily: "var(--font-button)" }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
