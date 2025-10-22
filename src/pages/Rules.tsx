import { Navigate, Link } from 'react-router-dom';
import { ExternalLink, Book, AlertTriangle, Info } from 'lucide-react';
import { useSarifStore } from '../store/sarifStore';

export default function Rules() {
  const { sarifData } = useSarifStore();

  if (!sarifData) {
    return <Navigate to="/" replace />;
  }

  const { rules, stats } = sarifData;

  const getSeverityColor = (severity: string) => {
    const colors = {
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      note: 'text-blue-600 bg-blue-50 border-blue-200',
      info: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rules Directory</h1>
        <p className="mt-2 text-gray-600">
          Browse all {Object.keys(rules).length} rules from the analysis
        </p>
      </div>

      <div className="grid gap-6">
        {Object.entries(rules).map(([ruleId, rule]) => {
          const issueCount = stats.ruleBreakdown[ruleId] || 0;
          const severity = typeof rule.properties?.severity === 'string' ? rule.properties.severity : 'info';
          const Icon = getSeverityIcon(severity);
          
          return (
            <div key={ruleId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{ruleId}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {severity}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {issueCount} issues
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {rule.shortDescription?.text || 'No short description available'}
                  </p>
                  
                  {rule.fullDescription?.text && (
                    <p className="text-sm text-gray-600 mb-3">
                      {rule.fullDescription.text}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Book className="w-4 h-4 mr-1" />
                      Tool: {rule.toolName}
                    </span>
                    {typeof rule.properties?.category === 'string' && (
                      <span>Category: {rule.properties.category}</span>
                    )}
                    {typeof rule.properties?.cwe === 'string' && (
                      <span>CWE: {rule.properties.cwe}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {rule.helpUri && (
                    <a
                      href={rule.helpUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Documentation
                    </a>
                  )}
                  
                  <Link
                    to={`/findings?rule=${encodeURIComponent(ruleId)}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Issues ({issueCount})
                  </Link>
                </div>
              </div>

              {rule.help?.markdown && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Help</h4>
                  <div 
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: rule.help.markdown.replace(/\n/g, '<br>') 
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(rules).length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No rules were found in the SARIF file.
          </p>
        </div>
      )}
    </div>
  );
}
