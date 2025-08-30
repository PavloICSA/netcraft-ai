import { PRESERVED_TERMS } from './validation';

export interface TranslationEntry {
  file: string;
  key: string;
  sourceText: string;
  targetText: string;
  status: 'complete' | 'missing' | 'needs_review' | 'new';
  preservedTerms: string[];
  context?: string;
  maxLength?: number;
  notes?: string;
}

export interface ExportOptions {
  includeComplete?: boolean;
  includeContext?: boolean;
  filterByStatus?: Array<'complete' | 'missing' | 'needs_review' | 'new'>;
  groupByFile?: boolean;
}

/**
 * Handles CSV export functionality for translation handoff
 */
export class TranslationCSVExporter {
  private sourceTranslations: Record<string, Record<string, any>>;
  private targetTranslations: Record<string, Record<string, any>>;

  constructor(
    sourceTranslations: Record<string, Record<string, any>>,
    targetTranslations: Record<string, Record<string, any>>
  ) {
    this.sourceTranslations = sourceTranslations;
    this.targetTranslations = targetTranslations;
  }

  /**
   * Flattens nested translation object into dot-notation keys
   */
  private flattenTranslations(obj: Record<string, any>, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        flattened[newKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(flattened, this.flattenTranslations(value, newKey));
      }
    }
    
