export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Finding {
  id: string;
  ruleId: string;
  title: string;
  severity: Severity;
  line: number;
  description: string;
  recommendation: string;
  snippet: string;
}

export interface ScanSummary {
  scannedAt: Date;
  fileName: string;
  linesScanned: number;
  findings: Finding[];
}
