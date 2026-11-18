import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent, isAgentChange } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { ComparisonTable, featureDiffers, type ComparisonGroup, type ComparisonPlan } from './comparison-table';

const plans: ComparisonPlan[] = [
  { id: 'starter', name: 'Starter', price: { monthly: '£0', yearly: '£0' }, cta: { label: 'Start free' } },
  {
    id: 'team',
    name: 'Team',
    price: { monthly: '£24', yearly: '£20' },
    per: { monthly: 'a month', yearly: 'a month, billed yearly' },
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: '£79', yearly: '£66' },
    per: { monthly: 'a month', yearly: 'a month, billed yearly' },
    cta: { href: '/signup?plan=business' },
  },
];

const groups: ComparisonGroup[] = [
  {
    label: 'Usage',
    features: [
      { label: 'Projects', values: { starter: '3', team: 'Unlimited', business: 'Unlimited' } },
      { label: 'Bandwidth', values: { starter: '100 GB', team: '1 TB', business: '1 TB' } },
    ],
  },
  {
    label: 'Collaboration',
    features: [
      { label: 'Comments', values: { starter: true, team: true, business: true } },
      { label: 'Single sign-on', values: { team: false, business: true } },
    ],
  },
];

const desktop = () => document.querySelector<HTMLElement>('[data-slot="comparison-table-plans"]')!;
const rowHeaders = () => within(desktop()).getAllByRole('rowheader').map((th) => th.textContent);

