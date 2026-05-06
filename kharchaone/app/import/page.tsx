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
  const [result, setResult] = useState<{ imported: number; transactions: NormalizedTransaction[]; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!files.length) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    const res = await fetch("/api/import", { method: "POST", body: formData });
    const data = await res.json();
    setResult(data);
    setImporting(false);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV with columns: date, description, amount (debit/credit), balance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImportDropzone onFilesSelected={setFiles} />
            <Button onClick={handleImport} disabled={!files.length || importing} className="w-full">
              {importing ? "Importing…" : "Import Transactions"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Import Complete
                <Badge variant="success">{result.imported} imported</Badge>
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
