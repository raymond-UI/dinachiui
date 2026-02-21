import type { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
};

export function MdxTable({ children }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

type TableHeadProps = {
  children: ReactNode;
};

export function MdxTableHead({ children }: TableHeadProps) {
  return (
    <thead className="border-b border-border bg-muted/50">{children}</thead>
  );
}

type TableBodyProps = {
  children: ReactNode;
};

export function MdxTableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

type TableRowProps = {
  children: ReactNode;
};

export function MdxTableRow({ children }: TableRowProps) {
  return <tr className="transition-colors hover:bg-muted/30">{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
  header?: boolean;
};

export function MdxTableCell({ children, header = false }: TableCellProps) {
  if (header) {
    return (
      <th className="px-4 py-3 text-left font-medium text-foreground">
        {children}
      </th>
    );
  }
  return <td className="px-4 py-3 text-muted-foreground">{children}</td>;
}
