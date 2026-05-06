"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function ImportDropzone({ onFilesSelected }: ImportDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files).filter((f) => f.name.endsWith(".csv"));
      setFiles(dropped);
      onFilesSelected(dropped);
    },
    [onFilesSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
    onFilesSelected(selected);
  };

  return (
    <div className="space-y-4">
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-foreground">Drop CSV files here</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
        <input type="file" accept=".csv" multiple className="hidden" onChange={handleChange} />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm truncate flex-1">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => {
                  const next = files.filter((_, j) => j !== i);
                  setFiles(next);
                  onFilesSelected(next);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
