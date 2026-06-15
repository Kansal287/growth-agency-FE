'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, FileText } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
  type?: 'text' | 'image' | 'badge';
  blur?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface PaginationState {
  page: number;
  rowsPerPage: number;
  totalItems: number;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T, index?: number) => React.Key;
  pagination?: PaginationState;
  onChangePage?: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showCheckbox?: boolean;
  selectedRows?: Set<string | number>;
  onRowSelect?: (id: string | number, isSelected: boolean) => void;
  showExport?: boolean;
  onExportAll?: () => void;
  rowClassName?: (row: T) => string;
  loading?: boolean;
  title?: string;
}

function ReusableTable<T>({
  data,
  columns,
  keyExtractor,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  showCheckbox = false,
  selectedRows = new Set(),
  onRowSelect,
  showExport = false,
  onExportAll,
  rowClassName,
  loading = false,
  title,
}: ReusableTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.rowsPerPage)
    : 1;
  const currentPage = pagination?.page ?? 0;

  const getCellValue = (row: T, col: TableColumn<T>) => {
    if (typeof col.accessor === 'function') return col.accessor(row);
    return (row as Record<string, unknown>)[col.accessor as string];
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelect) return;
    data.forEach((item) => {
      const id = keyExtractor(item) as string | number;
      if (checked && !selectedRows.has(id)) onRowSelect(id, true);
      else if (!checked && selectedRows.has(id)) onRowSelect(id, false);
    });
  };

  const isAllSelected =
    data.length > 0 &&
    data.every((item) => selectedRows.has(keyExtractor(item) as string | number));

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      for (let i = 0; i < maxVisible; i++) pages.push(i);
    } else if (currentPage >= totalPages - 3) {
      for (let i = totalPages - maxVisible; i < totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full">
      {/* Header Row */}
      {(title || showExport) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          )}
          {showExport && (
            <button
              onClick={onExportAll}
              className="inline-flex items-center gap-2 bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download size={15} />
              Export CSV
            </button>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              {showCheckbox && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm tracking-wide ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'left'
                      ? 'text-left'
                      : 'text-center'
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700 animate-pulse">
                  {showCheckbox && (
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  className="text-center py-16 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No data available</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Records will appear here once available</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey = keyExtractor(row, rowIndex);
                const isSelected = selectedRows.has(rowKey as string | number);
                const customClass = rowClassName ? rowClassName(row) : '';
                return (
                  <tr
                    key={rowKey}
                    className={`border-b border-gray-100 dark:border-gray-700 transition-colors duration-100 ${
                      isSelected
                        ? 'bg-pink-50/60 dark:bg-pink-950/30'
                        : rowIndex % 2 === 0
                        ? 'bg-white dark:bg-gray-900 hover:bg-gray-50/60 dark:hover:bg-gray-800/60'
                        : 'bg-slate-50/40 dark:bg-gray-800/40 hover:bg-gray-50/60 dark:hover:bg-gray-800/60'
                    } ${customClass}`}
                  >
                    {showCheckbox && (
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select row`}
                          checked={isSelected}
                          onChange={(e) =>
                            onRowSelect?.(rowKey as string | number, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-pink-600 focus:ring-pink-500 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, colIndex) => {
                      const value = getCellValue(row, col);
                      return (
                        <td
                          key={colIndex}
                          className={`px-4 py-3.5 ${
                            col.blur ? 'blur-sm hover:blur-none transition-all duration-200' : ''
                          } ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'left'
                              ? 'text-left'
                              : 'text-center'
                          }`}
                        >
                          {col.type === 'image' ? (
                            <img
                              src={value as string}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover mx-auto shadow-sm"
                            />
                          ) : (
                            (value as React.ReactNode)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Rows per page:</span>
            <select
              aria-label="Rows per page"
              value={pagination.rowsPerPage}
              onChange={(e) => {
                if (onChangeRowsPerPage) {
                  onChangeRowsPerPage({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Count info */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.totalItems > 0
              ? `${currentPage * pagination.rowsPerPage + 1}–${Math.min(
                  (currentPage + 1) * pagination.rowsPerPage,
                  pagination.totalItems
                )} of ${pagination.totalItems.toLocaleString()} results`
              : '0 results'}
          </p>

          {/* Page controls */}
          <div className="flex items-center gap-1">
            {/* First/Prev — always visible */}
            <button
              onClick={() => onChangePage?.({}, 0)}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => onChangePage?.({}, currentPage - 1)}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page number buttons — hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => onChangePage?.({}, page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-pink-700 text-white shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>

            {/* Mobile: compact page indicator */}
            <span className="sm:hidden text-sm text-gray-600 dark:text-gray-400 px-2 font-medium">
              {currentPage + 1}/{totalPages}
            </span>

            {/* Next/Last — always visible */}
            <button
              onClick={() => onChangePage?.({}, currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onChangePage?.({}, totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReusableTable;
