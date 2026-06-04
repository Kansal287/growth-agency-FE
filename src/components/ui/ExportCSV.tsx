'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface ExportCSVProps<T> {
  fetchData?: () => Promise<T[]>;
  data?: T[];
  columns: Column<T>[];
  filename?: string;
  buttonText?: string;
  className?: string;
}

function extractText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (React.isValidElement(value)) {
    const children = (value as React.ReactElement<{ children?: unknown }>).props?.children;
    if (!children) return '';
    if (typeof children === 'string' || typeof children === 'number') return String(children);
    if (Array.isArray(children)) return children.map(extractText).join('');
    return extractText(children);
  }
  return String(value);
}

function toCSV<T>(data: T[], columns: Column<T>[]): string {
  const header = columns.map((c) => `"${c.header}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const raw =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : row[col.accessor as keyof T];
        const text = extractText(raw).replace(/"/g, '""');
        return `"${text}"`;
      })
      .join(',')
  );
  return [header, ...rows].join('\n');
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ExportCSV<T>({
  fetchData,
  data,
  columns,
  filename = 'export.csv',
  buttonText = 'Export CSV',
  className,
}: ExportCSVProps<T>) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const rows = data ?? (fetchData ? await fetchData() : []);
      const csv = toCSV(rows, columns);
      downloadCSV(csv, filename);
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className={
        className ??
        'inline-flex items-center gap-2 bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed'
      }
    >
      <Download size={15} />
      {loading ? 'Exporting…' : buttonText}
    </button>
  );
}

export default ExportCSV;
