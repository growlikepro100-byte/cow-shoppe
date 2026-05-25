import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard, type ListingCardData } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "গরু কিনবো — বিশ্বস্ত কোরবানি পশুর হাট" },
      {
        name: "description",
        content:
          "বাংলাদেশের প্রিমিয়াম অনলাইন গরুর হাট। বিশ্বস্ত খামারি ও বিক্রেতাদের কাছ থেকে কোরবানির গরু কিনুন।",
      },
    ],
  }),
  component: Index,
});

type ListingRow = {
  id: string;
  title: string;
  price: number;
  age_months: number | null;
  weight_kg: number | null;
  location: string | null;
  featured: boolean;
  listing_media: { url: string; sort_order: number }[] | null;
};

function mapListing(l: ListingRow): ListingCardData {
  const cover = l.listing_media?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;
  return {
    id: l.id,
    title: l.title,
    price: Number(l.price),
    age_months: l.age_months,
    weight_kg: l.weight_kg,
    location: l.location,
    featured: l.featured,
    cover_url: cover,
  };
}

function Index() {
  const { data: listings = [] } = useQuery({
    queryKey: ["listings", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price, age_months, weight_kg, location, featured, listing_media(url, sort_order)")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data as ListingRow[]).map(mapListing);
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-primary-glow blur-3xl" />
        </div>
        <div className="container relative mx-auto grid gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold">
              🌙 কোরবানি ঈদ ২০২৬
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
              বিশ্বস্ত খামার থেকে <br />
              <span className="text-gold">কোরবানির গরু</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              দালাল ছাড়া সরাসরি খামারি ও বিক্রেতার কাছ থেকে গরু কিনুন। Google যাচাইকৃত ভেরিফায়েড সেলার, সরাসরি কল ও WhatsApp যোগাযোগ।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-95">
                  <Search className="mr-2 h-5 w-5" /> গরু খুঁজুন
                </Button>
              </Link>
              <Link to="/listings/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  বিক্রি করুন <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden items-center justify-center md:flex"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-gold opacity-20 blur-2xl" />
            <div className="relative aspect-square w-full max-w-md rounded-3xl border border-gold/30 bg-card/10 p-8 backdrop-blur">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="text-[10rem] leading-none">🐄</div>
                <p className="mt-4 font-display text-2xl text-primary-foreground">
                  হালাল · স্বাস্থ্যবান · যাচাইকৃত
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Google যাচাইকৃত", desc: "প্রতিটি বিক্রেতা ভেরিফায়েড" },
            { icon: Zap, title: "দ্রুত যোগাযোগ", desc: "এক ক্লিকে কল বা WhatsApp" },
            { icon: Users, title: "দালাল মুক্ত", desc: "সরাসরি খামারির সাথে কেনাকাটা" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">নতুন গরু সমূহ</h2>
            <p className="mt-1 text-muted-foreground">সর্বশেষ যুক্ত হওয়া বিজ্ঞাপন</p>
          </div>
          <Link to="/browse">
            <Button variant="ghost" className="text-primary">
              সব দেখুন <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="text-5xl">🐄</div>
            <p className="mt-3 text-lg font-semibold">এখনো কোনো বিজ্ঞাপন নেই</p>
            <p className="mt-1 text-sm text-muted-foreground">
              প্রথম বিক্রেতা হোন — আপনার গরু এখানে দেখান!
            </p>
            <Link to="/listings/new">
              <Button className="mt-5 bg-gradient-gold text-gold-foreground shadow-gold">
                বিজ্ঞাপন দিন
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((l) => (
              <ListingCard key={l.id} data={l} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-2xl font-bold md:text-3xl">
                আপনার গরু বিক্রি করুন আজই
              </h3>
              <p className="mt-2 text-primary-foreground/80">
                Google দিয়ে সাইন ইন করে ১ মিনিটে বিজ্ঞাপন দিন। কোনো ফি নেই।
              </p>
            </div>
            <Link to="/login">
              <Button size="lg" className="bg-gradient-gold text-gold-foreground shadow-gold">
                শুরু করুন
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
