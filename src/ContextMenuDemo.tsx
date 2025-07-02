import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
} from "@dinachi/components";

export default function ContextMenuDemo() {
  const [bookmarksBar, setBookmarksBar] = React.useState(true);
  const [showFullUrls, setShowFullUrls] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Context Menu Examples</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Context Menu */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Context Menu</h3>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
                Right click here for basic menu
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent className="w-64">
                    <ContextMenuItem>
                      Back
                      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem disabled>
                      Forward
                      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Reload
                      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      More Tools
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      Developer Tools
                      <ContextMenuShortcut>F12</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </div>

          {/* Context Menu with Checkboxes */}
          <div>
            <h3 className="text-lg font-semibold mb-2">With Checkbox Items</h3>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
                Right click for checkbox menu
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent>
                    <ContextMenuCheckboxItem 
                      checked={bookmarksBar}
                      onCheckedChange={setBookmarksBar}
                    >
                      Show Bookmarks Bar
                    </ContextMenuCheckboxItem>
                    <ContextMenuCheckboxItem 
                      checked={showFullUrls}
                      onCheckedChange={setShowFullUrls}
                    >
                      Show Full URLs
                    </ContextMenuCheckboxItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      Reload
                      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </div>

          {/* Context Menu with Radio Group */}
          <div>
            <h3 className="text-lg font-semibold mb-2">With Radio Group</h3>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
                Right click for radio menu
                <br />
                <span className="text-xs text-muted-foreground mt-1">
                  Current: {person}
                </span>
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent>
                    <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
                      <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
                      <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
                      <ContextMenuRadioItem value="sarah">Sarah</ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </div>

          {/* Context Menu with Submenu */}
          <div>
            <h3 className="text-lg font-semibold mb-2">With Submenu</h3>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
                Right click for submenu
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent>
                    <ContextMenuItem>
                      Back
                      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Forward
                      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Reload
                      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <ContextMenuItem>Save Page As...</ContextMenuItem>
                        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                        <ContextMenuItem>Name Window...</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Developer Tools</ContextMenuItem>
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      Inspect Element
                      <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </div>
        </div>
      </div>
    </div>
  );
} 