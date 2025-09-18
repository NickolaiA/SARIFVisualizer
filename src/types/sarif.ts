// SARIF 2.1.0 TypeScript interfaces
// Based on the OASIS SARIF 2.1.0 specification

export interface SarifLog {
  version: string;
  $schema?: string;
  runs: Run[];
  inlineExternalProperties?: ExternalProperties[];
}

export interface Run {
  tool: Tool;
  invocations?: Invocation[];
  artifacts?: Artifact[];
  results?: Result[];
  taxonomies?: Taxonomy[];
  translations?: Translation[];
  policies?: Policy[];
  webRequests?: WebRequest[];
  webResponses?: WebResponse[];
  threadFlowLocations?: ThreadFlowLocation[];
  externalPropertyFileReferences?: ExternalPropertyFileReferences;
  conversion?: Conversion;
  language?: string;
  versionControlProvenance?: VersionControlDetails[];
  originalUriBaseIds?: { [key: string]: ArtifactLocation };
  properties?: PropertyBag;
}

export interface Tool {
  driver: ToolComponent;
  extensions?: ToolComponent[];
  notifications?: Notification[];
  properties?: PropertyBag;
}

export interface ToolComponent {
  guid?: string;
  name: string;
  organization?: string;
  product?: string;
  productSuite?: string;
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  fullName?: string;
  version?: string;
  semanticVersion?: string;
  dottedQuadFileVersion?: string;
  releaseDateUtc?: string;
  downloadUri?: string;
  informationUri?: string;
  globalMessageStrings?: { [key: string]: MultiformatMessageString };
  notifications?: ReportingDescriptor[];
  rules?: ReportingDescriptor[];
  taxa?: ReportingDescriptor[];
  locations?: ArtifactLocation[];
  language?: string;
  contents?: ToolComponentContents[];
  isComprehensive?: boolean;
  localizedDataSemanticVersion?: string;
  minimumRequiredLocalizedDataSemanticVersion?: string;
  associatedComponent?: ToolComponentReference;
  translationMetadata?: TranslationMetadata;
  supportedTaxonomies?: ToolComponentReference[];
  properties?: PropertyBag;
}

export interface ReportingDescriptor {
  id: string;
  deprecatedIds?: string[];
  guid?: string;
  name?: string;
  deprecatedNames?: string[];
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  messageStrings?: { [key: string]: MultiformatMessageString };
  defaultConfiguration?: ReportingConfiguration;
  helpUri?: string;
  help?: MultiformatMessageString;
  relationships?: ReportingDescriptorRelationship[];
  properties?: PropertyBag;
}

export interface MultiformatMessageString {
  text?: string;
  markdown?: string;
  properties?: PropertyBag;
}

export interface ReportingConfiguration {
  enabled?: boolean;
  level?: Level;
  rank?: number;
  parameters?: PropertyBag;
  properties?: PropertyBag;
}

export type Level = 'none' | 'note' | 'info' | 'warning' | 'error';

export interface Result {
  ruleId?: string;
  ruleIndex?: number;
  rule?: ReportingDescriptorReference;
  kind?: ResultKind;
  level?: Level;
  message: Message;
  analysisTarget?: ArtifactLocation;
  locations?: Location[];
  instanceGuid?: string;
  correlationGuid?: string;
  occurrenceCount?: number;
  partialFingerprints?: { [key: string]: string };
  fingerprints?: { [key: string]: string };
  stacks?: Stack[];
  codeFlows?: CodeFlow[];
  graphs?: Graph[];
  graphTraversals?: GraphTraversal[];
  relatedLocations?: Location[];
  suppressions?: Suppression[];
  baselineState?: BaselineState;
  rank?: number;
  attachments?: Attachment[];
  hostedViewerUri?: string;
  workItemUris?: string[];
  provenance?: ResultProvenance;
  fixes?: Fix[];
  taxa?: ReportingDescriptorReference[];
  webRequest?: WebRequest;
  webResponse?: WebResponse;
  properties?: PropertyBag;
}

export type ResultKind = 'notApplicable' | 'pass' | 'fail' | 'review' | 'open' | 'informational';
export type BaselineState = 'new' | 'updated' | 'unchanged' | 'absent';

export interface Message {
  text?: string;
  markdown?: string;
  id?: string;
  arguments?: string[];
  properties?: PropertyBag;
}

export interface Location {
  id?: number;
  physicalLocation?: PhysicalLocation;
  logicalLocations?: LogicalLocation[];
  message?: Message;
  annotations?: Region[];
  relationships?: LocationRelationship[];
  properties?: PropertyBag;
}

