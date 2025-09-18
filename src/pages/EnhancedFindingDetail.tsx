import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  ExternalLink, 
  AlertTriangle, 
  MapPin, 
  Code, 
  Wrench, 
  Shield,
  Info,
  Calendar
} from 'lucide-react';
import { useSarifStore } from '../store/sarifStore';
import { enrichmentService, type VulnerabilityEnrichment } from '../services/enrichmentService';

export default function EnhancedFindingDetail() {
  const { id } = useParams<{ id: string }>();
  const { sarifData } = useSarifStore();
  const [enrichment, setEnrichment] = useState<VulnerabilityEnrichment | null>(null);
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);

  if (!sarifData || !id) {
    return <Navigate to="/findings" replace />;
  }

  const issue = sarifData.issues.find(issue => issue.id === id);

  if (!issue) {
    return <Navigate to="/findings" replace />;
  }

  useEffect(() => {
    const fetchEnrichment = async () => {
      if (issue.rule) {
        setLoadingEnrichment(true);
        try {
          const enrichmentData = await enrichmentService.enrichRule(
            issue.ruleId,
            issue.rule.helpUri,
            issue.rule.properties
          );
          setEnrichment(enrichmentData);
        } catch (error) {
          console.error('Failed to enrich rule:', error);
        } finally {
          setLoadingEnrichment(false);
        }
      }
    };

    fetchEnrichment();
  }, [issue.rule, issue.ruleId]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      note: 'text-blue-600 bg-blue-50 border-blue-200',
      info: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/findings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Findings
        </Link>
      </div>

      {/* Issue Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(issue.severity)}`}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              {issue.severity}
            </span>
            <span className="text-lg font-medium text-gray-600">{issue.ruleId}</span>
            {issue.fixes && issue.fixes.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                <Wrench className="w-4 h-4 mr-1" />
                Fixable
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {issue.message}
        </h1>

        {issue.rule?.shortDescription?.text && (
          <p className="text-gray-600 mb-4">
            {issue.rule.shortDescription.text}
          </p>
        )}
      </div>

      {/* Vulnerability Enrichment */}
      {(enrichment || loadingEnrichment) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Vulnerability Information
          </h2>
          
          {loadingEnrichment ? (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
              Loading vulnerability details...
            </div>
          ) : enrichment ? (
            <div className="space-y-4">
              {/* CWE Information */}
              {enrichment.cwe && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    {enrichment.cwe.name}
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    {enrichment.cwe.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {enrichment.cwe.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        CWE Reference
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CVE Information */}
              {enrichment.cve && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-red-900 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {enrichment.cve.id}
                    </h3>
                    {enrichment.cve.score && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-200 text-red-800">
                        CVSS: {enrichment.cve.score}
                      </span>
                    )}
                  </div>
                  <p className="text-red-800 text-sm mb-3">
                    {enrichment.cve.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-red-700 mb-3">
                    {enrichment.cve.publishedDate && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Published: {new Date(enrichment.cve.publishedDate).toLocaleDateString()}
                      </div>
                    )}
                    {enrichment.cve.lastModifiedDate && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Modified: {new Date(enrichment.cve.lastModifiedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {enrichment.cve.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        CVE Reference
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Locations */}
      {issue.locations && issue.locations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Locations
          </h2>
          <div className="space-y-4">
            {issue.locations.map((location, index) => {
              const physicalLocation = location.physicalLocation;
              const file = physicalLocation?.artifactLocation?.uri;
              const region = physicalLocation?.region;

              return (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-sm text-gray-900">{file}</span>
                    {region && (
                      <span className="text-sm text-gray-500">
                        Lines {region.startLine}-{region.endLine}, Columns {region.startColumn}-{region.endColumn}
                      </span>
                    )}
                  </div>
                  
                  {location.message?.text && (
                    <p className="text-sm text-gray-600 mt-2">
                      {location.message.text}
                    </p>
                  )}
                  
                  {region?.snippet?.text && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Code Snippet:</h4>
                      <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-sm overflow-x-auto">
                        <code>{region.snippet.text}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Locations */}
      {issue.relatedLocations && issue.relatedLocations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Related Locations
          </h2>
          <div className="space-y-3">
            {issue.relatedLocations.map((location, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-gray-900">
                    {location.physicalLocation?.artifactLocation?.uri}
                  </span>
                  {location.physicalLocation?.region && (
                    <span className="text-sm text-gray-500">
                      Line {location.physicalLocation.region.startLine}
                    </span>
                  )}
                </div>
                {location.message?.text && (
                  <p className="text-sm text-gray-600">{location.message.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rule Information */}
      {issue.rule && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Rule Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Rule ID</h3>
              <p className="text-sm text-gray-900">{issue.ruleId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Tool</h3>
              <p className="text-sm text-gray-900">{issue.rule.toolName}</p>
            </div>
            {issue.rule.properties?.category && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Category</h3>
                <p className="text-sm text-gray-900">{issue.rule.properties.category}</p>
              </div>
            )}
            {issue.rule.properties?.cwe && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">CWE</h3>
                <p className="text-sm text-gray-900">{issue.rule.properties.cwe}</p>
              </div>
            )}
          </div>

          {issue.rule.fullDescription?.text && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-900">{issue.rule.fullDescription.text}</p>
            </div>
          )}

          {issue.rule.help?.markdown && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Help</h3>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{issue.rule.help.markdown}</ReactMarkdown>
              </div>
            </div>
          )}

          {issue.rule.helpUri && (
            <div>
              <a
                href={issue.rule.helpUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Documentation
              </a>
            </div>
          )}
        </div>
      )}

      {/* Fixes */}
      {issue.fixes && issue.fixes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Suggested Fixes
          </h2>
          <div className="space-y-4">
            {issue.fixes.map((fix, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {fix.description?.text || `Fix ${index + 1}`}
                </h3>
                {fix.artifactChanges?.map((change: any, changeIndex: number) => (
                  <div key={changeIndex} className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">
                      File: {change.artifactLocation?.uri}
                    </p>
                    {change.replacements?.map((replacement: any, repIndex: number) => (
                      <div key={repIndex} className="bg-gray-50 rounded p-2 text-sm">
                        <p className="text-gray-600 mb-1">Replacement:</p>
                        <pre className="text-gray-900">{replacement.insertedContent?.text || 'Delete content'}</pre>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
