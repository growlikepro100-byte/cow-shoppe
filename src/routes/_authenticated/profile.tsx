import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, phone, whatsapp")
        .eq("id", uid)
        .maybeSingle();
      if (p) {
        setFullName(p.full_name ?? "");
        setPhone(p.phone ?? "");
        setWhatsapp(p.whatsapp ?? "");
      }
    });
  }, []);

  const save = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, whatsapp })
      .eq("id", userId);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("প্রোফাইল আপডেট হয়েছে");
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">প্রোফাইল</h1>
      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div>
          <Label>পূর্ণ নাম</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label>মোবাইল</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-primary">
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
}
