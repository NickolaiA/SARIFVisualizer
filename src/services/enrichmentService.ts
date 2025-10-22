import type { PropertyBag } from '../types/sarif';
import type { SarifRule } from '../store/sarifStore';

export interface CVEInfo {
  id: string;
  description: string;
  severity: string;
  score?: number;
  references: string[];
  publishedDate?: string;
  lastModifiedDate?: string;
}

export interface CWEInfo {
  id: string;
  name: string;
  description: string;
  weaknessType: string;
  references: string[];
}

export interface VulnerabilityEnrichment {
  cve?: CVEInfo;
  cwe?: CWEInfo;
  enrichmentDate: string;
}

class EnrichmentService {
  private readonly cache = new Map<string, VulnerabilityEnrichment>();

  async enrichRule(ruleId: string, helpUri?: string, properties?: PropertyBag): Promise<VulnerabilityEnrichment | null> {
    // Check cache first
    const cacheKey = `${ruleId}-${helpUri}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const enrichment: VulnerabilityEnrichment = {
        enrichmentDate: new Date().toISOString()
      };

      // Extract CWE information
      const cweId = this.extractCWEId(properties, helpUri);
      if (cweId) {
        enrichment.cwe = await this.fetchCWEInfo(cweId);
      }

      // Extract CVE information from help URI or properties
      const cveId = this.extractCVEId(properties, helpUri);
      if (cveId) {
        enrichment.cve = await this.fetchCVEInfo(cveId);
      }

      // Cache the result
      this.cache.set(cacheKey, enrichment);
      return enrichment;
    } catch (error) {
      console.warn('Failed to enrich rule:', ruleId, error);
      return null;
    }
  }

  private extractCWEId(properties?: PropertyBag, helpUri?: string): string | null {
    // Check properties first
    if (properties?.cwe && typeof properties.cwe === 'string') {
      const match = properties.cwe.match(/CWE-(\d+)/i);
      if (match) return match[1];
    }

    // Check helpUri
    if (helpUri) {
      const match = helpUri.match(/CWE-(\d+)/i);
      if (match) return match[1];
    }

    return null;
  }

  private extractCVEId(properties?: PropertyBag, helpUri?: string): string | null {
    // Check properties first
    if (properties?.cve && typeof properties.cve === 'string') {
      const match = properties.cve.match(/CVE-(\d{4}-\d+)/i);
      if (match) return match[0];
    }

    // Check helpUri
    if (helpUri) {
      const match = helpUri.match(/CVE-(\d{4}-\d+)/i);
      if (match) return match[0];
    }

    return null;
  }

  private async fetchCWEInfo(cweId: string): Promise<CWEInfo | undefined> {
    try {
      // For demo purposes, return mock data
      // In a real implementation, you would call the CWE API
      const mockCWEData: Record<string, CWEInfo> = {
        '1321': {
          id: 'CWE-1321',
          name: 'Improperly Controlled Modification of Object Prototype Attributes (Prototype Pollution)',
          description: 'The software receives input from an upstream component that specifies attributes that are to be initialized or updated in an object, but it does not properly control modifications of attributes of the object prototype.',
          weaknessType: 'Base',
          references: [
            'https://cwe.mitre.org/data/definitions/1321.html',
            'https://portswigger.net/web-security/prototype-pollution'
          ]
        },
        '79': {
          id: 'CWE-79',
          name: 'Cross-site Scripting (XSS)',
          description: 'The software does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page that is served to other users.',
          weaknessType: 'Base',
          references: [
            'https://cwe.mitre.org/data/definitions/79.html',
            'https://owasp.org/www-community/attacks/xss/'
          ]
        }
      };

      return mockCWEData[cweId];
    } catch (error) {
      console.error('Failed to fetch CWE info:', error);
      return undefined;
    }
  }

  private async fetchCVEInfo(cveId: string): Promise<CVEInfo | undefined> {
    try {
      // For demo purposes, return mock data
      // In a real implementation, you would call the NVD API
      const mockCVEData: Record<string, CVEInfo> = {
        'CVE-2021-23337': {
          id: 'CVE-2021-23337',
          description: 'Lodash versions prior to 4.17.21 are vulnerable to Command Injection via the template function.',
          severity: 'HIGH',
          score: 7.2,
          references: [
            'https://nvd.nist.gov/vuln/detail/CVE-2021-23337',
            'https://security.snyk.io/vuln/SNYK-JS-LODASH-1040724'
          ],
          publishedDate: '2021-02-15T13:15:00.000Z',
          lastModifiedDate: '2021-03-01T18:32:00.000Z'
        }
      };

      return mockCVEData[cveId];
    } catch (error) {
      console.error('Failed to fetch CVE info:', error);
      return undefined;
    }
  }

  async enrichAllRules(rules: Record<string, SarifRule>): Promise<Record<string, VulnerabilityEnrichment | null>> {
    const enrichments: Record<string, VulnerabilityEnrichment | null> = {};
    
    for (const [ruleId, rule] of Object.entries(rules)) {
      enrichments[ruleId] = await this.enrichRule(
        ruleId,
        rule.helpUri,
        rule.properties
      );
    }

    return enrichments;
  }
}

export const enrichmentService = new EnrichmentService();
