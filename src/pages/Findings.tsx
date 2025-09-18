import React, { useState, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Clock, MapPin, Wrench } from 'lucide-react';
import { useSarifStore } from '../store/sarifStore';

export default function Findings() {
  const { sarifData, getFilteredIssues, updateFilters, filters } = useSarifStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);

  if (!sarifData) {
    return <Navigate to="/" replace />;
  }

  const filteredIssues = getFilteredIssues();

  const availableFilters = useMemo(() => {
    const severities = [...new Set(sarifData.issues.map(issue => issue.severity))];
    const rules = [...new Set(sarifData.issues.map(issue => issue.ruleId))];
    const files = [...new Set(
      sarifData.issues.flatMap(issue => 
        issue.locations.map(loc => loc.physicalLocation?.artifactLocation?.uri).filter(Boolean)
      )
    )];

    return { severities, rules, files };
  }, [sarifData]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      note: 'text-blue-600 bg-blue-50 border-blue-200',
      info: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const getSeverityIcon = () => {
    return AlertTriangle;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchTerm: localSearchTerm });
  };

  const toggleFilter = (type: 'severity' | 'ruleId' | 'file', value: string) => {
    const currentFilter = filters[type];
    const newFilter = currentFilter.includes(value)
      ? currentFilter.filter(item => item !== value)
      : [...currentFilter, value];
    
    updateFilters({ [type]: newFilter });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Findings Explorer</h1>
        <p className="mt-2 text-gray-600">
          {filteredIssues.length} of {sarifData.stats.totalIssues} issues
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search issues, rules, or descriptions..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Search
            </button>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Severity Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Filter className="inline h-4 w-4 mr-1" />
                Severity
              </label>
              <div className="space-y-2">
                {availableFilters.severities.map(severity => (
                  <label key={severity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.severity.includes(severity)}
                      onChange={() => toggleFilter('severity', severity)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rule Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rules</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableFilters.rules.slice(0, 10).map(rule => (
                  <label key={rule} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ruleId.includes(rule)}
                      onChange={() => toggleFilter('ruleId', rule)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 truncate">{rule}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* File Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Files</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableFilters.files.slice(0, 10).map(file => (
                  <label key={file} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.file.includes(file)}
                      onChange={() => toggleFilter('file', file)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 truncate">
                      {file.split('/').pop()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.severity.length > 0 || filters.ruleId.length > 0 || filters.file.length > 0 || filters.searchTerm) && (
            <button
              onClick={() => updateFilters({ severity: [], ruleId: [], file: [], searchTerm: '' })}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const Icon = getSeverityIcon();
          const location = issue.locations[0];
          const file = location?.physicalLocation?.artifactLocation?.uri;
          const region = location?.physicalLocation?.region;

          return (
            <div key={issue.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {issue.severity}
                    </span>
                    <span className="text-sm font-medium text-gray-600">{issue.ruleId}</span>
                    {issue.fixes && issue.fixes.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Wrench className="w-3 h-3 mr-1" />
                        Fixable
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {issue.message}
                  </h3>

                  {issue.rule?.shortDescription?.text && (
                    <p className="text-sm text-gray-600 mb-3">
                      {issue.rule.shortDescription.text}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {file && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {file.split('/').pop()}
                        {region && `:${region.startLine}`}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Run {issue.runIndex + 1}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/finding/${issue.id}`}
                  className="ml-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
