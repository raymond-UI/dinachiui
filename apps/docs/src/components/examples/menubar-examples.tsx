"use client"

import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarGroup,
  MenubarLabel,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@/components/ui/menubar';

export function DefaultMenubarExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Print <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>
                Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Toggle Fullscreen</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}

export function MenubarWithCheckboxExample() {
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Panels</MenubarLabel>
                <MenubarSeparator />
                <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
                  Show Toolbar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                  Show Sidebar
                </MenubarCheckboxItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarItem>Toggle Fullscreen</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}

export function MenubarWithSubmenuExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>project-a.ts</MenubarItem>
                  <MenubarItem>readme.md</MenubarItem>
                  <MenubarItem>config.json</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Save All</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}
