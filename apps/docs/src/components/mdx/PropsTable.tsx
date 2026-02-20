type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

type PropsTableProps = {
  props: Prop[];
};

export function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) return null;

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Prop
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {props.map((prop) => (
            <tr
              key={prop.name}
              className="transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-mono text-xs text-foreground">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {prop.default ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
