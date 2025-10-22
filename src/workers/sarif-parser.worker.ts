// sarif-parser.worker.ts
import type { SarifLog, ParsedSarifData, SarifSummary } from '../types/sarif';

// Worker message types
export interface WorkerMessage {
  type: 'PARSE_SARIF' | 'PARSE_PROGRESS' | 'PARSE_COMPLETE' | 'PARSE_ERROR';
  payload?: unknown;
}

export interface ParseSarifMessage extends WorkerMessage {
  type: 'PARSE_SARIF';
  payload: {
    fileContent: string;
    fileName: string;
  };
}

export interface ParseProgressMessage extends WorkerMessage {
  type: 'PARSE_PROGRESS';
  payload: {
    progress: number;
    stage: string;
  };
}

export interface ParseCompleteMessage extends WorkerMessage {
  type: 'PARSE_COMPLETE';
  payload: ParsedSarifData;
}

export interface ParseErrorMessage extends WorkerMessage {
  type: 'PARSE_ERROR';
  payload: {
    error: string;
    details?: string;
  };
}

// Helper function to post progress updates
const postProgress = (progress: number, stage: string) => {
  self.postMessage({
    type: 'PARSE_PROGRESS',
    payload: { progress, stage }
  } as ParseProgressMessage);
};

// Helper function to validate SARIF structure
const validateSarifStructure = (data: unknown): data is SarifLog => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.version || typeof obj.version !== 'string') return false;
  if (!Array.isArray(obj.runs)) return false;
  
  // Basic validation of runs
  for (const run of obj.runs) {
    if (!run || typeof run !== 'object') return false;
    const runObj = run as Record<string, unknown>;
    if (!runObj.tool || typeof runObj.tool !== 'object') return false;
    const tool = runObj.tool as Record<string, unknown>;
    if (!tool.driver || typeof tool.driver !== 'object') return false;
    const driver = tool.driver as Record<string, unknown>;
    if (!driver.name) return false;
  }
  
  return true;
};

// Calculate summary statistics
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
  
  postProgress(30, 'Analyzing tools...');
  
  // Collect tools used
  sarifLog.runs.forEach(run => {
    if (run.tool.driver.name && !summary.toolsUsed.includes(run.tool.driver.name)) {
      summary.toolsUsed.push(run.tool.driver.name);
    }
  });
  
  postProgress(50, 'Analyzing results...');
  
  // Analyze results
  allResults.forEach((result, index) => {
    // Update progress for large datasets
    if (index % 1000 === 0) {
      const progress = 50 + Math.floor((index / allResults.length) * 40);
      postProgress(progress, `Processing result ${index + 1} of ${allResults.length}...`);
    }
    
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

// Main parsing function
const parseSarifFile = async (fileContent: string, fileName: string): Promise<ParsedSarifData> => {
  try {
    postProgress(10, 'Parsing JSON...');
    
    let sarifLog: SarifLog;
    
    try {
      sarifLog = JSON.parse(fileContent);
    } catch (jsonError) {
      throw new Error(`Invalid JSON format: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }
    
    postProgress(20, 'Validating SARIF structure...');
    
    if (!validateSarifStructure(sarifLog)) {
      throw new Error('Invalid SARIF format. Expected a valid SARIF 2.1.0 log file.');
    }
    
    // Check SARIF version compatibility
    if (!sarifLog.version.startsWith('2.1')) {
      console.warn(`SARIF version ${sarifLog.version} may not be fully compatible. Expected 2.1.x`);
    }
    
    postProgress(25, 'Calculating statistics...');
    
    const summary = calculateSummary(sarifLog);
    
    postProgress(90, 'Finalizing...');
    
    const parsedData: ParsedSarifData = {
      sarifLog,
      summary,
    };
    
    postProgress(100, 'Complete');
    
    return parsedData;
    
  } catch (error) {
    throw new Error(`Failed to parse SARIF file "${fileName}": ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Worker event listener
self.addEventListener('message', async (event: MessageEvent<ParseSarifMessage>) => {
  const { type, payload } = event.data;
  
  if (type === 'PARSE_SARIF') {
    try {
      const { fileContent, fileName } = payload;
      
      if (!fileContent) {
        throw new Error('No file content provided');
      }
      
      const parsedData = await parseSarifFile(fileContent, fileName);
      
      self.postMessage({
        type: 'PARSE_COMPLETE',
        payload: parsedData
      } as ParseCompleteMessage);
      
    } catch (error) {
      self.postMessage({
        type: 'PARSE_ERROR',
        payload: {
          error: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? error.stack : undefined
        }
      } as ParseErrorMessage);
    }
  }
});

// Export types for TypeScript (won't be included in the worker bundle)
// Types are already exported above with interface declarations
