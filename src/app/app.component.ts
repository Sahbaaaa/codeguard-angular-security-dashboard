import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Finding, ScanSummary, Severity } from './models/finding.model';
import { ScannerService } from './services/scanner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly scanner = inject(ScannerService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  code = `// Example code — try running a scan\nconst query = "SELECT * FROM users WHERE name = '" + username + "'";\ndb.execute(query);\n\nconst password = "admin123";\n\neval(userInput);\n`;
  fileName = 'example.js';
  isScanning = false;
  hasScanned = false;
  filter: 'All' | Severity = 'All';
  selectedFinding: Finding | null = null;
  scanHistory: ScanSummary[] = [];
  errorMessage = '';

  get findings(): Finding[] {
    return this.scanHistory[0]?.findings ?? [];
  }

  get visibleFindings(): Finding[] {
    return this.filter === 'All'
      ? this.findings
      : this.findings.filter((finding) => finding.severity === this.filter);
  }

  get criticalCount(): number { return this.findings.filter((item) => item.severity === 'Critical').length; }
  get highCount(): number { return this.findings.filter((item) => item.severity === 'High').length; }
  get mediumCount(): number { return this.findings.filter((item) => item.severity === 'Medium').length; }
  get lowCount(): number { return this.findings.filter((item) => item.severity === 'Low').length; }

  runScan(): void {
    if (!this.code.trim() || this.isScanning) return;
    this.errorMessage = '';
    this.isScanning = true;
    this.hasScanned = false;
    this.selectedFinding = null;

    // A short delay makes the prototype feel like a scanner. Analysis is local and rule-based.
    window.setTimeout(() => {
      const results = this.scanner.scan(this.code);
      const summary: ScanSummary = {
        scannedAt: new Date(),
        fileName: this.fileName,
        linesScanned: this.code.split(/\r?\n/).length,
        findings: results
      };
      this.scanHistory = [summary, ...this.scanHistory].slice(0, 5);
      this.isScanning = false;
      this.hasScanned = true;
    }, 650);
  }

  loadExample(): void {
    this.fileName = 'example.js';
    this.code = `// Example code — intentionally includes patterns for the demo scanner\nconst query = "SELECT * FROM users WHERE name = '" + username + "'";\ndb.execute(query);\n\nconst password = "admin123";\n\neval(userInput);\n\n element.innerHTML = userInput;\n`;
    this.filter = 'All';
    this.selectedFinding = null;
    this.hasScanned = false;
    this.errorMessage = '';
  }

  openFilePicker(): void { this.fileInput?.nativeElement.click(); }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const allowed = /\.(js|ts|html|css|java|py|cpp|c|h|cs|php|rb|go|txt)$/i;
    if (!allowed.test(file.name)) {
      this.errorMessage = 'Please choose a supported text-based source file.';
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      this.errorMessage = 'For this demo, files must be smaller than 1 MB.';
      input.value = '';
      return;
    }
    try {
      this.code = await file.text();
      this.fileName = file.name;
      this.hasScanned = false;
      this.selectedFinding = null;
      this.errorMessage = '';
    } catch {
      this.errorMessage = 'The selected file could not be read.';
    }
    input.value = '';
  }

  selectFinding(finding: Finding): void {
    this.selectedFinding = this.selectedFinding?.id === finding.id ? null : finding;
  }

  clearResults(): void {
    this.scanHistory = [];
    this.hasScanned = false;
    this.selectedFinding = null;
    this.filter = 'All';
  }

  trackFinding(_index: number, finding: Finding): string { return finding.id; }
}
