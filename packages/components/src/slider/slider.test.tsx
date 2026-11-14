import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb, SliderValue, SliderDirectionProvider } from './slider';

describe('Slider', () => {
  it('renders slider correctly', () => {
    render(
      <Slider data-testid="slider" defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveClass('relative', 'flex', 'w-full', 'flex-col', 'gap-2');
  });

  it('displays value when SliderValue is present', () => {
    render(
      <Slider defaultValue={75}>
        <SliderValue data-testid="slider-value" />
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const sliderValue = screen.getByTestId('slider-value');
    expect(sliderValue).toBeInTheDocument();
    expect(sliderValue).toHaveClass('text-sm', 'font-medium');
  });

  it('handles value changes in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider value={25} onValueChange={onValueChange}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    
    expect(onValueChange).toHaveBeenCalled();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider defaultValue={50} onValueChange={onValueChange}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const thumb = screen.getByRole('slider');
    thumb.focus();
    
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(
      <Slider disabled defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb data-testid="slider-thumb" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const thumb = screen.getByTestId('slider-thumb');
    expect(thumb).toHaveClass('data-[disabled]:pointer-events-none', 'data-[disabled]:opacity-50');
  });

  it('applies custom className', () => {
    render(
      <Slider className="custom-slider" defaultValue={50}>
        <SliderControl className="custom-control">
          <SliderTrack className="custom-track">
            <SliderRange className="custom-range" />
            <SliderThumb className="custom-thumb" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const slider = screen.getByRole('group');
    expect(slider.className).toContain('custom-slider');
  });

  it('supports range slider with multiple values', () => {
    const onValueChange = vi.fn();

    render(
      <Slider defaultValue={[25, 75]} onValueChange={onValueChange}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('supports vertical orientation', () => {
    render(
      <Slider orientation="vertical" defaultValue={50} data-testid="vertical-slider">
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    );

    const slider = screen.getByTestId('vertical-slider');
    expect(slider).toHaveAttribute('data-orientation', 'vertical');
  });

  it('supports RTL direction with DirectionProvider', () => {
    render(
      <div dir="rtl">
        <SliderDirectionProvider direction="rtl">
          <Slider defaultValue={50} data-testid="rtl-slider">
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </SliderDirectionProvider>
      </div>
    );

    const slider = screen.getByTestId('rtl-slider');
    expect(slider).toBeInTheDocument();
    // The DirectionProvider should be working with the slider
    expect(slider.closest('[dir="rtl"]')).toBeInTheDocument();
  });

  it('supports LTR direction with DirectionProvider', () => {
    render(
      <div dir="ltr">
        <SliderDirectionProvider direction="ltr">
          <Slider defaultValue={50} data-testid="ltr-slider">
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </SliderDirectionProvider>
      </div>
    );

    const slider = screen.getByTestId('ltr-slider');
    expect(slider).toBeInTheDocument();
    // The DirectionProvider should be working with the slider
    expect(slider.closest('[dir="ltr"]')).toBeInTheDocument();
  });
}); 
import { AgentProvider, createAgent } from '../agent';
import { agentConformance } from '../test/agent-conformance';
import { SliderLabel } from './slider';

agentConformance({
  name: 'Slider',
  render: ({ onChange, disabled }) => (
    <Slider defaultValue={20} step={5} disabled={disabled} onValueChange={onChange}>
      <SliderLabel>Volume</SliderLabel>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
  label: 'Volume',
  entry: { component: 'slider', value: 20, min: 0, max: 100, step: 5, actions: ['setValue'] },
  act: { action: 'setValue', args: [60], result: { ok: true, value: 60 } },
  person: async (user) => {
    await user.tab();
    await user.keyboard('{ArrowRight}');
  },
  // Base UI's root commits twice on mount on its own.
  commits: 2,
});

agentConformance({
  name: 'Slider (range)',
  render: ({ onChange, disabled }) => (
    <Slider defaultValue={[20, 60]} disabled={disabled} onValueChange={onChange}>
      <SliderLabel>Price</SliderLabel>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
  label: 'Price',
  entry: { component: 'slider', value: [20, 60], min: 0, max: 100 },
  act: { action: 'setValue', args: [[10, 90]], result: { ok: true, value: [10, 90] } },
  person: async (user) => {
    await user.tab();
    await user.keyboard('{ArrowRight}');
  },
  // Base UI's root commits twice on mount on its own.
  commits: 2,
});

describe('Slider: agent values', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    const set = (...args: unknown[]) => agent.act({ steps: [{ ref: 'Level', action: 'setValue', args }] });
    return { agent, set };
  }
  const parts = (thumbs: number) => (
    <>
      <SliderLabel>Level</SliderLabel>
      <SliderControl>
        <SliderTrack>
          {Array.from({ length: thumbs }, (_, i) => <SliderThumb key={i} />)}
        </SliderTrack>
      </SliderControl>
    </>
  );

  it('reports one control, not one per thumb', () => {
    const { agent } = mount(<Slider defaultValue={[20, 60]}>{parts(2)}</Slider>);
    expect(agent.snapshot().filter((c) => c.component === 'slider')).toHaveLength(1);
  });

  it('snaps to the step, counted from min', async () => {
    const { agent, set } = mount(<Slider defaultValue={10} min={10} max={50} step={4}>{parts(1)}</Slider>);
    expect(await set('21')).toMatchObject({ ok: true, steps: [{ value: 22 }] });
    expect(agent.snapshot().find((c) => c.label === 'Level')?.value).toBe(22);
  });

  it('holds a snap that would pass max at max, as Base UI does', async () => {
    const { set } = mount(<Slider defaultValue={0} max={10} step={4}>{parts(1)}</Slider>);
    expect(await set(10)).toMatchObject({ ok: true, steps: [{ value: 10 }] });
  });

  it('rejects values out of range or not numbers', async () => {
    const { set } = mount(<Slider defaultValue={10} min={0} max={50}>{parts(1)}</Slider>);
    expect((await set(51)).error?.message).toMatch(/out of range: 0 to 50/);
    expect((await set(-1)).error?.message).toMatch(/out of range/);
    expect((await set('loud')).error?.message).toMatch(/not a number/);
    expect((await set([10, 20])).error?.message).toMatch(/one number/);
  });

  it('checks the shape and order of a range', async () => {
    const { set } = mount(<Slider defaultValue={[20, 60]}>{parts(2)}</Slider>);
    expect((await set(30)).error?.message).toMatch(/Send 2 numbers/);
    expect((await set([10, 20, 30])).error?.message).toMatch(/Send 2 numbers/);
    expect((await set([70, 30])).error?.message).toMatch(/low to high/);
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = React.useState(30);
      return <Slider value={value} onValueChange={(v) => setValue(v as number)}>{parts(1)}</Slider>;
    }
    const { agent, set } = mount(<Controlled />);
    await set(45);
    expect(agent.snapshot().find((c) => c.label === 'Level')?.value).toBe(45);
  });
});
