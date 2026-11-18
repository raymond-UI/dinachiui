import * as React from 'react';
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
    expect(screen.getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['14 Sep, 1,334', '21 Sep', '28 Sep']);
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
    fireEvent.mouseOver(cell('21 Sep, W2: 48'));
    const active = () => document.querySelectorAll('th[data-active]');
    expect([...active()].map((h) => h.textContent)).toEqual(['W2W2', '21 Sep']);
    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(active()).toHaveLength(0);
    await user.tab();
    expect([...active()].map((h) => h.textContent)).toEqual(['W1W1', '14 Sep, 1,334']);
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
    fireEvent.mouseOver(cell('21 Sep, W2: 48'));
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
    fireEvent.mouseOver(cell('21 Sep, W2: 48'));
    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('names a row by its label and meta with a pause between them', () => {
    render(<HeatTable columns={columns} rows={rows} />);
    expect(screen.getByRole('rowheader', { name: '14 Sep, 1,334' })).toBeInTheDocument();
  });

  it('marks the chosen cell aria-selected', async () => {
    const user = userEvent.setup();
    render(<HeatTable columns={columns} rows={rows} />);
    expect(cell('14 Sep, W1: 52')).toHaveAttribute('aria-selected', 'true');
    expect(cell('14 Sep, W2: 45')).toHaveAttribute('aria-selected', 'false');
    await user.click(cell('21 Sep, W2: 48'));
    expect(cell('21 Sep, W2: 48')).toHaveAttribute('aria-selected', 'true');
    expect(cell('14 Sep, W1: 52')).toHaveAttribute('aria-selected', 'false');
  });

  it('keeps blank cells the size of a filled one', () => {
    render(<HeatTable columns={columns} rows={rows} />);
    const blank = screen.getAllByRole('gridcell').find((c) => !c.hasAttribute('aria-label'))!;
    expect(blank.querySelector('[data-slot="heat-table-blank"]')).toHaveClass('w-[var(--heat-table-cell-width)]');
  });

  it('finds its own range past the argument limit of Math.min', () => {
    const many: HeatRow[] = Array.from({ length: 1500 }, (_, r) => ({ label: `R${r}`, values: Array.from({ length: 100 }, (_, c) => r * 100 + c) }));
    const values = many.flatMap((r) => r.values as number[]);
    // 150k values: spreading them into Math.min overflows the stack.
    expect(values.length).toBe(150000);
    render(<HeatTable columns={Array.from({ length: 100 }, (_, c) => `C${c}`)} rows={many} virtualize maxHeight={200} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('reports the cell pointed at, focused and clicked', async () => {
    const user = userEvent.setup();
    const onCellHover = vi.fn();
    const onCellFocus = vi.fn();
    const onCellClick = vi.fn();
    render(<HeatTable columns={columns} rows={rows} onCellHover={onCellHover} onCellFocus={onCellFocus} onCellClick={onCellClick} />);
    fireEvent.mouseOver(cell('21 Sep, W2: 48'));
    expect(onCellHover).toHaveBeenLastCalledWith(expect.objectContaining({ rowIndex: 1, columnIndex: 1, value: 48, column: 'W2' }));
    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(onCellHover).toHaveBeenLastCalledWith(null);
    await user.click(cell('28 Sep, W1: 61'));
    expect(onCellClick).toHaveBeenLastCalledWith(expect.objectContaining({ rowIndex: 2, columnIndex: 0 }), expect.anything());
    expect(onCellFocus).toHaveBeenLastCalledWith(expect.objectContaining({ rowIndex: 2, columnIndex: 0 }));
  });

  it('does not render the other rows again when the pointer or the chosen cell moves', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    const counted = rows.map((row) => ({ ...row }));
    render(
      <HeatTable
        columns={columns}
        rows={counted}
        format={(v, c) => {
          seen.push(c.row.label);
          return String(v);
        }}
      />
    );
    seen.length = 0;
    fireEvent.mouseOver(cell('21 Sep, W2: 48'));
    expect(seen).toEqual([]);
    await user.click(cell('21 Sep, W2: 48'));
    // Only the row losing the choice and the row gaining it draw again.
    expect(new Set(seen)).toEqual(new Set(['14 Sep', '21 Sep']));
  });

  it('names columns apart from what they print, and groups them', () => {
    render(
      <HeatTable
        columns={['30', '31', '1']}
        columnLabels={['Mon 30 Nov', 'Tue 1 Dec', 'Wed 2 Dec']}
        columnGroups={[{ label: 'November', span: 2 }, { label: 'December', span: 1 }]}
        rows={[{ label: 'A', values: [1, 2, 3] }]}
      />
    );
    expect(screen.getByRole('columnheader', { name: 'November' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Tue 1 Dec' })).toBeInTheDocument();
    expect(cell('A, Wed 2 Dec: 3')).toBeInTheDocument();
  });

  it('sizes cells by density', () => {
    render(<HeatTable columns={columns} rows={rows} density="compact" />);
    const root = document.querySelector<HTMLElement>('[data-slot="heat-table"]')!;
    expect(root).toHaveAttribute('data-density', 'compact');
    expect(root.style.getPropertyValue('--heat-table-cell-height')).toBe('26px');
  });

  it('scrolls inside its own container, with the classes and ref passed to it', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<HeatTable columns={columns} rows={rows} maxHeight={300} containerClassName="my-scroll" containerRef={ref} />);
    const container = document.querySelector<HTMLElement>('[data-slot="table-container"]')!;
    expect(container).toBe(ref.current);
    expect(container).toHaveClass('my-scroll');
    expect(container).toHaveClass('max-h-[var(--heat-table-max-height)]');
    expect(document.querySelector<HTMLElement>('[data-slot="heat-table"]')!.style.getPropertyValue('--heat-table-max-height')).toBe('300px');
    expect(screen.getByRole('grid').querySelector('thead')).toHaveClass('md:sticky');
  });

  it('renders only the rows in view when virtualized, and keeps the keyboard moving past them', async () => {
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
    const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400 * 41);
    // jsdom has no scrolling, so this one moves scrollTop and says so.
    const scrollTo = vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
      this.scrollTop = options.top ?? 0;
      this.dispatchEvent(new Event('scroll'));
    });
    HTMLElement.prototype.scrollTo = scrollTo as unknown as typeof HTMLElement.prototype.scrollTo;
    try {
      const many: HeatRow[] = Array.from({ length: 400 }, (_, r) => ({ label: `R${r}`, values: [r, r + 1] }));
      render(<HeatTable columns={['A', 'B']} rows={many} virtualize maxHeight={200} />);
      const drawn = screen.getAllByRole('rowheader').length;
      expect(drawn).toBeGreaterThan(3);
      expect(drawn).toBeLessThan(60);
      expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '401');
      cell('R0, A: 0').focus();
      fireEvent.keyDown(cell('R0, A: 0'), { key: 'End', ctrlKey: true });
      expect(await screen.findByRole('gridcell', { name: 'R399, B: 400' })).toHaveFocus();
    } finally {
      height.mockRestore();
      scrollHeight.mockRestore();
      delete (HTMLElement.prototype as { scrollTo?: unknown }).scrollTo;
    }
  });

  it('scrolls sideways on a phone once the columns would not fit as squares', () => {
    const wide = Array.from({ length: 30 }, (_, c) => `D${c}`);
    render(<HeatTable columns={wide} rows={[{ label: 'A', values: wide.map((_, c) => c) }]} />);
    expect(screen.getByRole('grid')).not.toHaveClass('max-md:table-fixed');
    expect(document.querySelector('[data-slot="table-container"]')).not.toHaveClass('max-md:overflow-visible');
  });
});
