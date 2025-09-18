import React from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, FileText, Wrench, Shield } from 'lucide-react';
import { useSarifStore } from '../store/sarifStore';

const SEVERITY_COLORS = {
  error: '#ef4444',
  warning: '#f59e0b',
  note: '#3b82f6',
  info: '#6b7280'
};

export default function Dashboard() {
  const { sarifData } = useSarifStore();

  if (!sarifData) {
    return <Navigate to="/" replace />;
  }

  const { stats } = sarifData;

  // Prepare chart data
  const severityData = Object.entries(stats.severityBreakdown)
    .filter(([_, count]) => count > 0)
    .map(([severity, count]) => ({
      name: severity,
      value: count,
      color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#6b7280'
    }));

  const topRules = Object.entries(stats.ruleBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([rule, count]) => ({ rule, count }));

  const topFiles = Object.entries(stats.fileBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([file, count]) => ({ 
      file: file.split('/').pop() || file, 
      fullPath: file,
      count 
    }));

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start">
        <div className={`p-3 rounded-xl ${color} shadow-lg flex-shrink-0`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1 leading-tight">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 leading-tight break-words">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Security Analysis Dashboard
        </h1>
        <p className="mt-3 text-xl text-gray-600">
          Overview of security analysis results from {stats.tools.length} tool(s)
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issues"
          value={stats.totalIssues}
          icon={Shield}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Critical & Error Issues"
          value={stats.severityBreakdown.error || 0}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-red-500 to-red-600"
          subtitle="Critical & Error issues"
        />
        <StatCard
          title="Fixable Issues"
          value={stats.fixableIssues}
          icon={CheckCircle}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle={`${((stats.fixableIssues / stats.totalIssues) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Files Affected"
          value={Object.keys(stats.fileBreakdown).length}
          icon={FileText}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Tools Information */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
            <Wrench className="h-5 w-5 text-indigo-600" />
          </div>
          Analysis Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.tools.map((tool, index) => (
            <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{tool.name}</p>
                <p className="text-sm text-gray-500">Version {tool.version}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Severity Breakdown Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            Issues by Severity
          </h2>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No severity data available</p>
            </div>
          )}
        </div>

        {/* Top Rules Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Top 10 Rules by Issue Count
          </h2>
          {topRules.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRules} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="rule" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No rule data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Affected Files */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          Most Affected Files
        </h2>
        {topFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Full Path
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topFiles.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {file.file}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {file.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {file.fullPath}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No file data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
