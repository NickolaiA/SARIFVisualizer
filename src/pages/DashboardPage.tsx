import React from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  FileText,
  Settings,
  Shield,
  Clock
} from 'lucide-react';
import { useSummaryStats, useRulesList, useFilesList } from '../stores/sarifStore';
import type { Level } from '../types/sarif';

const DashboardPage: React.FC = () => {
  const summary = useSummaryStats();
  const rules = useRulesList();
  const files = useFilesList();

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No SARIF data available</div>
      </div>
    );
  }

  // Prepare data for charts
  const severityData = [
    { name: 'Error', value: summary.resultsByLevel.error, color: '#ef4444' },
    { name: 'Warning', value: summary.resultsByLevel.warning, color: '#f59e0b' },
    { name: 'Info', value: summary.resultsByLevel.info, color: '#3b82f6' },
    { name: 'Note', value: summary.resultsByLevel.note, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const topRules = rules
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(rule => ({
      name: rule.name.length > 20 ? `${rule.name.substring(0, 20)}...` : rule.name,
      fullName: rule.name,
      count: rule.count,
      id: rule.id
    }));

  const topFiles = files
    .slice(0, 10)
    .map(file => ({
      name: file.path.split('/').pop() || file.path,
      fullPath: file.path,
      count: file.count
    }));

  const getSeverityIcon = (level: Level) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'note': return <FileText className="h-5 w-5 text-gray-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const totalFindings = summary.totalResults;
  const criticalIssues = summary.resultsByLevel.error;
  const fixableIssues = summary.hasFixAvailable;
  const suppressedIssues = summary.suppressedResults;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Analysis Dashboard</h1>
        <p className="text-gray-600">
          Overview of findings from {summary.toolsUsed.join(', ')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Findings</p>
              <p className="text-3xl font-bold text-gray-900">{totalFindings.toLocaleString()}</p>
            </div>
            <Shield className="h-12 w-12 text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-3xl font-bold text-red-600">{criticalIssues.toLocaleString()}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fixable Issues</p>
              <p className="text-3xl font-bold text-green-600">{fixableIssues.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suppressed</p>
              <p className="text-3xl font-bold text-gray-600">{suppressedIssues.toLocaleString()}</p>
            </div>
            <Clock className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Findings by Severity</h3>
          {severityData.length > 0 ? (
            <div className="flex items-center space-x-8">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No findings to display</div>
          )}
        </div>

        {/* Severity Levels */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h3>
          <div className="space-y-4">
            {(['error', 'warning', 'info', 'note'] as Level[]).map((level) => {
              const count = summary.resultsByLevel[level];
              const percentage = totalFindings > 0 ? (count / totalFindings) * 100 : 0;
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(level)}
                    <span className="text-sm font-medium text-gray-900 capitalize">{level}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          level === 'error' ? 'bg-red-500' :
                          level === 'warning' ? 'bg-yellow-500' :
                          level === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Rules */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Security Rules</h3>
          {topRules.length > 0 ? (
            <div className="space-y-3">
              {topRules.map((rule, index) => (
                <div key={rule.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-4">#{index + 1}</span>
                    <span className="text-sm text-gray-900" title={rule.fullName}>
                      {rule.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{rule.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No rules found</div>
          )}
        </div>

        {/* Top Files */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Affected Files</h3>
          {topFiles.length > 0 ? (
            <div className="space-y-3">
              {topFiles.map((file, index) => (
                <div key={file.fullPath} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-4">#{index + 1}</span>
                    <span className="text-sm text-gray-900" title={file.fullPath}>
                      {file.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{file.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No files found</div>
          )}
        </div>
      </div>

      {/* Tools Information */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Tools</h3>
        <div className="flex items-center space-x-6">
          <Settings className="h-8 w-8 text-primary-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {summary.toolsUsed.join(', ')}
            </p>
            <p className="text-sm text-gray-600">
              {summary.totalRuns} analysis run{summary.totalRuns !== 1 ? 's' : ''} processed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