export interface PhysicalLocation {
  artifactLocation?: ArtifactLocation;
  region?: Region;
  contextRegion?: Region;
  address?: Address;
  properties?: PropertyBag;
}

export interface ArtifactLocation {
  uri?: string;
  uriBaseId?: string;
  index?: number;
  description?: Message;
  properties?: PropertyBag;
}

export interface Region {
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
  charOffset?: number;
  charLength?: number;
  byteOffset?: number;
  byteLength?: number;
  snippet?: ArtifactContent;
  message?: Message;
  sourceLanguage?: string;
  properties?: PropertyBag;
}

export interface ArtifactContent {
  text?: string;
  binary?: string;
  rendered?: MultiformatMessageString;
  properties?: PropertyBag;
}

export interface LogicalLocation {
  name?: string;
  index?: number;
  fullyQualifiedName?: string;
  decoratedName?: string;
  parentIndex?: number;
  kind?: string;
  properties?: PropertyBag;
}

export interface Artifact {
  location?: ArtifactLocation;
  parentIndex?: number;
  offset?: number;
  length?: number;
  roles?: ArtifactRoles[];
  mimeType?: string;
  contents?: ArtifactContent;
  encoding?: string;
  sourceLanguage?: string;
  hashes?: { [key: string]: string };
  lastModifiedTimeUtc?: string;
  description?: Message;
  properties?: PropertyBag;
}

export type ArtifactRoles = 
  | 'analysisTarget'
  | 'attachment'
  | 'responseFile'
  | 'resultFile'
  | 'standardStream'
  | 'tracedFile'
  | 'unmodified'
  | 'modified'
  | 'added'
  | 'deleted'
  | 'renamed'
  | 'uncontrolled'
  | 'driver'
  | 'extension'
  | 'translation'
  | 'taxonomy'
  | 'policy'
  | 'referencedOnCommandLine'
  | 'memoryContents'
  | 'directory'
  | 'userSpecifiedConfiguration'
  | 'toolSpecifiedConfiguration'
  | 'debugOutputFile';

export interface Fix {
  description?: Message;
  artifactChanges: ArtifactChange[];
  properties?: PropertyBag;
}

export interface ArtifactChange {
  artifactLocation: ArtifactLocation;
  replacements: Replacement[];
  properties?: PropertyBag;
}

export interface Replacement {
  deletedRegion: Region;
  insertedContent?: ArtifactContent;
  properties?: PropertyBag;
}

export interface Suppression {
  guid?: string;
  kind: SuppressionKind;
  status?: SuppressionStatus;
  justification?: string;
  location?: Location;
  externalId?: string;
  properties?: PropertyBag;
}

export type SuppressionKind = 'inSource' | 'external';
export type SuppressionStatus = 'accepted' | 'underReview' | 'rejected';

// Additional interfaces for completeness
export interface PropertyBag {
  [key: string]: any;
  tags?: string[];
}

export interface Invocation {
  commandLine?: string;
  arguments?: string[];
  responseFiles?: ArtifactLocation[];
  startTimeUtc?: string;
  endTimeUtc?: string;
  exitCode?: number;
  ruleConfigurationOverrides?: ConfigurationOverride[];
  notificationConfigurationOverrides?: ConfigurationOverride[];
  toolConfigurationNotifications?: Notification[];
  toolExecutionNotifications?: Notification[];
  machine?: string;
  account?: string;
  processId?: number;
  executableLocation?: ArtifactLocation;
  workingDirectory?: ArtifactLocation;
  environmentVariables?: { [key: string]: string };
  stdin?: ArtifactLocation;
  stdout?: ArtifactLocation;
  stderr?: ArtifactLocation;
  stdoutStderr?: ArtifactLocation;
  properties?: PropertyBag;
}

export interface ConfigurationOverride {
  configuration: ReportingConfiguration;
  descriptor: ReportingDescriptorReference;
  properties?: PropertyBag;
}

export interface ReportingDescriptorReference {
  id?: string;
  index?: number;
  guid?: string;
  toolComponent?: ToolComponentReference;
  properties?: PropertyBag;
}

export interface ToolComponentReference {
  name?: string;
  index?: number;
  guid?: string;
  properties?: PropertyBag;
}

export interface Notification {
  locations?: Location[];
  message: Message;
  level?: Level;
  threadId?: number;
  timeUtc?: string;
  exception?: Exception;
  descriptor?: ReportingDescriptorReference;
  associatedRule?: ReportingDescriptorReference;
  properties?: PropertyBag;
}

export interface Exception {
  kind?: string;
  message?: string;
  stack?: Stack;
  innerExceptions?: Exception[];
  properties?: PropertyBag;
}

