import { useCallback } from 'react';
import { useSarifStore } from '../store/sarifStore';

export const useSarifParser = () => {
  const { setSarifData, setLoading, setError } = useSarifStore();

  const parseFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      
      // For smaller files, parse directly
      if (text.length < 1024 * 1024) { // 1MB threshold
        const sarifData = JSON.parse(text);
        const parsedData = parseSarif(sarifData);
        setSarifData(parsedData);
        setLoading(false);
        return;
      }

      // For larger files, use Web Worker
      const worker = new Worker(
        new URL('../workers/sarifParser.worker.js', import.meta.url),
        { type: 'module' }
      );

      worker.postMessage({ action: 'PARSE_SARIF', data: text });

      worker.onmessage = (e) => {
        const { type, data, error } = e.data;
        
        if (type === 'PARSE_SUCCESS') {
          setSarifData(data);
          setLoading(false);
        } else if (type === 'ERROR') {
          setError(error);
          setLoading(false);
        }
        
        worker.terminate();
      };

      worker.onerror = () => {
        setError('Failed to parse SARIF file');
        setLoading(false);
        worker.terminate();
      };

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse SARIF file');
      setLoading(false);
    }
  }, [setSarifData, setLoading, setError]);

  return { parseFile };
};

// Inline parser for smaller files (same logic as worker)
function parseSarif(sarifData: any) {
  const stats = {
    totalIssues: 0,
    severityBreakdown: {
      error: 0,
      warning: 0,
      note: 0,
      info: 0
    },
    ruleBreakdown: {} as Record<string, number>,
    fileBreakdown: {} as Record<string, number>,
    fixableIssues: 0,
    tools: [] as Array<{ name: string; version: string; runIndex: number }>
  };

  const issues: any[] = [];
  const rules: Record<string, any> = {};

  sarifData.runs?.forEach((run: any, runIndex: number) => {
    // Extract tool information
    const tool = {
      name: run.tool?.driver?.name || 'Unknown',
      version: run.tool?.driver?.version || 'Unknown',
      runIndex
    };
    stats.tools.push(tool);

    // Extract rules
    run.tool?.driver?.rules?.forEach((rule: any) => {
      rules[rule.id] = {
        ...rule,
        runIndex,
        toolName: tool.name
      };
    });

    // Process results
    run.results?.forEach((result: any, resultIndex: number) => {
      const severity = result.level || 'warning';
      const ruleId = result.ruleId || 'unknown';
      
      stats.totalIssues++;
      
      // Type-safe severity breakdown update
      if (severity in stats.severityBreakdown) {
        (stats.severityBreakdown as any)[severity]++;
      } else {
        (stats.severityBreakdown as any)[severity] = 1;
      }
      
      stats.ruleBreakdown[ruleId] = (stats.ruleBreakdown[ruleId] || 0) + 1;
      
      if (result.fixes && result.fixes.length > 0) {
        stats.fixableIssues++;
      }

      // Extract file information
      result.locations?.forEach((location: any) => {
        const uri = location.physicalLocation?.artifactLocation?.uri;
        if (uri) {
          stats.fileBreakdown[uri] = (stats.fileBreakdown[uri] || 0) + 1;
        }
      });

      // Create issue object
      const issue = {
        id: `${runIndex}-${resultIndex}`,
        ruleId,
        severity,
        message: result.message?.text || '',
        locations: result.locations || [],
        relatedLocations: result.relatedLocations || [],
        fixes: result.fixes || [],
        suppressions: result.suppressions || [],
        runIndex,
        rule: rules[ruleId]
      };

      issues.push(issue);
    });
  });

  return {
    stats,
    issues,
    rules,
    runs: sarifData.runs || []
  };
}
