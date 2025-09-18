import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  SarifLog, 
  ParsedSarifData, 
  SarifSummary, 
  EnrichedResult,
  Level 
} from '../types/sarif';

// Filter and UI state interfaces
export interface FilterState {
  severity: Level[];
  ruleIds: string[];
  filePattern: string;
  searchTerm: string;
  showSuppressed: boolean;
  showFixed: boolean;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  selectedResultId: string | null;
  uploadProgress: number;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

// Main store interface
interface SarifStore {
  // Data state
  sarifData: ParsedSarifData | null;
  filteredResults: EnrichedResult[];
  
  // Filter state
  filters: FilterState;
  
  // UI state
  ui: UIState;
  
  // Actions
  setSarifData: (data: ParsedSarifData) => void;
  clearSarifData: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setUIState: (state: Partial<UIState>) => void;
  setSelectedResult: (id: string | null) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  
  // Computed/derived data
  getFilteredResults: () => EnrichedResult[];
  getSummaryStats: () => SarifSummary | null;
  getResultById: (id: string) => EnrichedResult | null;
  getRulesList: () => Array<{ id: string; name: string; count: number; helpUri?: string }>;
  getFilesList: () => Array<{ path: string; count: number }>;
}

// Default states
const defaultFilters: FilterState = {
  severity: [],
  ruleIds: [],
  filePattern: '',
  searchTerm: '',
  showSuppressed: false,
  showFixed: true,
};

const defaultUIState: UIState = {
  isLoading: false,
  error: null,
  selectedResultId: null,
  uploadProgress: 0,
  sidebarOpen: true,
  theme: 'light',
};

// Helper functions
const filterResults = (results: EnrichedResult[], filters: FilterState): EnrichedResult[] => {
  return results.filter((result) => {
    // Filter by severity
    if (filters.severity.length > 0 && result.level) {
      if (!filters.severity.includes(result.level)) return false;
    }
    
    // Filter by rule IDs
    if (filters.ruleIds.length > 0 && result.ruleId) {
      if (!filters.ruleIds.includes(result.ruleId)) return false;
    }
    
    // Filter by file pattern
    if (filters.filePattern) {
      const hasMatchingFile = result.locations?.some(loc => 
        loc.physicalLocation?.artifactLocation?.uri?.includes(filters.filePattern)
      );
      if (!hasMatchingFile) return false;
    }
    
    // Filter by search term (search in message text and rule ID)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const messageMatch = result.message.text?.toLowerCase().includes(searchLower) ||
                          result.message.markdown?.toLowerCase().includes(searchLower);
      const ruleMatch = result.ruleId?.toLowerCase().includes(searchLower);
      if (!messageMatch && !ruleMatch) return false;
    }
    
    // Filter suppressed results
    if (!filters.showSuppressed && result.suppressions && result.suppressions.length > 0) {
      return false;
    }
    
    // Filter fixed results
    if (!filters.showFixed && result.fixes && result.fixes.length > 0) {
      return false;
    }
    
    return true;
  });
};

const calculateSummary = (sarifLog: SarifLog): SarifSummary => {
  const allResults = sarifLog.runs.flatMap(run => run.results || []);
  
  const summary: SarifSummary = {
    totalRuns: sarifLog.runs.length,
    totalResults: allResults.length,
    resultsByLevel: {
      none: 0,
      note: 0,
      info: 0,
      warning: 0,
      error: 0,
    },
    resultsByRule: {},
    resultsByFile: {},
    toolsUsed: [],
    hasFixAvailable: 0,
    suppressedResults: 0,
  };
  
  // Collect tools used
  sarifLog.runs.forEach(run => {
    if (run.tool.driver.name && !summary.toolsUsed.includes(run.tool.driver.name)) {
      summary.toolsUsed.push(run.tool.driver.name);
    }
  });
  
  // Analyze results
  allResults.forEach(result => {
    // Count by level
    const level = result.level || 'info';
    summary.resultsByLevel[level]++;
    
    // Count by rule
    if (result.ruleId) {
      summary.resultsByRule[result.ruleId] = (summary.resultsByRule[result.ruleId] || 0) + 1;
    }
    
    // Count by file
    result.locations?.forEach(location => {
      const uri = location.physicalLocation?.artifactLocation?.uri;
      if (uri) {
        summary.resultsByFile[uri] = (summary.resultsByFile[uri] || 0) + 1;
      }
    });
    
    // Count fixes and suppressions
    if (result.fixes && result.fixes.length > 0) {
      summary.hasFixAvailable++;
    }
    
    if (result.suppressions && result.suppressions.length > 0) {
      summary.suppressedResults++;
    }
  });
  
  return summary;
};

