import { Injectable } from '@angular/core';
import { Finding, Severity } from '../models/finding.model';

interface Rule {
  id: string;
  title: string;
  severity: Severity;
  pattern: RegExp;
  description: string;
  recommendation: string;
}

@Injectable({ providedIn: 'root' })
export class ScannerService {
  private readonly rules: Rule[] = [
    {
      id: 'CG-001', title: 'Possible SQL injection', severity: 'Critical',
      pattern: /(SELECT|UPDATE|DELETE|INSERT).*(\+\s*\w+|\$\{)|execute\s*\(\s*query\s*\)/i,
      description: 'A database query may include data that comes directly from a variable. If that data is user-controlled, an attacker could alter the query.',
      recommendation: 'Use parameterized queries or prepared statements. Validate input on the server as an additional layer of protection.'
    },
    {
      id: 'CG-002', title: 'Hardcoded credential', severity: 'High',
      pattern: /(password|passwd|api[_-]?key|secret)\s*[:=]\s*["'][^"']{3,}["']/i,
      description: 'A value that looks like a password, API key, or secret is written directly in source code.',
      recommendation: 'Remove the credential from source control, rotate it if it was real, and load secrets from a secure configuration or secrets manager.'
    },
    {
      id: 'CG-003', title: 'Dynamic code execution', severity: 'High',
      pattern: /\beval\s*\(/i,
      description: 'The eval() function can execute a string as code. Using untrusted input here can allow arbitrary code execution.',
      recommendation: 'Avoid eval(). Prefer explicit parsing or safer functions designed for the task.'
    },
    {
      id: 'CG-004', title: 'Potential unsafe HTML insertion', severity: 'Medium',
      pattern: /\.innerHTML\s*=/i,
      description: 'Assigning untrusted content to innerHTML can create a cross-site scripting (XSS) risk.',
      recommendation: 'Prefer textContent or framework-provided safe rendering. Sanitize HTML when rich HTML is genuinely required.'
    },
    {
      id: 'CG-005', title: 'Disabled TLS certificate validation', severity: 'High',
      pattern: /(rejectUnauthorized\s*:\s*false|verify\s*=\s*False|verify_ssl\s*=\s*False)/i,
      description: 'Certificate validation appears to be disabled, which can make connections vulnerable to interception.',
      recommendation: 'Enable certificate validation and configure trusted certificates correctly.'
    },
    {
      id: 'CG-006', title: 'Potentially weak hash algorithm', severity: 'Low',
      pattern: /\b(md5|sha1)\s*\(/i,
      description: 'MD5 and SHA-1 are not suitable for modern security-sensitive hashing use cases.',
      recommendation: 'For password storage, use a dedicated password hashing function such as Argon2id, scrypt, or bcrypt. For integrity, choose a modern hash such as SHA-256 where appropriate.'
    }
  ];

  scan(source: string): Finding[] {
    const findings: Finding[] = [];
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const rule of this.rules) {
        // Each rule is tested once per line. The patterns are illustrative, not a parser.
        if (rule.pattern.test(line)) {
          findings.push({
            id: `${rule.id}-${index + 1}`,
            ruleId: rule.id,
            title: rule.title,
            severity: rule.severity,
            line: index + 1,
            description: rule.description,
            recommendation: rule.recommendation,
            snippet: line.trim().slice(0, 180)
          });
        }
      }
    });

    return findings;
  }
}
