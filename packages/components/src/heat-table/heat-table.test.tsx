import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeatTable, heatShade, type HeatRow } from './heat-table';

const columns = ['W1', 'W2', 'W3'];
const rows: HeatRow[] = [
  { label: '14 Sep', meta: '1,334', values: [52, 45, 37] },
  { label: '21 Sep', values: [56, 48] },
  { label: '28 Sep', values: [61] },
];

const cell = (name: string) => screen.getByRole('gridcell', { name });
const shade = (name: string) => cell(name).querySelector<HTMLElement>('[data-slot="heat-table-cell"]')!;

describe('HeatTable', () => {
  it('is a grid with row and column headers, and names each cell by both', () => {
    render(<HeatTable columns={columns} rows={rows} rowHeader="Cohort" format={(v) => `${v}%`} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Cohort', 'W1W1', 'W2W2', 'W3W3']);
    expect(screen.getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['14 Sep1,334', '21 Sep', '28 Sep']);
    expect(cell('14 Sep, W1: 52%')).toBeInTheDocument();
    expect(within(cell('14 Sep, W1: 52%')).getByText('52%')).toBeInTheDocument();
  });

  it('takes a custom cell name', () => {
    render(<HeatTable columns={columns} rows={rows} label={(c) => `${c.row.label} cohort, week ${c.columnIndex + 1}: ${c.value}%`} />);
    expect(cell('14 Sep cohort, week 1: 52%')).toBeInTheDocument();
  });

  it('shades from the lowest value to the highest', () => {
    render(<HeatTable columns={columns} rows={rows} />);
    expect(shade('14 Sep, W3: 37').style.background).toContain('6%');
    expect(shade('28 Sep, W1: 61').style.background).toContain('86%');
    expect(shade('28 Sep, W1: 61').style.color).toBe('var(--primary-foreground)');
    expect(shade('14 Sep, W3: 37').style.color).toBe('var(--card-foreground)');
  });

  it('takes its own min, max and scale', () => {
    const { unmount } = render(<HeatTable columns={columns} rows={rows} min={0} max={100} />);
    expect(shade('14 Sep, W1: 52').style.background).toContain('57%');
    unmount();
    render(<HeatTable columns={columns} rows={rows} scale={() => 0.5} />);
    expect(shade('14 Sep, W1: 52').style.background).toContain('33%');
  });

  it('clamps the shade', () => {
    expect(heatShade(2).background).toContain('86%');
    expect(heatShade(-1).background).toContain('6%');
  });

  it('has one tab stop, and moves with the arrows, skipping blanks', async () => {
    const user = userEvent.setup();
    render(<HeatTable columns={columns} rows={rows} />);
    const tabbable = screen.getAllByRole('gridcell').filter((c) => c.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    await user.tab();
    expect(cell('14 Sep, W1: 52')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(cell('14 Sep, W2: 45')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(cell('21 Sep, W2: 48')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(cell('21 Sep, W2: 48')).toHaveFocus();
    await user.keyboard('{End}');
    expect(cell('21 Sep, W2: 48')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(cell('21 Sep, W1: 56')).toHaveFocus();
    await user.keyboard('{Control>}{End}{/Control}');
    expect(cell('28 Sep, W1: 61')).toHaveFocus();
    await user.keyboard('{Control>}{Home}{/Control}');
    expect(cell('14 Sep, W1: 52')).toHaveFocus();
    expect(cell('14 Sep, W1: 52').tabIndex).toBe(0);
    expect(cell('28 Sep, W1: 61').tabIndex).toBe(-1);
  });

  it('lights the row and column headers of the cell pointed at or focused', async () => {
    const user = userEvent.setup();
    render(<HeatTable columns={columns} rows={rows} />);
    fireEvent.mouseEnter(cell('21 Sep, W2: 48'));
    const active = () => document.querySelectorAll('th[data-active]');
    expect([...active()].map((h) => h.textContent)).toEqual(['W2W2', '21 Sep']);
    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(active()).toHaveLength(0);
    await user.tab();
    expect([...active()].map((h) => h.textContent)).toEqual(['W1W1', '14 Sep1,334']);
  });

  it('adds a footer row', () => {
    render(<HeatTable columns={columns} rows={rows} footer={{ label: 'Average', values: ['56%', '47%', '37%'] }} />);
    const footer = screen.getByRole('rowheader', { name: 'Average' }).closest('tr')!;
    expect(within(footer).getAllByRole('gridcell').map((c) => c.textContent)).toEqual(['56%', '47%', '37%']);
  });

  it('reads the chosen cell out under the grid', async () => {
    const user = userEvent.setup();
    render(
      <HeatTable
        columns={columns}
        rows={rows}
        format={(v) => `${v}%`}
        readout={(c) => `${c.row.label} week ${c.columnIndex + 1}: ${c.value}%`}
      />
    );
    const readout = document.querySelector('[data-slot="heat-table-readout"]')!;
    expect(readout).toHaveAttribute('aria-live', 'polite');
    expect(readout).toHaveTextContent('14 Sep week 1: 52%');
    await user.click(cell('21 Sep, W2: 48%'));
    expect(readout).toHaveTextContent('21 Sep week 2: 48%');
    expect(cell('21 Sep, W2: 48%')).toHaveAttribute('data-selected');
  });

  it('starts on the cell it is given', () => {
    render(<HeatTable columns={columns} rows={rows} defaultCell={{ row: 1, column: 1 }} />);
    expect(cell('21 Sep, W2: 48')).toHaveAttribute('tabindex', '0');
    expect(document.querySelector('[data-slot="heat-table-readout"]')).toHaveTextContent('4821 Sep, W2');
  });

  it('reads out the value and its place by default', () => {
    render(<HeatTable columns={columns} rows={rows} format={(v) => `${v}%`} />);
    expect(document.querySelector('[data-slot="heat-table-readout"]')).toHaveTextContent('52%14 Sep, W1');
  });

  it('skips the middle of the mix, where neither text colour is readable', () => {
    expect(heatShade(0.5)).toEqual({
      background: 'color-mix(in oklab, var(--primary) 33%, var(--card))',
      color: 'var(--card-foreground)',
    });
    expect(heatShade(0.51).background).toContain('57%');
    expect(heatShade(0.51).color).toBe('var(--primary-foreground)');
  });

  it('shades every cell alike when all values are equal, without dividing by zero', () => {
    render(<HeatTable columns={['W1', 'W2']} rows={[{ label: 'A', values: [40, 40] }]} />);
    expect(shade('A, W1: 40').style.background).toContain('86%');
    expect(shade('A, W2: 40').style.background).toContain('86%');
  });

  it('shades a value under an equal min and max lightest', () => {
    render(<HeatTable columns={['W1', 'W2']} rows={[{ label: 'A', values: [10, 50] }]} min={50} max={50} />);
    expect(shade('A, W1: 10').style.background).toContain('6%');
    expect(shade('A, W2: 50').style.background).toContain('86%');
  });

  it('keeps the scale the right way up when max is under the data min', () => {
    render(<HeatTable columns={['W1', 'W2']} rows={[{ label: 'A', values: [60, 80] }]} min={50} max={40} />);
    expect(shade('A, W1: 60').style.background).toContain('86%');
    expect(shade('A, W2: 80').style.background).toContain('86%');
  });

  it('leaves NaN cells blank and out of the keyboard path', async () => {
    const user = userEvent.setup();
    render(<HeatTable columns={['W1', 'W2', 'W3']} rows={[{ label: 'A', values: [NaN, 5, 9] }]} />);
    expect(screen.getAllByRole('gridcell').filter((c) => c.hasAttribute('aria-label'))).toHaveLength(2);
    await user.tab();
    expect(cell('A, W2: 5')).toHaveFocus();
    expect(shade('A, W2: 5').style.background).toContain('6%');
  });

  it('renders an empty grid with no tab stop', () => {
    render(<HeatTable columns={['W1']} rows={[{ label: 'A', values: [null] }]} />);
    expect(screen.getAllByRole('gridcell').filter((c) => c.tabIndex === 0)).toHaveLength(0);
    expect(document.querySelector('[data-slot="heat-table-readout"]')).toBeEmptyDOMElement();
  });

  it('keeps the full column name for screen readers on a phone', () => {
    render(<HeatTable columns={columns} phoneColumns={['1', '2', '3']} rows={rows} />);
    const full = within(screen.getAllByRole('columnheader')[1]).getByText('W1');
    expect(full.className).toContain('max-md:sr-only');
    expect(full.className).not.toContain('max-md:hidden');
    expect(full).not.toHaveAttribute('aria-hidden');
  });

  it('lights a header with a tint, not only the text colour', () => {
    render(<HeatTable columns={columns} rows={rows} />);
    fireEvent.mouseEnter(cell('21 Sep, W2: 48'));
    const head = document.querySelector('th[data-active]')!;
    expect(head.className).toContain('data-[active]:bg-');
  });

  it('runs its own focus, blur and mouse leave handlers beside the ones passed in', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onMouseLeave = vi.fn();
    render(<HeatTable columns={columns} rows={rows} onFocus={onFocus} onMouseLeave={onMouseLeave} />);
    await user.tab();
    expect(onFocus).toHaveBeenCalled();
    expect(document.querySelectorAll('th[data-active]')).toHaveLength(2);
    fireEvent.mouseEnter(cell('21 Sep, W2: 48'));
    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
