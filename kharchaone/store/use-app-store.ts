import { create } from "zustand";
import { NormalizedTransaction } from "@/types";

interface AppState {
  transactions: NormalizedTransaction[];
  isDemoMode: boolean;
  searchQuery: string;
  categoryFilter: string;
  sourceFilter: string;
  setTransactions: (txns: NormalizedTransaction[]) => void;
  setDemoMode: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (c: string) => void;
  setSourceFilter: (s: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  transactions: [],
  isDemoMode: true,
  searchQuery: "",
  categoryFilter: "all",
  sourceFilter: "all",
  setTransactions: (transactions) => set({ transactions }),
  setDemoMode: (isDemoMode) => set({ isDemoMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),
}));
