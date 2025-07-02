import { useState } from "react"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarPortal,
  MenubarPositioner,
} from "@dinachi/components"

export default function MenubarDemo() {
  const [showBookmarksBar, setShowBookmarksBar] = useState(true)
  const [showFullUrls, setShowFullUrls] = useState(false)
  const [view, setView] = useState("single")

  const handleMenuClick = (action: string) => {
    console.log(`${action} clicked`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Menubar Demo</h2>
        <p className="text-muted-foreground mb-6">
          A visually persistent menu common in desktop applications that provides access to a consistent set of commands.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Menubar */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Menubar</h3>
          <Menubar className="w-fit">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarPortal>
                <MenubarPositioner>
                  <MenubarContent>
                    <MenubarItem onClick={() => handleMenuClick("New")}>
                      New Tab
                      <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("New Window")}>
                      New Window
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("New Private Window")}>
                      New Private Window
                      <MenubarShortcut>⇧⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Open File")}>
                      Open File...
                      <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Open Location")}>
                      Open Location...
                      <MenubarShortcut>⌘L</MenubarShortcut>
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
                    <MenubarItem disabled>
                      Undo
                      <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>
                      Redo
                      <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Cut")}>
                      Cut
                      <MenubarShortcut>⌘X</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Copy")}>
                      Copy
                      <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Paste")}>
                      Paste
                      <MenubarShortcut>⌘V</MenubarShortcut>
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
                    <MenubarCheckboxItem
                      checked={showBookmarksBar}
                      onCheckedChange={setShowBookmarksBar}
                    >
                      Show Bookmarks Bar
                      <MenubarShortcut>⌘⇧B</MenubarShortcut>
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                      checked={showFullUrls}
                      onCheckedChange={setShowFullUrls}
                    >
                      Show Full URLs
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarRadioGroup value={view} onValueChange={setView}>
                      <MenubarRadioItem value="single">Single Page</MenubarRadioItem>
                      <MenubarRadioItem value="two">Two Pages</MenubarRadioItem>
                      <MenubarRadioItem value="continuous">Continuous</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Reload")}>
                      Reload
                      <MenubarShortcut>⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Force Reload")}>
                      Force Reload
                      <MenubarShortcut>⇧⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Toggle Fullscreen")}>
                      Toggle Fullscreen
                    </MenubarItem>
                  </MenubarContent>
                </MenubarPositioner>
              </MenubarPortal>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Profiles</MenubarTrigger>
              <MenubarPortal>
                <MenubarPositioner>
                  <MenubarContent>
                    <MenubarRadioGroup value="andy">
                      <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                      <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                      <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <MenubarItem inset>Edit...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Add Profile...</MenubarItem>
                  </MenubarContent>
                </MenubarPositioner>
              </MenubarPortal>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Menubar with Submenus */}
        <div>
          <h3 className="text-lg font-semibold mb-3">With Submenus</h3>
          <Menubar className="w-fit">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarPortal>
                <MenubarPositioner>
                  <MenubarContent>
                    <MenubarItem onClick={() => handleMenuClick("New")}>
                      New
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Open")}>
                      Open
                      <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Save")}>
                      Save
                      <MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Recent Files</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>project-1.tsx</MenubarItem>
                        <MenubarItem>project-2.tsx</MenubarItem>
                        <MenubarItem>project-3.tsx</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Clear Recent</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSub>
                      <MenubarSubTrigger>Export</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem onClick={() => handleMenuClick("Export PDF")}>
                          PDF
                        </MenubarItem>
                        <MenubarItem onClick={() => handleMenuClick("Export PNG")}>
                          PNG
                        </MenubarItem>
                        <MenubarItem onClick={() => handleMenuClick("Export SVG")}>
                          SVG
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={() => handleMenuClick("Export All")}>
                          Export All...
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Print")}>
                      Print
                      <MenubarShortcut>⌘P</MenubarShortcut>
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
                    <MenubarItem onClick={() => handleMenuClick("Undo")}>
                      Undo
                      <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuClick("Redo")}>
                      Redo
                      <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Find</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Find...</MenubarItem>
                        <MenubarItem>Find Next</MenubarItem>
                        <MenubarItem>Find Previous</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Replace...</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuClick("Select All")}>
                      Select All
                      <MenubarShortcut>⌘A</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarPositioner>
              </MenubarPortal>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger disabled>Help</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Current State Display */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Current Settings:</h4>
          <ul className="text-sm space-y-1">
            <li>Show Bookmarks Bar: {showBookmarksBar ? "Yes" : "No"}</li>
            <li>Show Full URLs: {showFullUrls ? "Yes" : "No"}</li>
            <li>View Mode: {view}</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            Check the console for menu item click events.
          </p>
        </div>
      </div>
    </div>
  )
} 