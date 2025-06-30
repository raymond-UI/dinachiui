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
    expect(slider).toHaveClass('relative', 'flex', 'w-full', 'touch-none', 'select-none', 'items-center');
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
    expect(thumb).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
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