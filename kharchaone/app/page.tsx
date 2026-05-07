"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const seedDemo = async () => {
    setLoading(true);
    await fetch("/api/demo/seed", { method: "POST" });
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">KharchaOne</CardTitle>
          <CardDescription>
            Your plain-language money dashboard for UPI, card, wallet, cashback, and subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button onClick={seedDemo} disabled={loading} className="flex-1">
            {loading ? "Seeding demo..." : "View Demo"}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/import">Import my data</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
