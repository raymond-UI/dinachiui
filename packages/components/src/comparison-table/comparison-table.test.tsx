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
    const starter = within(desktop()).getByRole('button', { name: 'Start free' });
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
    const head = within(desktop()).getAllByRole('columnheader')[2];
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

  it('counts a missing value as not included', () => {
    expect(featureDiffers({ label: 'x', values: { a: false } }, ['a', 'b'])).toBe(false);
    expect(featureDiffers({ label: 'x', values: { a: '1', b: 1 } }, ['a', 'b'])).toBe(false);
    expect(featureDiffers({ label: 'x', values: { a: true } }, ['a', 'b'])).toBe(true);
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
