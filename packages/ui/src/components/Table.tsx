import React, { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import { ChevronUp, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { Button } from "./Button";
import { InputComponent } from "./Input";
import { Card } from "./Card";

interface Column<T> {
  key: keyof T | string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  mobileLabel?: string; // Label for mobile card view
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T, index: number) => void;
  rowActions?: (item: T, index: number) => React.ReactNode;
  mobileCardView?: boolean; // Force card view on mobile
  stickyHeader?: boolean;
}

type SortDirection = "asc" | "desc" | null;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export function Table<T extends Record<string, any>>({
  data,
  columns,
  className,
  loading = false,
  emptyMessage = "No data available",
  searchable = false,
  searchPlaceholder = "Search...",
  onRowClick,
  rowActions,
  mobileCardView = true,
  stickyHeader = false,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      columns.some((column) => {
        const value = column.accessor
          ? column.accessor(item)
          : item[column.key as keyof T];
        
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sortKey);
      const aValue = column?.accessor ? column.accessor(a) : a[sortKey as keyof T];
      const bValue = column?.accessor ? column.accessor(b) : b[sortKey as keyof T];

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortKey, sortDirection, columns]);

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: keyof T | string) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Mobile card view
  if (isMobile && mobileCardView) {
    return (
      <div className={cn("omnisync-component space-y-4", className)}>
        {searchable && (
          <InputComponent
            leftIcon={<Search className="h-4 w-4" />}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="space-y-3 p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 dark:bg-gray-700" />
                </div>
              </Card>
            ))}
          </div>
        ) : sortedData.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedData.map((item, index) => (
              <Card
                key={index}
                interactive={!!onRowClick}
                onClick={() => onRowClick?.(item, index)}
                className="p-4"
              >
                <div className="space-y-2">
                  {columns
                    .filter((col) => !col.hideOnMobile)
                    .map((column) => {
                      const value = column.accessor
                        ? column.accessor(item)
                        : item[column.key as keyof T];

                      return (
                        <div key={String(column.key)} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {column.mobileLabel || column.header}:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 text-right flex-1 ml-2">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  
                  {rowActions && (
                    <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                      {rowActions(item, index)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className={cn("omnisync-component", className)}>
      {searchable && (
        <div className="mb-4">
          <InputComponent
            leftIcon={<Search className="h-4 w-4" />}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700">
        <table className="w-full">
          <thead
            className={cn(
              "bg-gray-50 dark:bg-gray-800",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400",
                    column.sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {rowActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700" />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16 ml-auto dark:bg-gray-700" />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((column) => {
                    const value = column.accessor
                      ? column.accessor(item)
                      : item[column.key as keyof T];

                    return (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {value}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {rowActions(item, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