    return flattened;
  }

  /**
   * Determines the status of a translation entry
   */
  private getTranslationStatus(
    sourceText: string,
    targetText: string,
    preservedTerms: string[]
  ): 'complete' | 'missing' | 'needs_review' | 'new' {
    if (!targetText || targetText.trim() === '') {
      return 'missing';
    }

    // Check if preserved terms are missing
    const missingTerms = preservedTerms.filter(term => !targetText.includes(term));
    if (missingTerms.length > 0) {
      return 'needs_review';
    }

    // Check for placeholder mismatches
    const placeholderPattern = /\{[^}]+\}/g;
    const sourcePlaceholders = sourceText.match(placeholderPattern) || [];
    const targetPlaceholders = targetText.match(placeholderPattern) || [];
    
    if (sourcePlaceholders.length !== targetPlaceholders.length) {
      return 'needs_review';
    }

    return 'complete';
  }

  /**
   * Extracts context information from translation keys
   */
  private getKeyContext(key: string): string {
    const parts = key.split('.');
    if (parts.length > 1) {
      return parts.slice(0, -1).join(' > ');
    }
    return '';
  }

  /**
   * Estimates maximum character length for UI elements
   */
  private estimateMaxLength(key: string, sourceText: string): number | undefined {
    // Button texts should be shorter
    if (key.includes('button') || key.includes('btn')) {
      return Math.max(sourceText.length * 1.2, 20);
    }
    
    // Form labels
    if (key.includes('label') || key.includes('placeholder')) {
      return Math.max(sourceText.length * 1.3, 30);
    }
    
    // Error messages can be longer
    if (key.includes('error') || key.includes('message')) {
      return Math.max(sourceText.length * 1.5, 100);
    }
    
    // Titles and headings
    if (key.includes('title') || key.includes('heading')) {
      return Math.max(sourceText.length * 1.2, 40);
    }
    
    return undefined;
  }

  /**
   * Generates translation entries for export
   */
  public generateTranslationEntries(options: ExportOptions = {}): TranslationEntry[] {
    const entries: TranslationEntry[] = [];
    
    for (const [fileName, sourceFile] of Object.entries(this.sourceTranslations)) {
      const targetFile = this.targetTranslations[fileName] || {};
      const sourceFlat = this.flattenTranslations(sourceFile);
      const targetFlat = this.flattenTranslations(targetFile);
      
      for (const [key, sourceText] of Object.entries(sourceFlat)) {
        const targetText = targetFlat[key] || '';
        const preservedTerms = PRESERVED_TERMS.filter(term => sourceText.includes(term));
        const status = this.getTranslationStatus(sourceText, targetText, preservedTerms);
        
        // Apply status filter if specified
        if (options.filterByStatus && !options.filterByStatus.includes(status)) {
          continue;
        }
        
        // Skip complete entries if not requested
        if (!options.includeComplete && status === 'complete') {
          continue;
        }
        
        const entry: TranslationEntry = {
          file: fileName.replace('.json', ''),
          key,
          sourceText,
          targetText,
          status,
          preservedTerms
        };
        
        if (options.includeContext) {
          entry.context = this.getKeyContext(key);
          entry.maxLength = this.estimateMaxLength(key, sourceText);
          
          // Add notes for special cases
          if (preservedTerms.length > 0) {
            entry.notes = `Preserve technical terms: ${preservedTerms.join(', ')}`;
          }
          
          if (sourceText.match(/\{[^}]+\}/g)) {
            const placeholders = sourceText.match(/\{[^}]+\}/g)!.join(', ');
            entry.notes = entry.notes 
              ? `${entry.notes}. Keep placeholders: ${placeholders}`
              : `Keep placeholders: ${placeholders}`;
          }
        }
        
        entries.push(entry);
      }
    }
    
    // Sort entries
    if (options.groupByFile) {
      entries.sort((a, b) => {
        if (a.file !== b.file) return a.file.localeCompare(b.file);
        return a.key.localeCompare(b.key);
      });
    } else {
      // Sort by status priority: missing > needs_review > new > complete
      const statusPriority = { missing: 0, needs_review: 1, new: 2, complete: 3 };
      entries.sort((a, b) => {
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        return a.key.localeCompare(b.key);
      });
    }
    
    return entries;
  }

  /**
   * Converts translation entries to CSV format
   */
  public entriesToCSV(entries: TranslationEntry[]): string {
    const headers = [
      'File',
      'Key',
      'Source Text',
      'Target Text',
      'Status',
      'Context',
      'Preserved Terms',
      'Max Length',
      'Notes'
    ];
    
    const escapeCSV = (value: string | number | undefined): string => {
      if (value === undefined || value === null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const rows = entries.map(entry => [
      escapeCSV(entry.file),
      escapeCSV(entry.key),
      escapeCSV(entry.sourceText),
      escapeCSV(entry.targetText),
      escapeCSV(entry.status),
      escapeCSV(entry.context || ''),
      escapeCSV(entry.preservedTerms.join('; ')),
      escapeCSV(entry.maxLength),
      escapeCSV(entry.notes || '')
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Exports translations to CSV format
   */
  public exportToCSV(options: ExportOptions = {}): string {
    const entries = this.generateTranslationEntries(options);
    return this.entriesToCSV(entries);
  }

  /**
   * Generates a summary report of the export
   */
  public generateSummary(entries: TranslationEntry[]): {
    total: number;
    byStatus: Record<string, number>;
    byFile: Record<string, number>;
    preservedTermsUsage: Record<string, number>;
  } {
    const summary = {
      total: entries.length,
      byStatus: {} as Record<string, number>,
      byFile: {} as Record<string, number>,
      preservedTermsUsage: {} as Record<string, number>
    };
    
    for (const entry of entries) {
      // Count by status
      summary.byStatus[entry.status] = (summary.byStatus[entry.status] || 0) + 1;
      
      // Count by file
      summary.byFile[entry.file] = (summary.byFile[entry.file] || 0) + 1;
      
      // Count preserved terms usage
      for (const term of entry.preservedTerms) {
        summary.preservedTermsUsage[term] = (summary.preservedTermsUsage[term] || 0) + 1;
      }
    }
    
    return summary;
  }
}

/**
 * Utility function to create a CSV export from translation files
 */
export function exportTranslationsToCSV(
  sourceTranslations: Record<string, Record<string, any>>,
  targetTranslations: Record<string, Record<string, any>>,
  options: ExportOptions = {}
): { csv: string; summary: any } {
  const exporter = new TranslationCSVExporter(sourceTranslations, targetTranslations);
  const entries = exporter.generateTranslationEntries(options);
  const csv = exporter.entriesToCSV(entries);
  const summary = exporter.generateSummary(entries);
  
  return { csv, summary };
}

/**
 * Parses CSV content back to translation entries (for import)
 */
export function parseCSVToEntries(csvContent: string): TranslationEntry[] {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const entries: TranslationEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (doesn't handle all edge cases)
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    if (values.length >= 5) {
      entries.push({
        file: values[0],
        key: values[1],
        sourceText: values[2],
        targetText: values[3],
        status: values[4] as any,
        preservedTerms: values[6] ? values[6].split(';').map(t => t.trim()) : [],
        context: values[5] || undefined,
        maxLength: values[7] ? parseInt(values[7]) : undefined,
        notes: values[8] || undefined
      });
    }
  }
  
  return entries;
}