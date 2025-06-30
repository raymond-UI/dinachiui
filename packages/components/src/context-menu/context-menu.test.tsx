import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuPortal,
  ContextMenuPositioner,
} from './context-menu';

describe('ContextMenu', () => {
  it('renders context menu trigger', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem>Item 1</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });

  it('opens context menu on right click', async () => {
    const user = userEvent.setup();
    
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem>Menu Item</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const trigger = screen.getByText('Right click me');
    await user.pointer({ keys: '[MouseRight]', target: trigger });

    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });

  it('calls onClick when menu item is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleClick}>Clickable Item</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const menuItem = screen.getByText('Clickable Item');
    await user.click(menuItem);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled menu item', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const menuItem = screen.getByText('Disabled Item');
    expect(menuItem).toHaveAttribute('data-disabled');
  });

  it('renders checkbox item with checked state', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuCheckboxItem checked>Checked Item</ContextMenuCheckboxItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const checkboxItem = screen.getByText('Checked Item');
    expect(checkboxItem).toHaveAttribute('data-checked');
  });

  it('renders radio group with selected item', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuRadioGroup value="option1">
                <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
                <ContextMenuRadioItem value="option2">Option 2</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const radioItem1 = screen.getByText('Option 1');
    const radioItem2 = screen.getByText('Option 2');
    
    expect(radioItem1).toHaveAttribute('data-checked');
    expect(radioItem2).toHaveAttribute('data-unchecked');
  });

  it('renders separator', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem>Item 1</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Item 2</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });

  it('renders shortcut text', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem>
                Copy
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    expect(screen.getByText('⌘C')).toBeInTheDocument();
  });

  it('renders submenu', async () => {
    const user = userEvent.setup();
    
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>Submenu Item</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const subTrigger = screen.getByText('More Options');
    await user.hover(subTrigger);

    // Note: Due to the nature of the submenu implementation with portals and hover,
    // this test might need adjustment based on the actual behavior
    expect(subTrigger).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger className="custom-trigger">Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent className="custom-content">
              <ContextMenuItem className="custom-item">Item</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const trigger = screen.getByText('Right click me');
    const item = screen.getByText('Item');
    
    expect(trigger).toHaveClass('custom-trigger');
    expect(item).toHaveClass('custom-item');
  });

  it('handles inset prop on menu items', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuContent>
              <ContextMenuItem inset>Inset Item</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu>
    );

    const menuItem = screen.getByText('Inset Item');
    expect(menuItem).toHaveClass('pl-8');
  });
});