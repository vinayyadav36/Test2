"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import { Search, X } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export function TransactionFilters() {
  const { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, sourceFilter, setSourceFilter } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search merchant, note..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-9" />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={sourceFilter} onValueChange={setSourceFilter}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Source" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="UPI">UPI</SelectItem>
          <SelectItem value="BANK_TRANSFER">Bank</SelectItem>
          <SelectItem value="CARD">Card</SelectItem>
          <SelectItem value="WALLET">Wallet</SelectItem>
          <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
        </SelectContent>
      </Select>

      {(searchQuery || categoryFilter !== "all" || sourceFilter !== "all") && (
        <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); setSourceFilter("all"); }}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