export interface Stack {
  message?: Message;
  frames: StackFrame[];
  properties?: PropertyBag;
}

export interface StackFrame {
  location?: Location;
  module?: string;
  threadId?: number;
  parameters?: string[];
  properties?: PropertyBag;
}

// Additional types for external properties, taxonomies, etc.
export interface ExternalProperties {
  schema?: string;
  version?: string;
  guid?: string;
  runGuid?: string;
  conversion?: Conversion;
  graphs?: Graph[];
  externalizedProperties?: PropertyBag;
  artifacts?: Artifact[];
  invocations?: Invocation[];
  logicalLocations?: LogicalLocation[];
  threadFlowLocations?: ThreadFlowLocation[];
  results?: Result[];
  taxonomies?: Taxonomy[];
  driver?: ToolComponent;
  extensions?: ToolComponent[];
  policies?: Policy[];
  translations?: Translation[];
  addresses?: Address[];
  webRequests?: WebRequest[];
  webResponses?: WebResponse[];
  properties?: PropertyBag;
}

export interface Conversion {
  tool: Tool;
  invocation?: Invocation;
  analysisToolLogFiles?: ArtifactLocation[];
  properties?: PropertyBag;
}

export interface Taxonomy {
  guid?: string;
  name?: string;
  organization?: string;
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  releaseDateUtc?: string;
  version?: string;
  taxa?: ReportingDescriptor[];
  language?: string;
  contents?: ToolComponentContents[];
  isComprehensive?: boolean;
  localizedDataSemanticVersion?: string;
  minimumRequiredLocalizedDataSemanticVersion?: string;
  properties?: PropertyBag;
}

export interface Translation {
  language: string;
  name?: string;
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  releaseDateUtc?: string;
  version?: string;
  globalMessageStrings?: { [key: string]: MultiformatMessageString };
  rules?: ReportingDescriptor[];
  notifications?: ReportingDescriptor[];
  taxa?: ReportingDescriptor[];
  contents?: ToolComponentContents[];
  properties?: PropertyBag;
}

export interface Policy {
  name: string;
  organization?: string;
  product?: string;
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  releaseDateUtc?: string;
  version?: string;
  rules?: ReportingDescriptor[];
  notifications?: ReportingDescriptor[];
  taxa?: ReportingDescriptor[];
  contents?: ToolComponentContents[];
  properties?: PropertyBag;
}

export interface WebRequest {
  protocol?: string;
  version?: string;
  target?: string;
  method?: string;
  headers?: { [key: string]: string };
  parameters?: { [key: string]: string };
  body?: ArtifactContent;
  properties?: PropertyBag;
}

export interface WebResponse {
  protocol?: string;
  version?: string;
  statusCode?: number;
  reasonPhrase?: string;
  headers?: { [key: string]: string };
  body?: ArtifactContent;
  noResponseReceived?: boolean;
  properties?: PropertyBag;
}

export interface ThreadFlowLocation {
  step?: number;
  location?: Location;
  stack?: Stack;
  kinds?: string[];
  taxa?: ReportingDescriptorReference[];
  module?: string;
  state?: { [key: string]: MultiformatMessageString };
  nestingLevel?: number;
  executionOrder?: number;
  executionTimeUtc?: string;
  importance?: ThreadFlowLocationImportance;
  webRequest?: WebRequest;
  webResponse?: WebResponse;
  properties?: PropertyBag;
}

export type ThreadFlowLocationImportance = 'important' | 'essential' | 'unimportant';

export interface CodeFlow {
  message?: Message;
  threadFlows: ThreadFlow[];
  properties?: PropertyBag;
}

export interface ThreadFlow {
  id?: string;
  message?: Message;
  initialState?: { [key: string]: MultiformatMessageString };
  immutableState?: { [key: string]: MultiformatMessageString };
  locations: ThreadFlowLocation[];
  properties?: PropertyBag;
}

export interface Graph {
  description?: Message;
  nodes?: Node[];
  edges?: Edge[];
  properties?: PropertyBag;
}

export interface Node {
  id: string;
  label?: Message;
  location?: Location;
  children?: Node[];
  properties?: PropertyBag;
}

export interface Edge {
  id: string;
  label?: Message;
  sourceNodeId: string;
  targetNodeId: string;
  properties?: PropertyBag;
}

export interface GraphTraversal {
  runGuid?: string;
  resultGraphIndex?: number;
  graphIndex?: number;
  description?: Message;
  initialState?: { [key: string]: MultiformatMessageString };
  immutableState?: { [key: string]: MultiformatMessageString };
  edgeTraversals?: EdgeTraversal[];
  properties?: PropertyBag;
}

