// DataTable Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useMemo } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// DataTable types
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = any> extends StyledProps {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange?: (page: number, pageSize: number) => void;
  };
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  rowKey?: string | ((record: T) => string);
  size?: 'sm' | 'md' | 'lg';
  variant?: 'simple' | 'striped' | 'bordered';
  emptyText?: string;
  onRowClick?: (record: T, index: number) => void;
}

// DataTable container
const DataTableContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DataTableContainer',
    defaultProps: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 'lg',
      overflow: 'hidden',
    },
    variants: {
      variant: {
        simple: {},
        striped: {},
        bordered: {
          borderWidth: 1,
          borderColor: 'gray200',
        },
      },
    },
  }
);

// Table wrapper for scrolling
const TableWrapper = createStyledComponent(
  isWeb ? 'div' : 'ScrollView',
  {
    name: 'TableWrapper',
    defaultProps: {
      overflow: 'auto',
      maxHeight: 600,
    },
  }
);

// Table element
const Table = createStyledComponent(
  isWeb ? 'table' : 'View',
  {
    name: 'Table',
    defaultProps: {
      width: '100%',
      borderCollapse: isWeb ? 'collapse' : undefined,
    },
  }
);

// Table header
const TableHeader = createStyledComponent(
  isWeb ? 'thead' : 'View',
  {
    name: 'TableHeader',
    defaultProps: {
      backgroundColor: 'gray50',
      borderBottomWidth: 2,
      borderBottomColor: 'gray200',
    },
  }
);

// Table body
const TableBody = createStyledComponent(
  isWeb ? 'tbody' : 'View',
  {
    name: 'TableBody',
    defaultProps: {},
  }
);

// Table row
const TableRow = createStyledComponent(
  isWeb ? 'tr' : 'View',
  {
    name: 'TableRow',
    defaultProps: {
      borderBottomWidth: 1,
      borderBottomColor: 'gray200',
      transition: 'all 0.2s',
    },
    variants: {
      clickable: {
        true: {
          cursor: isWeb ? 'pointer' : undefined,
          hoverStyle: { backgroundColor: 'gray50' },
        },
        false: {},
      },
      selected: {
        true: { backgroundColor: 'primary50' },
        false: {},
      },
      striped: {
        true: { backgroundColor: 'gray25' },
        false: {},
      },
    },
  }
);

// Table header cell
const TableHeaderCell = createStyledComponent(
  isWeb ? 'th' : 'View',
  {
    name: 'TableHeaderCell',
    defaultProps: {
      textAlign: 'left',
      fontWeight: 'semibold',
      color: 'gray700',
      userSelect: 'none',
    },
    variants: {
      size: {
        sm: { px: 2, py: 2, fontSize: 'xs' },
        md: { px: 3, py: 3, fontSize: 'sm' },
        lg: { px: 4, py: 4, fontSize: 'base' },
      },
      sortable: {
        true: {
          cursor: isWeb ? 'pointer' : undefined,
          hoverStyle: { backgroundColor: 'gray100' },
        },
        false: {},
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
    },
  }
);

// Table data cell
const TableCell = createStyledComponent(
  isWeb ? 'td' : 'View',
  {
    name: 'TableCell',
    defaultProps: {
      color: 'gray900',
    },
    variants: {
      size: {
        sm: { px: 2, py: 2, fontSize: 'xs' },
        md: { px: 3, py: 3, fontSize: 'sm' },
        lg: { px: 4, py: 4, fontSize: 'base' },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
    },
  }
);

// Loading overlay
const LoadingOverlay = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'LoadingOverlay',
    defaultProps: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
  }
);

// Empty state
const EmptyState = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'EmptyState',
    defaultProps: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      color: 'gray500',
      fontSize: 'sm',
    },
  }
);

// Sort icon
const SortIcon = ({ direction }: { direction?: 'asc' | 'desc' | null }) => {
  if (isWeb) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          marginLeft: 4,
          opacity: direction ? 1 : 0.5,
          transform: direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return (
      <Text style={{
        marginLeft: 4,
        fontSize: 12,
        opacity: direction ? 1 : 0.5,
        transform: [{ rotate: direction === 'desc' ? '180deg' : '0deg' }],
      }}>
        ▼
      </Text>
    );
  }
};

