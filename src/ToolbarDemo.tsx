import { 
    ToolbarRoot,
    ToolbarButton,
    ToolbarSeparator,
    ToolbarGroup,
    ToolbarInput
  } from "@dinachi/components";
  import { Toggle } from "@dinachi/components/toggle";
  import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
  } from "@dinachi/components";
  import { useState } from "react";
  import { 
    Bold, 
    Italic, 
    Underline, 
    AlignLeft, 
    AlignCenter, 
    AlignRight,
    Search,
    Settings,
    Download,
    Upload,
    Save,
    Share,
    Copy,
    Scissors,
    ClipboardPaste,
    Undo,
    Redo,
    Type,
    Image,
    Link,
    Play,
    Pause,
    SkipBack,
    SkipForward
  } from "lucide-react";
  
  export function ToolbarDemo() {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [alignment, setAlignment] = useState("left");
    const [fontSize, setFontSize] = useState("14");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [playing, setPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
  
    return (
      <div className="space-y-12 p-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Toolbar Demo</h2>
          <p className="text-muted-foreground max-w-2xl">
            A container for grouping a set of buttons and controls. Demonstrates integration
            with Toggle, Select, and other components for building rich toolbars.
          </p>
        </div>
  
        {/* Basic Toolbar */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Basic Toolbar</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <ToolbarButton>Save</ToolbarButton>
              <ToolbarButton>Edit</ToolbarButton>
              <ToolbarButton>Delete</ToolbarButton>
            </ToolbarRoot>
          </div>
        </section>
  
        {/* File Operations Toolbar */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">File Operations</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <ToolbarGroup aria-label="File operations">
                <ToolbarButton aria-label="Save file">
                  <Save className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Upload file">
                  <Upload className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Download file">
                  <Download className="h-4 w-4" />
                </ToolbarButton>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <ToolbarGroup aria-label="Sharing">
                <ToolbarButton aria-label="Share">
                  <Share className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Copy link">
                  <Copy className="h-4 w-4" />
                </ToolbarButton>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <ToolbarButton aria-label="Settings">
                <Settings className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarRoot>
          </div>
        </section>
  
        {/* Text Editor Toolbar with Toggles */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Text Editor with Toggle Integration</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <ToolbarGroup aria-label="Text formatting">
                <Toggle 
                  pressed={bold} 
                  onPressedChange={setBold} 
                  aria-label="Bold"
                  className="h-10 px-3"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle 
                  pressed={italic} 
                  onPressedChange={setItalic} 
                  aria-label="Italic"
                  className="h-10 px-3"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle 
                  pressed={underline} 
                  onPressedChange={setUnderline} 
                  aria-label="Underline"
                  className="h-10 px-3"
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <ToolbarGroup aria-label="Text alignment">
                <Toggle 
                  pressed={alignment === "left"} 
                  onPressedChange={() => setAlignment("left")} 
                  aria-label="Align left"
                  className="h-10 px-3"
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle 
                  pressed={alignment === "center"} 
                  onPressedChange={() => setAlignment("center")} 
                  aria-label="Align center"
                  className="h-10 px-3"
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle 
                  pressed={alignment === "right"} 
                  onPressedChange={() => setAlignment("right")} 
                  aria-label="Align right"
                  className="h-10 px-3"
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-24 h-10">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                  <SelectItem value="24">24px</SelectItem>
                </SelectContent>
              </Select>
            </ToolbarRoot>
            
            {/* Preview */}
            <div className="p-4 border rounded-lg bg-background">
              <p 
                style={{ 
                  fontFamily, 
                  fontSize: `${fontSize}px`,
                  textAlign: alignment as any,
                  fontWeight: bold ? 'bold' : 'normal',
                  fontStyle: italic ? 'italic' : 'normal',
                  textDecoration: underline ? 'underline' : 'none'
                }}
              >
                This text reflects the formatting options above.
              </p>
            </div>
          </div>
        </section>
  
        {/* Media Player Toolbar */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Media Player Controls</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <ToolbarButton aria-label="Previous track">
                <SkipBack className="h-4 w-4" />
              </ToolbarButton>
              
              <Toggle 
                pressed={playing} 
                onPressedChange={setPlaying}
                aria-label={playing ? "Pause" : "Play"}
                className="h-10 px-3"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Toggle>
              
              <ToolbarButton aria-label="Next track">
                <SkipForward className="h-4 w-4" />
              </ToolbarButton>
              
              <ToolbarSeparator />
              
              <Select defaultValue="1.0">
                <SelectTrigger className="w-20 h-10">
                  <SelectValue placeholder="Speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1.0">1.0x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2.0">2.0x</SelectItem>
                </SelectContent>
              </Select>
            </ToolbarRoot>
            
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Media player status: {playing ? "Playing" : "Paused"}
              </p>
            </div>
          </div>
        </section>
  
        {/* Clipboard Operations */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Clipboard Operations</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <ToolbarGroup aria-label="Edit operations">
                <ToolbarButton aria-label="Undo">
                  <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Redo">
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <ToolbarGroup aria-label="Clipboard">
                <ToolbarButton aria-label="Cut">
                  <Scissors className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Copy">
                  <Copy className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Paste">
                  <ClipboardPaste className="h-4 w-4" />
                </ToolbarButton>
              </ToolbarGroup>
              
              <ToolbarSeparator />
              
              <ToolbarGroup aria-label="Insert">
                <ToolbarButton aria-label="Insert text">
                  <Type className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Insert image">
                  <Image className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton aria-label="Insert link">
                  <Link className="h-4 w-4" />
                </ToolbarButton>
              </ToolbarGroup>
            </ToolbarRoot>
          </div>
        </section>
  
        {/* Search Toolbar with Input */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Search Toolbar with Input</h3>
          <div className="space-y-3">
            <ToolbarRoot>
              <Search className="h-4 w-4 text-muted-foreground ml-2" />
              <ToolbarInput 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
              />
              {searchQuery && (
                <>
                  <ToolbarSeparator />
                  <ToolbarButton 
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </ToolbarButton>
                </>
              )}
            </ToolbarRoot>
            
            {searchQuery && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Searching for: "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </section>
  
        {/* Disabled States */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Disabled States</h3>
          <div className="space-y-3">
            <ToolbarRoot disabled>
              <ToolbarButton>Disabled Button</ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton>Another Button</ToolbarButton>
              <ToolbarInput placeholder="Disabled input" />
            </ToolbarRoot>
          </div>
        </section>
  
        {/* Vertical Toolbar */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Vertical Toolbar</h3>
          <div className="space-y-3">
            <ToolbarRoot orientation="vertical" className="w-fit">
              <ToolbarButton aria-label="Save">
                <Save className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton aria-label="Share">
                <Share className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton aria-label="Settings">
                <Settings className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarRoot>
          </div>
        </section>
      </div>
    );
  }