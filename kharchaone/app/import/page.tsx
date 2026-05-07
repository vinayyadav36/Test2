"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ImportDropzone } from "@/components/transactions/import-dropzone";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { Upload, CheckCircle2 } from "lucide-react";
import type { NormalizedTransaction } from "@/types";

export default function ImportPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ mode: string; imported: number; transactions: NormalizedTransaction[]; errors: string[] } | null>(null);

  const submit = async (mode: "preview" | "confirm") => {
    if (!files.length) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("mode", mode);
    const res = await fetch("/api/import", { method: "POST", body: formData });
    const data = await res.json();
    setResult(data);
    setImporting(false);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" />Import CSV</CardTitle>
            <CardDescription>Required columns: date, amount, type (debit/credit), raw_description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImportDropzone onFilesSelected={setFiles} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button onClick={() => submit("preview")} disabled={!files.length || importing} variant="outline">{importing ? "Working..." : "Preview"}</Button>
              <Button onClick={() => submit("confirm")} disabled={!files.length || importing}>{importing ? "Working..." : "Confirm Import"}</Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {result.mode === "confirm" ? "Import Complete" : "Preview Ready"}
                <Badge variant="success">{result.imported} rows</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.errors.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm space-y-1">
                  {result.errors.map((e, i) => <p key={i}>{e}</p>)}
                </div>
              )}
              <TransactionsTable transactions={result.transactions} />
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