describe('ComparisonTable', () => {
  it('puts plans in columns and features in rows, grouped', () => {
    render(<ComparisonTable plans={plans} groups={groups} note="Prices per seat, ex. VAT" />);
    const table = within(desktop()).getByRole('table');
    const columns = within(table).getAllByRole('columnheader').filter((c) => c.getAttribute('scope') === 'col');
    expect(columns.map((c) => c.querySelector('div')?.textContent ?? c.textContent)).toEqual([
      'Prices per seat, ex. VAT',
      'Starter',
      'Team',
      'Business',
    ]);
    expect(rowHeaders()).toEqual(['Projects', 'Bandwidth', 'Comments', 'Single sign-on']);
    const group = within(table).getByText('Usage');
    expect(group).toHaveAttribute('scope', 'colgroup');
    expect(group).toHaveAttribute('colspan', '4');
  });

  it('reads a tick as Included and a dash as Not included', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    const sso = within(desktop()).getByText('Single sign-on').closest('tr')!;
    const values = within(sso).getAllByRole('img').map((el) => el.getAttribute('aria-label'));
    expect(values).toEqual(['Not included', 'Not included', 'Included']);
  });

  it('fills only the highlighted plan, and tints its column', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    const team = within(desktop()).getByRole('button', { name: 'Choose Team' });
    const starter = within(desktop()).getByRole('button', { name: 'Start free, Starter' });
    expect(team.className).toContain('bg-primary');
    expect(starter.className).toContain('border-input');
    expect(within(desktop()).getByRole('link', { name: 'Choose Business' })).toHaveAttribute('href', '/signup?plan=business');
    const projects = within(desktop()).getByText('Projects').closest('tr')!;
    const cells = within(projects).getAllByRole('cell');
    expect(cells[1].className).toContain('color-mix');
    expect(cells[0].className).not.toContain('color-mix');
  });

  it('switches billing, and keeps a period chosen when it is pressed again', async () => {
    const user = userEvent.setup();
    const onBillingChange = vi.fn();
    render(<ComparisonTable plans={plans} groups={groups} onBillingChange={onBillingChange} />);
    const head = desktop().querySelectorAll('[data-slot="comparison-table-price"]')[1];
    expect(head).toHaveTextContent('£24');
    expect(head).toHaveTextContent('a month');
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(onBillingChange).toHaveBeenLastCalledWith('yearly', expect.anything());
    expect(head).toHaveTextContent('£20');
    expect(head).toHaveTextContent('a month, billed yearly');
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(onBillingChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects controlled billing and a cancelled change', async () => {
    const user = userEvent.setup();
    render(<ComparisonTable plans={plans} groups={groups} billing="monthly" onBillingChange={(_, d) => d.cancel()} />);
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('hides features every plan agrees on, and says how many', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ComparisonTable plans={plans} groups={groups} onOnlyDifferencesChange={onChange} />);
    await user.click(screen.getByRole('switch', { name: 'Only differences' }));
    expect(onChange).toHaveBeenLastCalledWith(true, expect.anything());
    expect(rowHeaders()).toEqual(['Projects', 'Bandwidth', 'Single sign-on']);
    expect(screen.getAllByText('1 hidden').length).toBeGreaterThan(0);
  });

  it('drops a group with nothing left to show', () => {
    const same: ComparisonGroup[] = [
      { label: 'Same', features: [{ label: 'Comments', values: { starter: true, team: true, business: true } }] },
      groups[0],
    ];
    render(<ComparisonTable plans={plans} groups={same} defaultOnlyDifferences />);
    expect(within(desktop()).queryByText('Same')).not.toBeInTheDocument();
  });

  it('compares two picked plans on a phone, each feature over its two values', () => {
    render(<ComparisonTable plans={plans} groups={groups} defaultOnlyDifferences />);
    const phone = document.querySelector<HTMLElement>('[data-slot="comparison-table-phone"]')!;
    expect(within(phone).getByRole('combobox', { name: 'First plan' })).toHaveTextContent('Team');
    expect(within(phone).getByRole('combobox', { name: 'Second plan' })).toHaveTextContent('Business');
    // Team and Business agree on Projects, Bandwidth and Comments, so only Single sign-on is left.
    expect(within(phone).getAllByRole('term').map((t) => t.textContent)).toEqual(['Single sign-on']);
    expect(within(phone).getAllByRole('definition').map((d) => d.textContent)).toEqual(['Team: –', 'Business: ']);
  });

  it('falls back to the plan in its place when a picked plan is removed', () => {
    const { rerender } = render(<ComparisonTable plans={plans} groups={groups} defaultOnlyDifferences />);
    const phone = () => document.querySelector<HTMLElement>('[data-slot="comparison-table-phone"]')!;
    const next = [plans[0], { ...plans[2], highlighted: true }];
    rerender(<ComparisonTable plans={next} groups={groups} defaultOnlyDifferences />);
    // Team is gone, so the first picker takes Starter, the plan now first, and the values follow it.
    expect(within(phone()).getByRole('combobox', { name: 'First plan' })).toHaveTextContent('Starter');
    expect(within(phone()).getAllByRole('term').map((t) => t.textContent)).toEqual(['Projects', 'Bandwidth', 'Single sign-on']);
    expect(within(phone()).getAllByRole('definition')[0]).toHaveTextContent('Starter: 3');
  });

  it('names the feature column when there is no note', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    expect(within(desktop()).getAllByRole('columnheader')[0]).toHaveTextContent('Feature');
  });

  it('counts a missing value as not included', () => {
    expect(featureDiffers({ label: 'x', values: { a: false } }, ['a', 'b'])).toBe(false);
    expect(featureDiffers({ label: 'x', values: { a: '1', b: 1 } }, ['a', 'b'])).toBe(false);
    expect(featureDiffers({ label: 'x', values: { a: true } }, ['a', 'b'])).toBe(true);
  });

  it('takes its own billing periods, with prices keyed by them', async () => {
    const user = userEvent.setup();
    const onBillingChange = vi.fn();
    const rooms: ComparisonPlan[] = [
      { id: 'queen', name: 'Queen', price: { flex: '£180', saver: '£150', member: '£160' } },
      { id: 'king', name: 'King', price: { flex: '£220', saver: '£190', member: '£200' } },
    ];
    render(
      <ComparisonTable
        plans={rooms}
        groups={groups}
        billingPeriods={[
          { value: 'flex', label: 'Flexible' },
          { value: 'saver', label: 'Advance saver' },
          { value: 'member', label: 'Member' },
        ]}
        billingLabel="Rate"
        onBillingChange={onBillingChange}
      />
    );
    const group = screen.getByRole('group', { name: 'Rate' });
    expect(within(group).getAllByRole('button').map((b) => b.textContent)).toEqual(['Flexible', 'Advance saver', 'Member']);
    expect(within(desktop()).getByText('£180')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Advance saver' }));
    expect(onBillingChange).toHaveBeenLastCalledWith('saver', expect.anything());
    expect(within(desktop()).getByText('£150')).toBeInTheDocument();
  });

  it('drops the toggle when billing is off, and shows a plain price', () => {
    const rooms: ComparisonPlan[] = [
      { id: 'queen', name: 'Queen', price: '£180', per: 'a night' },
      { id: 'king', name: 'King', price: '£220', per: 'a night' },
    ];
    render(<ComparisonTable plans={rooms} groups={groups} billingPeriods={false} />);
    expect(document.querySelector('[data-slot="comparison-table-billing"]')).toBeNull();
    expect(within(desktop()).getByText('£180')).toBeInTheDocument();
    expect(within(desktop()).getAllByText('a night')).toHaveLength(2);
  });

  it('shows the same plain price for every period', async () => {
    const user = userEvent.setup();
    render(<ComparisonTable plans={[{ ...plans[0], price: '£0' }, plans[1]]} groups={groups} />);
    expect(within(desktop()).getByText('£0')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(within(desktop()).getByText('£0')).toBeInTheDocument();
  });

  it('labels the highlighted plan, on both layouts and to assistive tech', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    const team = within(desktop()).getAllByRole('columnheader').find((c) => c.textContent?.includes('Team'))!;
    expect(team).toHaveTextContent('Recommended');
    expect(team).toHaveAttribute('data-highlighted');
    expect(within(desktop()).getByRole('button', { name: 'Choose Team' })).toHaveAccessibleDescription('Recommended');
    const phone = document.querySelector<HTMLElement>('[data-slot="comparison-table-phone"]')!;
    expect(within(phone).getByText('Recommended')).toBeInTheDocument();
    expect(within(phone).getByRole('combobox', { name: 'First plan' })).toHaveAccessibleDescription('Recommended');
  });

  it('takes a badge of its own, on any plan', () => {
    const next = [plans[0], { ...plans[1], badge: 'Most popular' }, { ...plans[2], badge: 'Best value' }];
    render(<ComparisonTable plans={next} groups={groups} />);
    expect(within(desktop()).getByText('Most popular')).toBeInTheDocument();
    expect(within(desktop()).getByText('Best value')).toBeInTheDocument();
    expect(within(desktop()).queryByText('Recommended')).not.toBeInTheDocument();
  });

  it('names a custom button by its plan too', () => {
    const next = plans.map((p) => ({ ...p, cta: { label: 'Book' } }));
    render(<ComparisonTable plans={next} groups={groups} />);
    expect(within(desktop()).getByRole('button', { name: 'Book, Starter' })).toBeInTheDocument();
    expect(within(desktop()).getByRole('button', { name: 'Book, Team' })).toBeInTheDocument();
  });

  it('drops a plan button with cta false, and the button row when none is left', () => {
    const { rerender } = render(<ComparisonTable plans={[plans[0], { ...plans[1], cta: false }]} groups={groups} />);
    expect(within(desktop()).queryByRole('button', { name: /Team/ })).not.toBeInTheDocument();
    expect(within(desktop()).getByRole('button', { name: 'Start free, Starter' })).toBeInTheDocument();
    rerender(<ComparisonTable plans={plans.map((p) => ({ ...p, cta: false as const }))} groups={groups} />);
    expect(document.querySelectorAll('[data-slot="comparison-table-cta"]')).toHaveLength(0);
    expect(within(desktop()).getAllByRole('row')).toHaveLength(2 + 2 + 4);
  });

  it('keeps prices out of the plan header, in a row of their own so they line up', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    const team = within(desktop()).getAllByRole('columnheader').find((c) => c.textContent?.includes('Team'))!;
    expect(team).not.toHaveTextContent('£24');
    const prices = document.querySelectorAll('[data-slot="comparison-table-price"]');
    expect(prices).toHaveLength(plans.length + 2);
    expect(prices[0].closest('tr')).toBe(prices[1].closest('tr'));
  });

  it('lets a long plan name wrap in the phone picker', () => {
    render(<ComparisonTable plans={plans} groups={groups} />);
    const trigger = screen.getByRole('combobox', { name: 'First plan' });
    expect(trigger.className).not.toContain('line-clamp-1');
    expect(trigger.className).toContain('h-auto');
  });

  it('keys features by position, so a repeated label is fine', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const twice: ComparisonGroup[] = [
      { label: 'Same', features: [{ label: 'Flexible', values: { team: '1' } }, { label: 'Flexible', values: { team: '2' } }] },
      { label: 'Same', features: [{ label: 'Other', values: {} }] },
    ];
    render(<ComparisonTable plans={plans} groups={twice} />);
    expect(rowHeaders()).toEqual(['Flexible', 'Flexible', 'Other']);
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/same key/);
    error.mockRestore();
  });

  it('disables the controls and buttons', () => {
    render(<ComparisonTable plans={plans} groups={groups} disabled />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Yearly' })).toBeDisabled();
    expect(within(desktop()).getByRole('button', { name: 'Choose Team' })).toBeDisabled();
  });
});