// Create the store
export const useSarifStore = create<SarifStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      sarifData: null,
      filteredResults: [],
      filters: defaultFilters,
      ui: defaultUIState,
      
      // Actions
      setSarifData: (data: ParsedSarifData) => {
        const allResults = data.sarifLog.runs.flatMap(run => run.results || []) as EnrichedResult[];
        set(
          {
            sarifData: data,
            filteredResults: filterResults(allResults, get().filters),
            ui: { ...get().ui, error: null, isLoading: false },
          },
          false,
          'setSarifData'
        );
      },
      
      clearSarifData: () => {
        set(
          {
            sarifData: null,
            filteredResults: [],
            filters: defaultFilters,
            ui: { ...get().ui, selectedResultId: null, error: null },
          },
          false,
          'clearSarifData'
        );
      },
      
      setFilters: (newFilters: Partial<FilterState>) => {
        const updatedFilters = { ...get().filters, ...newFilters };
        const { sarifData } = get();
        
        if (sarifData) {
          const allResults = sarifData.sarifLog.runs.flatMap(run => run.results || []) as EnrichedResult[];
          const filtered = filterResults(allResults, updatedFilters);
          
          set(
            {
              filters: updatedFilters,
              filteredResults: filtered,
            },
            false,
            'setFilters'
          );
        } else {
          set({ filters: updatedFilters }, false, 'setFilters');
        }
      },
      
      resetFilters: () => {
        const { sarifData } = get();
        
        if (sarifData) {
          const allResults = sarifData.sarifLog.runs.flatMap(run => run.results || []) as EnrichedResult[];
          const filtered = filterResults(allResults, defaultFilters);
          
          set(
            {
              filters: defaultFilters,
              filteredResults: filtered,
            },
            false,
            'resetFilters'
          );
        } else {
          set({ filters: defaultFilters }, false, 'resetFilters');
        }
      },
      
      setUIState: (newState: Partial<UIState>) => {
        set(
          { ui: { ...get().ui, ...newState } },
          false,
          'setUIState'
        );
      },
      
      setSelectedResult: (id: string | null) => {
        set(
          { ui: { ...get().ui, selectedResultId: id } },
          false,
          'setSelectedResult'
        );
      },
      
      toggleSidebar: () => {
        set(
          { ui: { ...get().ui, sidebarOpen: !get().ui.sidebarOpen } },
          false,
          'toggleSidebar'
        );
      },
      
      toggleTheme: () => {
        const newTheme = get().ui.theme === 'light' ? 'dark' : 'light';
        set(
          { ui: { ...get().ui, theme: newTheme } },
          false,
          'toggleTheme'
        );
      },
      
      // Computed getters
      getFilteredResults: () => {
        return get().filteredResults;
      },
      
      getSummaryStats: () => {
        const { sarifData } = get();
        return sarifData ? calculateSummary(sarifData.sarifLog) : null;
      },
      
      getResultById: (id: string) => {
        const { filteredResults } = get();
        return filteredResults.find((_, index) => `result-${index}` === id) || null;
      },
      
      getRulesList: () => {
        const { sarifData } = get();
        if (!sarifData) return [];
        
        const rulesMap = new Map<string, { name: string; count: number; helpUri?: string }>();
        
        sarifData.sarifLog.runs.forEach(run => {
          // Collect rule definitions
          run.tool.driver.rules?.forEach(rule => {
            if (!rulesMap.has(rule.id)) {
              rulesMap.set(rule.id, {
                name: rule.name || rule.id,
                count: 0,
                helpUri: rule.helpUri,
              });
            }
          });
          
          // Count rule usage in results
          run.results?.forEach(result => {
            if (result.ruleId) {
              const ruleInfo = rulesMap.get(result.ruleId);
              if (ruleInfo) {
                ruleInfo.count++;
              } else {
                rulesMap.set(result.ruleId, {
                  name: result.ruleId,
                  count: 1,
                });
              }
            }
          });
        });
        
        return Array.from(rulesMap.entries()).map(([id, info]) => ({
          id,
          ...info,
        }));
      },
      
      getFilesList: () => {
        const { filteredResults } = get();
        const filesMap = new Map<string, number>();
        
        filteredResults.forEach(result => {
          result.locations?.forEach(location => {
            const uri = location.physicalLocation?.artifactLocation?.uri;
            if (uri) {
              filesMap.set(uri, (filesMap.get(uri) || 0) + 1);
            }
          });
        });
        
        return Array.from(filesMap.entries())
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count);
      },
    }),
    { name: 'sarif-store' }
  )
);

// Selectors for better performance
export const useFilteredResults = () => useSarifStore(state => state.getFilteredResults());
export const useSummaryStats = () => useSarifStore(state => state.getSummaryStats());
export const useRulesList = () => useSarifStore(state => state.getRulesList());
export const useFilesList = () => useSarifStore(state => state.getFilesList());
export const useSelectedResult = () => useSarifStore(state => {
  const selectedId = state.ui.selectedResultId;
  return selectedId ? state.getResultById(selectedId) : null;
});
