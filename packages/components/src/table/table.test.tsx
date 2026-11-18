import { render, screen, within } from '@testing-library/react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';

function Invoice(props: React.ComponentProps<typeof Table>) {
  return (
    <Table {...props}>
      <TableCaption>Invoice 2048</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell stack="title">Linen shirt</TableCell>
          <TableCell numeric stack="value">£128.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell stack="title">Wool scarf</TableCell>
          <TableCell numeric stack="value">£38.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell numeric>£166.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table', () => {
  it('renders a native table named by its caption, inside a scroll container', () => {
    const { container } = render(<Invoice />);
    const table = screen.getByRole('table', { name: 'Invoice 2048' });
    expect(table.tagName).toBe('TABLE');
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(4);
    const slots = new Set(Array.from(container.querySelectorAll('[data-slot]'), (el) => el.getAttribute('data-slot')));
    expect([...slots].sort()).toEqual(
      ['table', 'table-body', 'table-caption', 'table-cell', 'table-container', 'table-footer', 'table-head', 'table-header', 'table-row'].sort()
    );
  });

  it('right-aligns numeric heads and cells in tabular figures', () => {
    render(<Invoice />);
    const head = screen.getByRole('columnheader', { name: 'Amount' });
    expect(head).toHaveClass('text-right', 'tabular-nums');
    expect(head).toHaveAttribute('data-numeric');
    expect(screen.getByRole('cell', { name: '£128.00' })).toHaveClass('text-right', 'tabular-nums');
    expect(screen.getByRole('cell', { name: 'Linen shirt' })).not.toHaveClass('text-right');
  });

  it('gives column heads col scope', () => {
    render(<Invoice />);
    expect(screen.getByRole('columnheader', { name: 'Item' })).toHaveAttribute('scope', 'col');
  });

  it('sets density and dividers', () => {
    const { rerender } = render(<Invoice />);
    const cell = () => screen.getByRole('cell', { name: 'Linen shirt' });
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'comfortable');
    expect(cell()).toHaveClass('h-12', 'border-b');
    rerender(<Invoice density="compact" dividers="none" />);
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'compact');
    expect(screen.getByRole('table')).toHaveAttribute('data-dividers', 'none');
    expect(cell()).toHaveClass('h-9');
    expect(cell()).not.toHaveClass('border-b');
  });

  it('keeps footer cells out of the body dividers', () => {
    render(<Invoice />);
    expect(screen.getByRole('cell', { name: 'Total' })).not.toHaveClass('border-b');
  });

  it('places cells by their role when stacked, and keeps the table semantics', () => {
    render(<Invoice stack />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('data-stack');
    expect(table).toHaveAttribute('role', 'table');
    const [, row] = screen.getAllByRole('row');
    expect(row).toHaveClass('max-md:flex');
    expect(within(row).getByRole('cell', { name: 'Linen shirt' })).toHaveAttribute('data-stack', 'title');
    expect(within(row).getByRole('cell', { name: 'Linen shirt' })).toHaveClass('max-md:order-1');
    expect(within(row).getByRole('cell', { name: '£128.00' })).toHaveClass('max-md:order-2');
    expect(table.parentElement).toHaveClass('max-md:overflow-visible');
  });

  it('places a row header as the title when stacked', () => {
    render(
      <Table stack>
        <TableBody>
          <TableRow>
            <TableHead>Linen shirt</TableHead>
            <TableCell numeric stack="value">£128.00</TableCell>
            <TableCell>Sand, L</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const head = screen.getByRole('rowheader', { name: 'Linen shirt' });
    expect(head).toHaveAttribute('scope', 'row');
    expect(head).toHaveAttribute('data-stack', 'title');
    expect(head).toHaveClass('max-md:order-1');
    expect(screen.getByRole('cell', { name: 'Sand, L' })).toHaveAttribute('data-stack', 'meta');
  });

  it('rules off the total only when other footer rows sit above it', () => {
    render(<Invoice stack />);
    const footer = screen.getByText('Total').closest('tfoot');
    expect(footer?.className).toContain('max-md:[&>tr:last-child:not(:first-child)]:border-t');
    expect(footer?.className).not.toMatch(/max-md:\[&>tr:last-child\]:border-t/);
  });

  it('leaves stacking classes off when not stacked', () => {
    render(<Invoice />);
    expect(screen.getByRole('table')).not.toHaveAttribute('role');
    expect(screen.getByRole('cell', { name: 'Linen shirt' })).not.toHaveAttribute('data-stack');
    expect(screen.getAllByRole('row')[1].className).not.toContain('max-md:');
  });

  it('forwards refs and merges classes', () => {
    const ref = { current: null as HTMLTableElement | null };
    render(<Table ref={ref} className="custom" containerClassName="outer"><tbody /></Table>);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toHaveClass('custom', 'w-full');
    expect(ref.current?.parentElement).toHaveClass('outer');
  });
});
