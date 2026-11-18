import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProvider, createAgent, isAgentChange } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { DetailList, DetailListDetails, DetailListItem, DetailListTerm, type DetailListItemProps } from './detail-list';

const ADDRESS = 'Flat 4, 21 Elgin Crescent\nLondon W11 2JD\nUnited Kingdom';

function Order(props: { email?: Partial<DetailListItemProps>; layout?: 'side' | 'stacked'; note?: Partial<DetailListItemProps> }) {
  return (
    <DetailList layout={props.layout}>
      <DetailListItem>
        <DetailListTerm>Customer</DetailListTerm>
        <DetailListDetails>Ada Okafor</DetailListDetails>
      </DetailListItem>
      <DetailListItem copyable editable defaultValue="ada.okafor@fastmail.com" {...props.email}>
        <DetailListTerm>Email</DetailListTerm>
        <DetailListDetails />
      </DetailListItem>
      <DetailListItem copyable editable multiline defaultValue={ADDRESS}>
        <DetailListTerm>Delivery to</DetailListTerm>
        <DetailListDetails />
      </DetailListItem>
      <DetailListItem editable multiline defaultValue="Leave with the concierge if no one answers." {...props.note}>
        <DetailListTerm>Note</DetailListTerm>
        <DetailListDetails />
      </DetailListItem>
      <DetailListItem copyable defaultValue="ord_8f2kq4821">
        <DetailListTerm>Order ID</DetailListTerm>
        <DetailListDetails>{(v) => <code>{v}</code>}</DetailListDetails>
      </DetailListItem>
    </DetailList>
  );
}

const valueOf = (term: string) => screen.getByText(term, { selector: 'dt' }).nextElementSibling!;

describe('DetailList', () => {
  it('is a dl of terms and details', () => {
    render(<Order />);
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Customer', 'Email', 'Delivery to', 'Note', 'Order ID']);
    expect(valueOf('Customer')).toHaveTextContent('Ada Okafor');
    expect(valueOf('Order ID').querySelector('code')).toHaveTextContent('ord_8f2kq4821');
    expect(document.querySelector('[data-slot="detail-list"]')).toHaveAttribute('data-layout', 'side');
  });

  it('names its buttons by the row, and gives read-only rows none', () => {
    render(<Order />);
    expect(screen.getByRole('button', { name: 'Copy Email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Email' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit Order ID' })).not.toBeInTheDocument();
    expect(within(valueOf('Customer') as HTMLElement).queryByRole('button')).not.toBeInTheDocument();
  });

  it('copies the value, swaps the icon and says so politely', async () => {
    const user = userEvent.setup();
    render(<Order />);
    await user.click(screen.getByRole('button', { name: 'Copy Delivery to' }));
    expect(await navigator.clipboard.readText()).toBe(ADDRESS);
    const live = valueOf('Delivery to').querySelector('[aria-live="polite"]');
    expect(live).toHaveTextContent('Copied');
    expect(screen.getByRole('button', { name: 'Copy Delivery to' }).querySelector('.lucide-check')).not.toBeNull();
  });

  it('says so when the clipboard refuses the write', async () => {
    const user = userEvent.setup();
    render(<Order />);
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    await user.click(screen.getByRole('button', { name: 'Copy Email' }));
    const live = valueOf('Email').querySelector('[aria-live="polite"]');
    expect(live).toHaveTextContent('Could not copy');
    expect(screen.getByRole('button', { name: 'Copy Email' }).querySelector('.lucide-check')).toBeNull();
    spy.mockRestore();
  });

  it('says so when there is no clipboard at all', async () => {
    const user = userEvent.setup();
    render(<Order />);
    const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    try {
      await user.click(screen.getByRole('button', { name: 'Copy Email' }));
      expect(valueOf('Email').querySelector('[aria-live="polite"]')).toHaveTextContent('Could not copy');
    } finally {
      if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard);
      else delete (navigator as { clipboard?: unknown }).clipboard;
    }
  });

  it('does not save on the Enter that confirms an input method word', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Order email={{ onValueChange }} />);
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    const field = screen.getByRole('textbox', { name: 'Email' });
    await user.type(field, 'x');
    fireEvent.keyDown(field, { key: 'Enter', isComposing: true });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field).toBeInTheDocument();
  });

  it('edits in place: Enter saves, flashes the row and returns focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Order email={{ onValueChange }} />);
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    const field = screen.getByRole('textbox', { name: 'Email' });
    expect(field).toHaveFocus();
    await user.clear(field);
    await user.type(field, 'ada@okafor.dev{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('ada@okafor.dev', expect.objectContaining({ reason: 'none' }));
    expect(valueOf('Email')).toHaveTextContent('ada@okafor.dev');
    expect(screen.getByText('Email', { selector: 'dt' }).parentElement).toHaveAttribute('data-saved');
    expect(screen.getByRole('button', { name: 'Edit Email' })).toHaveFocus();
  });

  it('cancels on Escape and puts the old value back', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Order email={{ onValueChange }} />);
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'zzz{Escape}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(valueOf('Email')).toHaveTextContent('ada.okafor@fastmail.com');
    expect(screen.getByRole('button', { name: 'Edit Email' })).toHaveFocus();
  });

  it('keeps Enter for new lines in a multiline field, and saves on Cmd or Ctrl and Enter', async () => {
    const user = userEvent.setup();
    render(<Order />);
    await user.click(screen.getByRole('button', { name: 'Edit Note' }));
    const field = screen.getByRole('textbox', { name: 'Note' });
    await user.type(field, '{Enter}Ring twice.');
    expect(field).toBeInTheDocument();
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(valueOf('Note').textContent).toContain('answers.\nRing twice.');
  });

  it('shows a refused value under the field and keeps editing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Order email={{ onValueChange, validate: (v) => (v.includes('@') ? undefined : 'Enter an email address.') }} />);
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    const field = screen.getByRole('textbox', { name: 'Email' });
    await user.clear(field);
    await user.type(field, 'nope{Enter}');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Enter an email address.');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an email address.');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps a controlled value when the change is cancelled', async () => {
    const user = userEvent.setup();
    render(<Order email={{ value: 'ada.okafor@fastmail.com', onValueChange: (_, d) => d.cancel() }} />);
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    const field = screen.getByRole('textbox', { name: 'Email' });
    await user.type(field, 'x{Enter}');
    expect(screen.getByText('The app refused the change.')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(valueOf('Email')).toHaveTextContent('ada.okafor@fastmail.com');
  });

  it('blocks editing when disabled, and still copies', () => {
    render(<Order email={{ disabled: true }} />);
    expect(screen.getByRole('button', { name: 'Edit Email' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Copy Email' })).toBeEnabled();
  });

  it('stacks labels above values when asked', () => {
    render(<Order layout="stacked" />);
    const row = screen.getByText('Email', { selector: 'dt' }).parentElement!;
    expect(row.className).not.toContain('md:grid-cols');
  });
});

agentConformance({
  name: 'DetailList',
  render: ({ onChange, disabled }) => (
    <DetailList>
      <DetailListItem editable defaultValue="ada.okafor@fastmail.com" disabled={disabled} onValueChange={onChange}>
        <DetailListTerm>Email</DetailListTerm>
        <DetailListDetails />
      </DetailListItem>
    </DetailList>
  ),
  label: 'Email',
  entry: { component: 'input', value: 'ada.okafor@fastmail.com', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['ada@okafor.dev'], result: { ok: true, value: 'ada@okafor.dev' } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Edit Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'x{Enter}');
  },
});