// Checkbox component for selection
const Checkbox = createStyledComponent(
  isWeb ? 'input' : 'View',
  {
    name: 'Checkbox',
    defaultProps: {
      width: 16,
      height: 16,
      borderRadius: 'sm',
      borderWidth: 1,
      borderColor: 'gray300',
    },
  }
);

// Main DataTable component
export const DataTable = forwardRef<any, DataTableProps>(
  (
    {
      columns,
      data,
      loading = false,
      pagination,
      sortable = true,
      filterable = false,
      selectable = false,
      selectedRowKeys = [],
      onSelectionChange,
      rowKey = 'id',
      size = 'md',
      variant = 'simple',
      emptyText = 'No data',
      onRowClick,
      ...props
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);

    // Get row key
    const getRowKey = (record: any, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index.toString();
    };

    // Handle sorting
    const handleSort = (columnKey: string) => {
      if (!sortable) return;

      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
        direction = 'desc';
      }

      setSortConfig({ key: columnKey, direction });
    };

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortConfig) return data;

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }, [data, sortConfig]);

    // Handle row selection
    const handleRowSelection = (rowKey: string, selected: boolean) => {
      if (!selectable || !onSelectionChange) return;

      let newSelectedKeys: string[];
      if (selected) {
        newSelectedKeys = [...selectedRowKeys, rowKey];
      } else {
        newSelectedKeys = selectedRowKeys.filter(key => key !== rowKey);
      }

      const selectedRows = sortedData.filter(record => 
        newSelectedKeys.includes(getRowKey(record, 0))
      );

      onSelectionChange(newSelectedKeys, selectedRows);
    };

    // Handle select all
    const handleSelectAll = (selected: boolean) => {
      if (!selectable || !onSelectionChange) return;

      if (selected) {
        const allKeys = sortedData.map((record, index) => getRowKey(record, index));
        onSelectionChange(allKeys, sortedData);
      } else {
        onSelectionChange([], []);
      }
    };

    const isAllSelected = selectedRowKeys.length === sortedData.length && sortedData.length > 0;
    const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < sortedData.length;

    return (
      <DataTableContainer
        ref={ref}
        variant={variant}
        style={{ position: 'relative' }}
        {...props}
      >
        <TableWrapper>
          <Table>
            {/* Header */}
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHeaderCell size={size}>
                    {isWeb ? (
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    ) : (
                      <Checkbox />
                    )}
                  </TableHeaderCell>
                )}
                
                {columns.map((column) => (
                  <TableHeaderCell
                    key={column.key}
                    size={size}
                    align={column.align}
                    sortable={column.sortable !== false && sortable}
                    style={{ width: column.width }}
                    onPress={() => column.sortable !== false && handleSort(column.key)}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {column.title}
                      {column.sortable !== false && sortable && (
                        <SortIcon
                          direction={
                            sortConfig?.key === column.key ? sortConfig.direction : null
                          }
                        />
                      )}
                    </div>
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    size={size}
                    style={{
                      colSpan: columns.length + (selectable ? 1 : 0),
                      textAlign: 'center',
                    }}
                  >
                    <EmptyState>
                      {emptyText}
                    </EmptyState>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((record, index) => {
                  const key = getRowKey(record, index);
                  const isSelected = selectedRowKeys.includes(key);
                  const isStriped = variant === 'striped' && index % 2 === 1;

                  return (
                    <TableRow
                      key={key}
                      selected={isSelected}
                      striped={isStriped}
                      clickable={!!onRowClick}
                      onPress={() => onRowClick?.(record, index)}
                      onClick={() => onRowClick?.(record, index)}
                    >
                      {selectable && (
                        <TableCell size={size}>
                          {isWeb ? (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleRowSelection(key, e.target.checked)}
                            />
                          ) : (
                            <Checkbox />
                          )}
                        </TableCell>
                      )}
                      
                      {columns.map((column) => {
                        const value = column.dataIndex 
                          ? record[column.dataIndex] 
                          : record[column.key];
                        
                        return (
                          <TableCell
                            key={column.key}
                            size={size}
                            align={column.align}
                          >
                            {column.render 
                              ? column.render(value, record, index)
                              : value
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrapper>

        {/* Loading overlay */}
        {loading && (
          <LoadingOverlay>
            <div>Loading...</div>
          </LoadingOverlay>
        )}
      </DataTableContainer>
    );
  }
);

DataTable.displayName = "DataTable";

export default DataTable;
