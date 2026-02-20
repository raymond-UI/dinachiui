"use client"

import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuLabel,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from '@/components/ui/menu';

export function DefaultMenuExample() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent>
        <MenuLabel>My Account</MenuLabel>
        <MenuSeparator />
        <MenuItem>
          Profile
          <MenuShortcut>⌘P</MenuShortcut>
        </MenuItem>
        <MenuItem>
          Settings
          <MenuShortcut>⌘S</MenuShortcut>
        </MenuItem>
        <MenuItem>
          Keyboard Shortcuts
          <MenuShortcut>⌘K</MenuShortcut>
        </MenuItem>
        <MenuSeparator />
        <MenuItem>Log out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

export function MenuWithCheckboxExample() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);

  return (
    <Menu>
      <MenuTrigger>View Options</MenuTrigger>
      <MenuContent>
        <MenuLabel>Appearance</MenuLabel>
        <MenuSeparator />
        <MenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          Show Status Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
          Show Activity Panel
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  );
}

export function MenuWithRadioExample() {
  const [theme, setTheme] = React.useState('system');

  return (
    <Menu>
      <MenuTrigger>Theme</MenuTrigger>
      <MenuContent>
        <MenuLabel>Select Theme</MenuLabel>
        <MenuSeparator />
        <MenuRadioGroup value={theme} onValueChange={setTheme}>
          <MenuRadioItem value="light">Light</MenuRadioItem>
          <MenuRadioItem value="dark">Dark</MenuRadioItem>
          <MenuRadioItem value="system">System</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

export function MenuWithSubmenuExample() {
  return (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem>New File</MenuItem>
        <MenuItem>New Window</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Share</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Email</MenuItem>
            <MenuItem>Messages</MenuItem>
            <MenuItem>Copy Link</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Print</MenuItem>
      </MenuContent>
    </Menu>
  );
}