describe('DetailList: agent', () => {
  function mount(note: Partial<DetailListItemProps> = {}) {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <Order note={note} email={{ validate: (v) => (v.includes('@') ? undefined : 'Enter an email address.') }} />
      </AgentProvider>
    );
    return agent;
  }

  it('lists each editable row once, as a field named by its term', () => {
    const agent = mount();
    const snapshot = agent.snapshot();
    expect(snapshot.find((c) => c.label === 'Delivery to')).toMatchObject({ component: 'textarea', value: ADDRESS });
    expect(snapshot.find((c) => c.label === 'Note')).toMatchObject({ component: 'textarea' });
    expect(snapshot.map((c) => c.label)).not.toContain('Edit Email');
    expect(snapshot.map((c) => c.label)).not.toContain('Order ID');
  });

  it('sends a refused value back as the message', async () => {
    const agent = mount();
    const result = await agent.act({ steps: [{ ref: 'Email', action: 'setValue', args: ['nope'] }] });
    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('Enter an email address.');
    expect(valueOf('Email')).toHaveTextContent('ada.okafor@fastmail.com');
  });

  it('marks its change as the agent\'s and flashes the row', async () => {
    const onValueChange = vi.fn();
    const agent = mount({ onValueChange });
    await agent.act({ steps: [{ ref: 'Note', action: 'setValue', args: ['Ring twice.'] }] });
    expect(isAgentChange(onValueChange.mock.calls[0][1])).toBe(true);
    expect(valueOf('Note')).toHaveTextContent('Ring twice.');
    expect(screen.getByText('Note', { selector: 'dt' }).parentElement).toHaveAttribute('data-saved');
  });

  it('leaves a row alone while a person is editing it', async () => {
    const user = userEvent.setup();
    const agent = mount();
    await user.click(screen.getByRole('button', { name: 'Edit Note' }));
    const result = await agent.act({ steps: [{ ref: 'Note', action: 'setValue', args: ['Ring twice.'] }] });
    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('A person is editing this row.');
    expect(agent.snapshot().filter((c) => c.label === 'Note')).toHaveLength(1);
  });

  it('clears a row through validate, like setValue', async () => {
    const agent = mount();
    expect(agent.snapshot().find((c) => c.label === 'Email')?.actions).toEqual(['setValue', 'clear']);
    const refused = await agent.act({ steps: [{ ref: 'Email', action: 'clear' }] });
    expect(refused.error?.message).toContain('Enter an email address.');
    const cleared = await agent.act({ steps: [{ ref: 'Note', action: 'clear' }] });
    expect(cleared.ok).toBe(true);
    expect(valueOf('Note').firstElementChild).toBeEmptyDOMElement();
  });
});
