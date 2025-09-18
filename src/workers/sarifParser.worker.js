// SARIF Parser Web Worker
self.onmessage = function(e) {
  const { action, data } = e.data;
  
  try {
    switch (action) {
      case 'PARSE_SARIF':
        const sarifData = JSON.parse(data);
        const parsedData = parseSarif(sarifData);
        self.postMessage({ 
          type: 'PARSE_SUCCESS', 
          data: parsedData 
        });
        break;
      default:
        self.postMessage({ 
          type: 'ERROR', 
          error: 'Unknown action' 
        });
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: error.message 
    });
  }
};

function parseSarif(sarifData) {
  const stats = {
    totalIssues: 0,
    severityBreakdown: {
      error: 0,
      warning: 0,
      note: 0,
      info: 0
    },
    ruleBreakdown: {},
    fileBreakdown: {},
    fixableIssues: 0,
    tools: []
  };

  const issues = [];
  const rules = {};

  sarifData.runs?.forEach((run, runIndex) => {
    // Extract tool information
    const tool = {
      name: run.tool?.driver?.name || 'Unknown',
      version: run.tool?.driver?.version || 'Unknown',
      runIndex
    };
    stats.tools.push(tool);

    // Extract rules
    run.tool?.driver?.rules?.forEach(rule => {
      rules[rule.id] = {
        ...rule,
        runIndex,
        toolName: tool.name
      };
    });

    // Process results
    run.results?.forEach((result, resultIndex) => {
      const severity = result.level || 'warning';
      const ruleId = result.ruleId || 'unknown';
      
      stats.totalIssues++;
      stats.severityBreakdown[severity] = (stats.severityBreakdown[severity] || 0) + 1;
      stats.ruleBreakdown[ruleId] = (stats.ruleBreakdown[ruleId] || 0) + 1;
      
      if (result.fixes && result.fixes.length > 0) {
        stats.fixableIssues++;
      }

      // Extract file information
      result.locations?.forEach(location => {
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