agentConformance({
  name: 'ComparisonTable',
  render: ({ onChange, disabled }) => (
    <ComparisonTable plans={plans} groups={groups} disabled={disabled} onBillingChange={onChange} />
  ),
  label: 'Billing',
  entry: { component: 'toggle-group', value: 'Monthly', items: ['Monthly', 'Yearly'], actions: ['setValue'] },
  act: { action: 'setValue', args: ['Yearly'], result: { ok: true, value: 'Yearly' } },
  invalid: { action: 'setValue', args: ['Weekly'], lists: ['Monthly', 'Yearly'] },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
  },
  // The phone layout's two Base UI selects commit four times on mount on their own.
  commits: 4,
});

describe('ComparisonTable: agent', () => {
  function mount() {
    const agent = createAgent();
    const onOnlyDifferencesChange = vi.fn();
    render(
      <AgentProvider agent={agent}>
        <ComparisonTable plans={plans} groups={groups} onOnlyDifferencesChange={onOnlyDifferencesChange} />
      </AgentProvider>
    );
    return { agent, onOnlyDifferencesChange };
  }

  it('lists billing once, not each period', () => {
    const { agent } = mount();
    const labels = agent.snapshot().map((c) => c.label);
    expect(labels.filter((l) => l === 'Billing')).toHaveLength(1);
    expect(labels).not.toContain('Monthly');
  });

  it('lists no billing when there is no toggle', () => {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <ComparisonTable plans={plans.map((p) => ({ ...p, price: '£1' }))} groups={groups} billingPeriods={false} />
      </AgentProvider>
    );
    expect(agent.snapshot().map((c) => c.label)).not.toContain('Billing');
  });

  it('names the billing control by its label', async () => {
    const agent = createAgent();
    const onBillingChange = vi.fn();
    render(
      <AgentProvider agent={agent}>
        <ComparisonTable
          plans={plans}
          groups={groups}
          billingLabel="Rate"
          billingPeriods={[
            { value: 'flex', label: 'Flexible' },
            { value: 'saver', label: 'Advance saver' },
          ]}
          onBillingChange={onBillingChange}
        />
      </AgentProvider>
    );
    expect(agent.snapshot().find((c) => c.label === 'Rate')).toMatchObject({ value: 'Flexible', items: ['Flexible', 'Advance saver'] });
    const result = await agent.act({ steps: [{ ref: 'Rate', action: 'setValue', args: ['Advance saver'] }] });
    expect(result.ok).toBe(true);
    expect(onBillingChange).toHaveBeenLastCalledWith('saver', expect.anything());
  });

  it('flips Only differences as a switch', async () => {
    const { agent, onOnlyDifferencesChange } = mount();
    expect(agent.snapshot().find((c) => c.label === 'Only differences')).toMatchObject({ component: 'switch', checked: false });
    const result = await agent.act({ steps: [{ ref: 'Only differences', action: 'setChecked', args: [true] }] });
    expect(result.ok).toBe(true);
    expect(isAgentChange(onOnlyDifferencesChange.mock.calls[0][1])).toBe(true);
    expect(rowHeaders()).toEqual(['Projects', 'Bandwidth', 'Single sign-on']);
  });

  it('shows the agent only the layout on screen', () => {
    const { agent } = mount();
    // The test window is narrow, so the phone layout is the one on screen.
    const labels = agent.snapshot().map((c) => c.label);
    expect(labels).toContain('First plan');
    expect(labels).not.toContain('Start free');
    expect(desktop()).toHaveAttribute('data-agent-hidden');
  });
});
