import type { Input as AntDInput } from 'antd';
import type { CSSProperties } from 'react';
import React from 'react';
import type { InputProps } from '../Input';
import type { HTMLDataAttributes } from '../types';
export interface TableProps extends HTMLDataAttributes {
    size?: 'default' | 'small';
    /** Are any rows currently selected? You must specify this if using `TableRowSelectCell` in your table. */
    someRowsSelected?: boolean;
    /** Style property */
    style?: CSSProperties;
    /** Class name property */
    className?: string;
    /** Content slot for providing a pagination component */
    pagination?: React.ReactNode;
    /** Content slot for providing an Empty component */
    empty?: React.ReactNode;
    /** Child nodes for the table */
    children?: React.ReactNode | React.ReactNode[];
    /** Is this `Table` scrollable? Only use if `Table` is placed within a container of determinate height. */
    scrollable?: boolean;
}
export declare const Table: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLDivElement>>;
export interface TableRowProps extends HTMLDataAttributes {
    /** Style property */
    style?: CSSProperties;
    /** Class name property */
    className?: string;
    /** Set to true if this row is to be used for a table header row */
    isHeader?: boolean;
    /** @deprecated Vertical alignment of the row's cells. No longer supported (See FEINF-1937) */
    verticalAlignment?: 'top' | 'center';
    /** Child nodes for the table row */
    children?: React.ReactNode | React.ReactNode[];
}
export declare const TableRow: React.ForwardRefExoticComponent<TableRowProps & React.RefAttributes<HTMLDivElement>>;
export interface TableCellProps extends HTMLDataAttributes {
    /** Enables single-line ellipsis truncation */
    ellipsis?: boolean;
    /** How to horizontally align the cell contents */
    align?: 'left' | 'center' | 'right';
    /** Class name property */
    className?: string;
    /** Style property */
    style?: CSSProperties;
    /** Child nodes for the table cell */
    children?: React.ReactNode | React.ReactNode[];
}
export declare const TableCell: React.ForwardRefExoticComponent<TableCellProps & React.RefAttributes<HTMLDivElement>>;
export interface TableHeaderProps extends HTMLDataAttributes {
    /** Enables single-line ellipsis truncation */
    ellipsis?: boolean;
    /** Is this column sortable? */
    sortable?: boolean;
    /** The current sort direction for this column */
    sortDirection?: 'asc' | 'desc' | 'none';
    /** Callback for when the user requests to toggle `sortDirection` */
    onToggleSort?: (event: unknown) => void;
    /** Style property */
    style?: CSSProperties;
    /** Class name property */
    className?: string;
    /** Child nodes for the table header */
    children?: React.ReactNode | React.ReactNode[];
    /** Whether the table header should include a resize handler */
    resizable?: boolean;
    /** Event handler to be passed down to <TableHeaderResizeHandle /> */
    resizeHandler?: React.PointerEventHandler<HTMLDivElement>;
    /** Whether the header is currently being resized */
    isResizing?: boolean;
    /** How to horizontally align the cell contents */
    align?: 'left' | 'center' | 'right';
}
export declare const TableHeader: React.ForwardRefExoticComponent<TableHeaderProps & React.RefAttributes<HTMLDivElement>>;
interface TableRowSelectCellProps extends HTMLDataAttributes {
    /** Called when the checkbox is clicked */
    onChange?: (event: unknown) => void;
    /** Whether the checkbox is checked */
    checked?: boolean;
    /** Whether the row is indeterminate. Should only be used in header rows. */
    indeterminate?: boolean;
    /** Don't render a checkbox; used for providing spacing in header if you don't want "Select All" functionality */
    noCheckbox?: boolean;
}
export declare const TableRowSelectCell: React.ForwardRefExoticComponent<TableRowSelectCellProps & React.RefAttributes<HTMLDivElement>>;
export interface TableSkeletonProps extends HTMLDataAttributes {
    /** Number of rows to render */
    lines?: number;
    /** Seed that deterministically arranges the uneven lines, so that they look like ragged text.
     * If you don't provide this (or give each skeleton the same seed) they will all look the same. */
    seed?: string;
    /** Style property */
    style?: CSSProperties;
}
export declare const TableSkeleton: React.FC<TableSkeletonProps>;
export interface TableRowActionProps extends HTMLDataAttributes {
    /** Style property */
    style?: CSSProperties;
    /** Child nodes for the table row. Should contain a single small-sized button. */
    children?: React.ReactNode;
    /** Class name property */
    className?: string;
}
export declare const TableRowAction: React.ForwardRefExoticComponent<TableRowActionProps & React.RefAttributes<HTMLDivElement>>;
/** @deprecated Use `TableRowAction` instead */
export declare const TableRowMenuContainer: React.ForwardRefExoticComponent<TableRowActionProps & React.RefAttributes<HTMLDivElement>>;
export interface TableFilterLayoutProps extends HTMLDataAttributes {
    /** Style property */
    style?: CSSProperties;
    /** Should contain the filter controls to be rendered in this layout. */
    children?: React.ReactNode;
    /** Class name property */
    className?: string;
    /** A container to hold action `Button` elements. */
    actions?: React.ReactNode;
}
export declare const TableFilterLayout: React.ForwardRefExoticComponent<TableFilterLayoutProps & React.RefAttributes<HTMLDivElement>>;
interface TableFilterInputProps extends InputProps, HTMLDataAttributes {
    onSubmit?: () => void;
    onClear?: () => void;
    showSearchButton?: boolean;
}
export declare const TableFilterInput: React.ForwardRefExoticComponent<TableFilterInputProps & React.RefAttributes<AntDInput>>;
export {};
//# sourceMappingURL=index.d.ts.map