export interface EdgeTraversal {
  edgeId: string;
  message?: Message;
  finalState?: { [key: string]: MultiformatMessageString };
  stepOverEdgeCount?: number;
  properties?: PropertyBag;
}

export interface Address {
  baseAddress?: number;
  offset?: number;
  length?: number;
  kind?: string;
  name?: string;
  fullyQualifiedName?: string;
  offsetFromParent?: number;
  index?: number;
  parentIndex?: number;
  properties?: PropertyBag;
}

export interface Attachment {
  description?: Message;
  artifactLocation: ArtifactLocation;
  regions?: Region[];
  rectangles?: Rectangle[];
  properties?: PropertyBag;
}

export interface Rectangle {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  message?: Message;
  properties?: PropertyBag;
}

export interface LocationRelationship {
  target: number;
  kinds?: string[];
  description?: Message;
  properties?: PropertyBag;
}

export interface ReportingDescriptorRelationship {
  target: ReportingDescriptorReference;
  kinds?: string[];
  description?: Message;
  properties?: PropertyBag;
}

export interface ResultProvenance {
  firstDetectionTimeUtc?: string;
  lastDetectionTimeUtc?: string;
  firstDetectionRunGuid?: string;
  lastDetectionRunGuid?: string;
  invocationIndex?: number;
  conversionSources?: PhysicalLocation[];
  properties?: PropertyBag;
}

export interface TranslationMetadata {
  name: string;
  fullName?: string;
  shortDescription?: MultiformatMessageString;
  fullDescription?: MultiformatMessageString;
  downloadUri?: string;
  informationUri?: string;
  properties?: PropertyBag;
}

export interface VersionControlDetails {
  repositoryUri: string;
  revisionId?: string;
  branch?: string;
  revisionTag?: string;
  asOfTimeUtc?: string;
  mappedTo?: ArtifactLocation;
  properties?: PropertyBag;
}

export interface ExternalPropertyFileReferences {
  conversion?: ExternalPropertyFileReference;
  graphs?: ExternalPropertyFileReference[];
  externalizedProperties?: ExternalPropertyFileReference;
  artifacts?: ExternalPropertyFileReference[];
  invocations?: ExternalPropertyFileReference[];
  logicalLocations?: ExternalPropertyFileReference[];
  threadFlowLocations?: ExternalPropertyFileReference[];
  results?: ExternalPropertyFileReference[];
  taxonomies?: ExternalPropertyFileReference[];
  addresses?: ExternalPropertyFileReference[];
  driver?: ExternalPropertyFileReference;
  extensions?: ExternalPropertyFileReference[];
  policies?: ExternalPropertyFileReference[];
  translations?: ExternalPropertyFileReference[];
  webRequests?: ExternalPropertyFileReference[];
  webResponses?: ExternalPropertyFileReference[];
  properties?: PropertyBag;
}

export interface ExternalPropertyFileReference {
  location?: ArtifactLocation;
  guid?: string;
  itemCount?: number;
  properties?: PropertyBag;
}

export type ToolComponentContents = 
  | 'localizedData'
  | 'nonLocalizedData';

// Utility types for the application
export interface ParsedSarifData {
  sarifLog: SarifLog;
  summary: SarifSummary;
  enrichedResults?: EnrichedResult[];
}

export interface SarifSummary {
  totalRuns: number;
  totalResults: number;
  resultsByLevel: Record<Level, number>;
  resultsByRule: Record<string, number>;
  resultsByFile: Record<string, number>;
  toolsUsed: string[];
  hasFixAvailable: number;
  suppressedResults: number;
}

export interface EnrichedResult extends Result {
  enrichment?: VulnerabilityEnrichment;
}

export interface VulnerabilityEnrichment {
  cveDetails?: CVEDetails;
  cweDetails?: CWEDetails;
  nvdDetails?: NVDDetails;
  snykDetails?: SnykDetails;
}

export interface CVEDetails {
  id: string;
  description: string;
  cvssScore?: number;
  cvssVector?: string;
  publishedDate?: string;
  lastModifiedDate?: string;
  references?: string[];
}

export interface CWEDetails {
  id: string;
  name: string;
  description: string;
  category?: string;
  severity?: string;
}

export interface NVDDetails {
  id: string;
  summary: string;
  cvssV3?: {
    baseScore: number;
    baseSeverity: string;
    vectorString: string;
  };
  references?: {
    url: string;
    name?: string;
  }[];
}

export interface SnykDetails {
  id: string;
  title: string;
  description: string;
  severity: string;
  identifiers?: {
    CVE?: string[];
    CWE?: string[];
  };
  references?: {
    title: string;
    url: string;
  }[];
}
