import * as React from "react";
import { cn } from "../../utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
));
Table.displayName = "Table";

const THead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
THead.displayName = "THead";

const TBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TBody.displayName = "TBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-default-300 font-medium [&>tr]:last:border-b-0", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TR = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b transition-colors hover:bg-default-100 data-[state=selected]:bg-default-200", className)} {...props} />
));
TR.displayName = "TR";

const TH = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-10 px-2 text-left align-middle font-medium text-default-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
        )}
        {...props}
    />
));
TH.displayName = "TH";

const TD = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...props} />
));
TD.displayName = "TD";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-default-500", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, THead, TBody, TableFooter, TH, TR, TD, TableCaption };
