import { create } from 'zustand';
import type { Location, Fix, Suppression, ReportingDescriptor, PropertyBag, Run } from '../types/sarif';

export interface SarifIssue {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'note' | 'info';
  message: string;
  locations: Location[];
  relatedLocations: Location[];
  fixes: Fix[];
  suppressions: Suppression[];
  runIndex: number;
  rule?: ReportingDescriptor;
}

export interface SarifRule {
  id: string;
  shortDescription?: { text: string };
  fullDescription?: { text: string };
  help?: { text: string; markdown?: string };
  helpUri?: string;
  properties?: PropertyBag;
  runIndex: number;
  toolName: string;
}

export interface SarifStats {
  totalIssues: number;
  severityBreakdown: Record<string, number>;
  ruleBreakdown: Record<string, number>;
  fileBreakdown: Record<string, number>;
  fixableIssues: number;
  tools: Array<{ name: string; version: string; runIndex: number }>;
}

export interface ParsedSarifData {
  stats: SarifStats;
  issues: SarifIssue[];
  rules: Record<string, SarifRule>;
  runs: Run[];
}

interface SarifFilters {
  severity: string[];
  ruleId: string[];
  file: string[];
  searchTerm: string;
}

interface SarifStore {
  // State
  sarifData: ParsedSarifData | null;
  isLoading: boolean;
  error: string | null;
  selectedIssue: SarifIssue | null;
  filters: SarifFilters;

  // Actions
  setSarifData: (data: ParsedSarifData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedIssue: (issue: SarifIssue | null) => void;
  updateFilters: (filters: Partial<SarifFilters>) => void;
  clearData: () => void;
  
  // Computed
  getFilteredIssues: () => SarifIssue[];
}

export const useSarifStore = create<SarifStore>((set, get) => ({
  // Initial state
  sarifData: null,
  isLoading: false,
  error: null,
  selectedIssue: null,
  filters: {
    severity: [],
    ruleId: [],
    file: [],
    searchTerm: ''
  },

  // Actions
  setSarifData: (data) => set({ sarifData: data, error: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  
  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  clearData: () => set({
    sarifData: null,
    selectedIssue: null,
    error: null,
    filters: {
      severity: [],
      ruleId: [],
      file: [],
      searchTerm: ''
    }
  }),

  // Computed
  getFilteredIssues: () => {
    const { sarifData, filters } = get();
    if (!sarifData) return [];

    return sarifData.issues.filter(issue => {
      // Severity filter
      if (filters.severity.length > 0 && !filters.severity.includes(issue.severity)) {
        return false;
      }

      // Rule filter
      if (filters.ruleId.length > 0 && !filters.ruleId.includes(issue.ruleId)) {
        return false;
      }

      // File filter
      if (filters.file.length > 0) {
        const issueFiles = issue.locations
          .map(loc => loc.physicalLocation?.artifactLocation?.uri)
          .filter((uri): uri is string => typeof uri === 'string');
        
        if (!issueFiles.some(file => filters.file.includes(file))) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesMessage = issue.message.toLowerCase().includes(searchLower);
        const matchesRuleId = issue.ruleId.toLowerCase().includes(searchLower);
        const matchesRuleDescription = issue.rule?.shortDescription?.text
          ?.toLowerCase().includes(searchLower);
        
        if (!matchesMessage && !matchesRuleId && !matchesRuleDescription) {
          return false;
        }
      }

      return true;
    });
  }
}));
