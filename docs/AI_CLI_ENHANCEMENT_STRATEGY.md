6# AI-Enhanced CLI Strategy for Dinachi UI

> A comprehensive plan for integrating AI capabilities into the Dinachi UI CLI to provide intelligent, context-aware project initialization and component management.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current CLI Limitations](#current-cli-limitations)
3. [AI Enhancement Opportunities](#ai-enhancement-opportunities)
4. [Implementation Phases](#implementation-phases)
5. [Technical Architecture](#technical-architecture)
6. [AI Features Deep Dive](#ai-features-deep-dive)
7. [MCP Integration](#mcp-integration)
8. [Example Interactions](#example-interactions)
9. [Security & Privacy](#security--privacy)
10. [Roadmap](#roadmap)

---

## Executive Summary

The Dinachi UI CLI currently provides basic project detection and component installation. By integrating AI capabilities, we can transform the CLI into an intelligent assistant that:

- **Understands project context** deeply (architecture, patterns, existing components)
- **Recommends components** based on actual project needs
- **Generates customized code** that matches project conventions
- **Resolves issues** with intelligent error handling
- **Provides conversational guidance** for complex decisions

---

## Current CLI Limitations

### What We Have Now

```typescript
// Current init.ts - Basic framework detection
function detectProjectType(): ProjectConfig {
  // Detects: next.js, vite, create-react-app, remix, generic react
  // Returns: static paths and configurations
}
```

### Pain Points

| Issue | Impact |
|-------|--------|
| **Static Detection** | Only checks `package.json` for framework |
| **No Codebase Analysis** | Doesn't understand existing patterns |
| **Generic Recommendations** | Same components suggested for all projects |
| **Manual Configuration** | Users must know what paths to use |
| **No Error Context** | Errors lack intelligent resolution guidance |
| **One-Size-Fits-All** | Doesn't adapt to project conventions |

---

## AI Enhancement Opportunities

### 1. 🧠 Intelligent Project Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI PROJECT ANALYZER                           │
├─────────────────────────────────────────────────────────────────┤
│  Input: Project Directory                                        │
│                                                                  │
│  Analyzes:                                                       │
│  ├── package.json (deps, scripts, type)                         │
│  ├── tsconfig.json / jsconfig.json (paths, aliases)             │
│  ├── tailwind.config.* (theme, plugins, content paths)          │
│  ├── next.config.* / vite.config.* (framework settings)         │
│  ├── src/ or app/ structure (component organization)            │
│  ├── Existing UI components (patterns, naming conventions)      │
│  └── Import patterns (barrel exports, default/named)            │
│                                                                  │
│  Output: ProjectContext object with recommendations              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. 💬 Conversational CLI Mode

```bash
$ dinachi init --ai

🤖 Dinachi AI: I've analyzed your Next.js 14 project. Here's what I found:

   📁 Structure: App Router with src/ directory
   🎨 Styling: Tailwind CSS v3.4 with custom theme
   📦 UI: You have 3 shadcn components already installed
   🔧 Patterns: Using barrel exports, PascalCase components

   Based on your existing auth pages, I recommend starting with:
   • Button (you're using raw <button> tags)
   • Input + Field (for your login/signup forms)
   • Toast (for form feedback)

   Should I install these? (Y/n)
```

### 3. 🎯 Smart Component Recommendations

| Project Context | AI Recommendation |
|-----------------|-------------------|
| Auth pages detected | Button, Input, Field, Form, Toast |
| Dashboard layout | Sidebar, Tabs, Avatar, Select |
| E-commerce patterns | Dialog, Toast, Accordion, Checkbox |
| Landing page | NavigationMenu, Button, Accordion |
| Admin panel | Menubar, Table, Dialog, Select |

### 4. 🔧 Adaptive Code Generation

The AI would generate components that match your project's conventions:

```typescript
// If project uses: export default + forwardRef pattern
export default forwardRef<HTMLButtonElement, ButtonProps>(...)

// If project uses: named exports + function declarations
export function Button({ ...props }: ButtonProps) { ... }

// If project uses: specific naming patterns
export const PrimaryButton = styled(BaseButton)...
```

---

## Implementation Phases

### Phase 1: Enhanced Detection (Local AI)
**Timeline: 2-3 weeks**

```typescript
interface EnhancedProjectConfig extends ProjectConfig {
  // Existing
  framework: string
  componentsPath: string
  
  // New AI-detected fields
  existingUILibraries: string[]        // ['shadcn', 'radix', 'headlessui']
  componentNamingPattern: 'PascalCase' | 'kebab-case' | 'camelCase'
  exportPattern: 'named' | 'default' | 'barrel'
  existingComponents: ComponentScan[]
  tailwindTheme: ThemeAnalysis
  suggestedComponents: Recommendation[]
}
```

### Phase 2: LLM Integration (API-based)
**Timeline: 3-4 weeks**

```typescript
// New command: dinachi init --ai
async function aiInit() {
  const projectContext = await scanProject()
  const recommendations = await queryAI(projectContext)
  
  return interactiveSetup(recommendations)
}
```

### Phase 3: MCP Server (IDE Integration)
**Timeline: 4-6 weeks**

```typescript
// dinachi-mcp-server
export const tools = {
  'analyze-project': analyzeProjectTool,
  'recommend-components': recommendComponentsTool,
  'install-component': installComponentTool,
  'customize-component': customizeComponentTool,
}
```

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DINACHI AI CLI                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐ │
│  │   Scanner    │   │  AI Engine   │   │   Generator              │ │
│  │              │   │              │   │                          │ │
│  │ - AST Parser │──▶│ - Local LLM  │──▶│ - Template Engine        │ │
│  │ - File Scan  │   │ - API Client │   │ - Code Transformer       │ │
│  │ - Config    │   │ - Embeddings │   │ - Style Adapter          │ │
│  └──────────────┘   └──────────────┘   └──────────────────────────┘ │
│         │                  │                      │                  │
│         ▼                  ▼                      ▼                  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    Project Context Store                         ││
│  │  { framework, components, patterns, theme, recommendations }     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Project Scanner (`scanner.ts`)

```typescript
interface ProjectScanner {
  // File system analysis
  scanStructure(): Promise<DirectoryTree>
  
  // Configuration parsing
  parseConfigs(): Promise<{
    package: PackageJson
    typescript: TSConfig
    tailwind: TailwindConfig
    framework: FrameworkConfig
  }>
  
  // Code analysis
  analyzeComponents(): Promise<ComponentAnalysis[]>
  detectPatterns(): Promise<CodePatterns>
  
  // AI-ready context
  generateContext(): Promise<ProjectContext>
}
```

#### 2. AI Engine (`ai-engine.ts`)

```typescript
interface AIEngine {
  // Component recommendations
  recommendComponents(context: ProjectContext): Promise<Recommendation[]>
  
  // Code customization
  adaptComponent(component: Component, patterns: CodePatterns): Promise<string>
  
  // Error resolution
  diagnoseError(error: Error, context: ProjectContext): Promise<Resolution>
  
  // Conversational interface
  chat(message: string, history: Message[]): Promise<Response>
}
```

#### 3. Generator (`generator.ts`)

```typescript
interface Generator {
  // Template transformation
  transformTemplate(
    template: string, 
    adaptations: CodeAdaptation[]
  ): Promise<string>
  
  // Style adaptation
  adaptStyles(
    component: Component, 
    theme: TailwindTheme
  ): Promise<StyledComponent>
  
  // Integration code
  generateIntegration(
    component: Component,
    existingCode: string
  ): Promise<IntegrationGuide>
}
```

---

## AI Features Deep Dive

### Feature 1: Codebase Understanding

**What it does:**
Performs deep analysis of the project to understand:

```typescript
interface CodebaseAnalysis {
  // Component inventory
  existingComponents: {
    name: string
    path: string
    type: 'ui' | 'feature' | 'layout' | 'page'
    hasTests: boolean
    usesTypeScript: boolean
  }[]
  
  // Pattern detection
  patterns: {
    componentStructure: 'functional' | 'class' | 'mixed'
    stateManagement: 'hooks' | 'redux' | 'zustand' | 'context' | 'none'
    stylingApproach: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion'
    testingFramework: 'jest' | 'vitest' | 'playwright' | 'none'
  }
  
  // Import analysis
  importPatterns: {
    aliasUsed: boolean
    aliasPrefix: string  // '@/', '~/', etc.
    preferredExport: 'named' | 'default'
    indexBarrels: boolean
  }
}
```

### Feature 2: Intelligent Recommendations

**Recommendation Engine:**

```typescript
async function recommendComponents(analysis: CodebaseAnalysis): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []
  
  // Rule 1: Check for raw HTML patterns that could use components
  const rawButtonUsage = await findPattern(/<button[^>]*>/g)
  if (rawButtonUsage.count > 3) {
    recommendations.push({
      component: 'button',
      reason: `Found ${rawButtonUsage.count} raw <button> elements that could benefit from consistent styling`,
      priority: 'high',
      locations: rawButtonUsage.locations.slice(0, 3)
    })
  }
  
  // Rule 2: Check for form patterns
  const formUsage = await findPattern(/<form[^>]*>/g)
  const inputUsage = await findPattern(/<input[^>]*>/g)
  if (formUsage.count > 0 && inputUsage.count > 2) {
    recommendations.push({
      component: 'form',
      reason: 'Detected form patterns - Field, Input, and Form components provide validation',
      priority: 'medium',
      relatedComponents: ['field', 'input']
    })
  }
  
  // Rule 3: Check for modal/dialog patterns
  const modalPatterns = await findPattern(/modal|dialog|popup/gi)
  if (modalPatterns.count > 0) {
    recommendations.push({
      component: 'dialog',
      reason: 'Modal patterns detected - Dialog component provides accessibility features',
      priority: 'medium'
    })
  }
  
  return recommendations.sort((a, b) => priorityScore(b) - priorityScore(a))
}
```

### Feature 3: Adaptive Code Generation

**Template Transformation System:**

```typescript
// Input: Standard Dinachi component
const standardButton = `
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)`

// Project pattern: Uses default exports
const adaptedButton = await transform(standardButton, {
  exportStyle: 'default',
  addDisplayName: true,
  useProjectAliases: true
})

// Output: Adapted to project conventions
const result = `
const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
Button.displayName = 'Button'
export default Button
`
```

### Feature 4: Error Intelligence

```typescript
interface ErrorResolution {
  error: Error
  diagnosis: string
  solutions: Solution[]
  preventionTips: string[]
}

// Example error handling
async function handleInstallError(error: Error, context: ProjectContext): Promise<ErrorResolution> {
  if (error.message.includes('Cannot resolve @/lib/utils')) {
    return {
      error,
      diagnosis: 'Path alias not configured in your project',
      solutions: [
        {
          type: 'auto-fix',
          description: 'Add path alias to tsconfig.json',
          action: async () => updateTsConfig({ 
            paths: { '@/*': ['./src/*'] } 
          })
        },
        {
          type: 'manual',
          description: 'Update component imports to use relative paths',
          instructions: '...'
        }
      ],
      preventionTips: [
        'Run `dinachi init` to configure path aliases automatically',
        'Ensure tsconfig.json has baseUrl set to "."'
      ]
    }
  }
}
```

### Feature 5: Conversational CLI

```typescript
// Command: dinachi chat
async function chatMode() {
  const context = await scanProject()
  const history: Message[] = []
  
  console.log('🤖 Dinachi AI: How can I help you with your UI components?')
  
  while (true) {
    const input = await prompt('You: ')
    
    if (input === 'exit') break
    
    const response = await ai.chat(input, {
      projectContext: context,
      conversationHistory: history,
      availableComponents: registry,
      systemPrompt: `You are a helpful UI component assistant. 
        You help developers choose and install components from the Dinachi UI library.
        Current project: ${context.framework}, ${context.componentsPath}`
    })
    
    console.log(`🤖 Dinachi AI: ${response.message}`)
    
    if (response.suggestedAction) {
      const confirm = await prompt('Execute this action? (y/n): ')
      if (confirm === 'y') {
        await executeAction(response.suggestedAction)
      }
    }
    
    history.push({ role: 'user', content: input })
    history.push({ role: 'assistant', content: response.message })
  }
}
```

---

## MCP Integration

### Dinachi MCP Server

Create an MCP server that integrates directly with AI-powered IDEs like Cursor:

```typescript
// packages/cli/src/mcp/server.ts
import { MCPServer, Tool } from '@modelcontextprotocol/sdk'

export const dinachiMCPServer = new MCPServer({
  name: 'dinachi-ui',
  version: '1.0.0',
  description: 'AI-powered UI component library'
})

// Tool: Analyze Project
dinachiMCPServer.addTool({
  name: 'analyze-project',
  description: 'Analyze project structure and recommend UI components',
  parameters: {
    projectPath: { type: 'string', description: 'Path to project root' }
  },
  handler: async ({ projectPath }) => {
    const analysis = await scanProject(projectPath)
    const recommendations = await recommendComponents(analysis)
    
    return {
      framework: analysis.framework,
      existingComponents: analysis.components,
      recommendations: recommendations.map(r => ({
        component: r.component,
        reason: r.reason,
        installCommand: `dinachi add ${r.component}`
      }))
    }
  }
})

// Tool: Install Component
dinachiMCPServer.addTool({
  name: 'install-component',
  description: 'Install a Dinachi UI component with project-specific adaptations',
  parameters: {
    component: { type: 'string', description: 'Component name' },
    customize: { type: 'boolean', description: 'Apply project-specific customizations' }
  },
  handler: async ({ component, customize }) => {
    const config = await getConfig()
    const projectPatterns = await detectPatterns()
    
    const result = await installComponent(component, {
      adaptToPatterns: customize ? projectPatterns : null,
      config
    })
    
    return {
      filesCreated: result.files,
      dependencies: result.dependencies,
      integrationGuide: result.guide
    }
  }
})

// Tool: Customize Component
dinachiMCPServer.addTool({
  name: 'customize-component',
  description: 'Customize an installed component based on requirements',
  parameters: {
    component: { type: 'string' },
    requirements: { type: 'string', description: 'Natural language requirements' }
  },
  handler: async ({ component, requirements }) => {
    const currentCode = await readComponent(component)
    const customizedCode = await ai.customizeComponent(currentCode, requirements)
    
    return {
      originalCode: currentCode,
      customizedCode,
      diff: generateDiff(currentCode, customizedCode)
    }
  }
})

// Resource: Component Documentation
dinachiMCPServer.addResource({
  uri: 'dinachi://components',
  name: 'Component Library',
  description: 'All available Dinachi UI components',
  mimeType: 'application/json',
  handler: async () => {
    return JSON.stringify(getComponentRegistry(), null, 2)
  }
})
```

### IDE Integration Benefits

With MCP integration, users in Cursor/VS Code can:

```
User: "I need a button for my login page"

AI: I see you're working on a Next.js project with Tailwind CSS. 
    Let me check your existing components...
    
    [Calls dinachi analyze-project]
    
    You don't have a Button component yet. The Dinachi Button 
    includes:
    - Multiple variants (default, destructive, outline, ghost)
    - Size options (sm, md, lg)
    - Loading states
    - Full accessibility support
    
    Should I install it?

User: "Yes, and make it match my existing blue theme"

AI: [Calls dinachi install-component with customize=true]
    [Calls dinachi customize-component with theme requirements]
    
    Done! I've installed the Button component and customized it to 
    use your existing blue-500 primary color. The files are at:
    - src/components/ui/button.tsx
    
    Here's how to use it:
    
    ```tsx
    import { Button } from '@/components/ui/button'
    
    <Button variant="default">Sign In</Button>
    ```
```

---

## Example Interactions

### Example 1: First-Time Setup

```bash
$ dinachi init --ai

🤖 Analyzing your project...

   ✓ Framework: Next.js 14 (App Router)
   ✓ TypeScript: Enabled (strict mode)
   ✓ Styling: Tailwind CSS 3.4.1
   ✓ Path Aliases: @/* → src/*

🔍 I found some interesting patterns in your codebase:

   📁 You have 12 components in src/components/
   🎨 Your Tailwind theme uses custom colors: primary, secondary, accent
   📦 No existing UI library detected

💡 Recommendations based on your code:

   1. Button (HIGH) - Found 8 raw <button> elements
      └─ locations: app/page.tsx, app/login/page.tsx, components/Header.tsx
   
   2. Input + Field (HIGH) - Found form patterns
      └─ locations: app/login/page.tsx, app/signup/page.tsx
   
   3. Toast (MEDIUM) - You're using console.log for notifications
      └─ locations: lib/actions.ts

? What would you like to do?
  ❯ Install recommended components
    Install all components
    Select specific components
    Just configure (skip installation)
```

### Example 2: Conversational Component Selection

```bash
$ dinachi chat

🤖 Dinachi AI: Hi! I'm ready to help you with UI components. 
   What are you building today?

You: I'm building a settings page with user preferences

🤖 Dinachi AI: Great! For a settings page, I'd recommend:

   📦 Core components:
   • Tabs - to organize different preference sections
   • Toggle - for on/off settings (notifications, dark mode, etc.)
   • Select - for dropdown preferences (language, timezone)
   
   📦 Form components:
   • Field - for labeled inputs with validation
   • Input - for text preferences
   
   📦 Feedback:
   • Toast - to confirm when settings are saved

   Which would you like to start with?

You: Let's start with Tabs and Toggle

🤖 Dinachi AI: Installing tabs and toggle...

   ✓ tabs.tsx → src/components/ui/tabs.tsx
   ✓ toggle.tsx → src/components/ui/toggle.tsx
   ✓ index.ts updated with exports
   ✓ Dependencies: @base-ui/react, class-variance-authority

   Here's a quick example for your settings page:

   ```tsx
   import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
   import { Toggle } from '@/components/ui/toggle'

   export function SettingsPage() {
     return (
       <Tabs defaultValue="general">
         <TabsList>
           <TabsTrigger value="general">General</TabsTrigger>
           <TabsTrigger value="notifications">Notifications</TabsTrigger>
         </TabsList>
         
         <TabsContent value="notifications">
           <Toggle>Email notifications</Toggle>
           <Toggle>Push notifications</Toggle>
         </TabsContent>
       </Tabs>
     )
   }
   ```

   Want me to install the other recommended components?
```

### Example 3: Error Resolution

```bash
$ dinachi add dialog

❌ Error: Cannot find module '@/lib/utils'

🤖 Dinachi AI: I see the issue! Your project's path aliases aren't 
   configured to match Dinachi's expected imports.

   I can see your tsconfig.json uses:
   - baseUrl: "."
   - paths: { "~/*": ["./src/*"] }

   But Dinachi expects: "@/*"

   ? How would you like to fix this?
   ❯ Update my tsconfig to add @/* alias (recommended)
     Update Dinachi imports to use ~/* 
     Show me how to fix manually

   Selecting: Update my tsconfig...

   ✓ Added "@/*": ["./src/*"] to tsconfig.json paths
   ✓ Retrying installation...
   ✓ dialog.tsx → src/components/ui/dialog.tsx

   All set! The Dialog component is ready to use.
```

---

## Security & Privacy

### Local-First Approach

```typescript
// Default: All analysis happens locally
const config = {
  ai: {
    mode: 'local',           // 'local' | 'api' | 'hybrid'
    localModel: 'llama-3.2', // Small local LLM for basic tasks
    sendTelemetry: false,    // No data leaves the machine
    cacheAnalysis: true      // Cache project analysis for speed
  }
}
```

### API Mode (Optional)

```typescript
// For enhanced capabilities, users can opt-in to API mode
const config = {
  ai: {
    mode: 'api',
    provider: 'anthropic',   // 'anthropic' | 'openai' | 'custom'
    apiKey: process.env.DINACHI_AI_KEY,
    
    // What data is sent (user controls this)
    dataPolicy: {
      sendFileContents: false,  // Only structure, not code
      sendDependencies: true,   // package.json deps
      sendPatterns: true,       // Detected patterns (anonymized)
      sendErrors: true          // For error resolution
    }
  }
}
```

### Data Handling

| Data Type | Local Mode | API Mode (default) | API Mode (full) |
|-----------|------------|-------------------|-----------------|
| File structure | ✅ Analyzed | ✅ Sent | ✅ Sent |
| Dependencies | ✅ Analyzed | ✅ Sent | ✅ Sent |
| Code patterns | ✅ Analyzed | ✅ Summarized | ✅ Sent |
| File contents | ✅ Analyzed | ❌ Not sent | ⚠️ Opt-in |
| Error messages | ✅ Analyzed | ✅ Sent | ✅ Sent |

---

## Roadmap

### Phase 1: Foundation (v0.2.0)
**Target: 4 weeks**

- [ ] Enhanced project scanner
- [ ] Pattern detection (exports, naming, structure)
- [ ] Basic recommendations engine
- [ ] Improved error messages

### Phase 2: Local AI (v0.3.0)
**Target: 6 weeks**

- [ ] Local LLM integration (Ollama/llama.cpp)
- [ ] Conversational CLI mode
- [ ] Smart component recommendations
- [ ] Adaptive code generation

### Phase 3: API Integration (v0.4.0)
**Target: 4 weeks**

- [ ] Claude/OpenAI API integration
- [ ] Advanced customization via natural language
- [ ] Error resolution with AI diagnosis
- [ ] Telemetry and analytics (opt-in)

### Phase 4: MCP Server (v0.5.0)
**Target: 6 weeks**

- [ ] Full MCP server implementation
- [ ] Cursor/VS Code integration
- [ ] Real-time component suggestions
- [ ] In-IDE customization

### Phase 5: Enterprise Features (v1.0.0)
**Target: 8 weeks**

- [ ] Design system synchronization
- [ ] Team pattern enforcement
- [ ] Custom component generation
- [ ] CI/CD integration

---

## Appendix: Command Reference

### New Commands (Proposed)

```bash
# AI-powered initialization
dinachi init --ai

# Conversational mode
dinachi chat

# Get AI recommendations
dinachi recommend

# Analyze project without installing
dinachi analyze

# Customize installed component
dinachi customize button --prompt "add loading spinner"

# MCP server mode
dinachi mcp-server
```

### Environment Variables

```bash
# AI Configuration
DINACHI_AI_MODE=local|api|hybrid
DINACHI_AI_PROVIDER=anthropic|openai|ollama
DINACHI_AI_KEY=your-api-key

# Telemetry (opt-in)
DINACHI_TELEMETRY=true|false

# Debug
DINACHI_DEBUG=true|false
DINACHI_VERBOSE=true|false
```

---

## Contributing

We welcome contributions to the AI features! See:

- `packages/cli/src/ai/` - AI engine implementation
- `packages/cli/src/scanner/` - Project analysis
- `packages/cli/src/mcp/` - MCP server
- `docs/AI_DEVELOPMENT.md` - Development guidelines

---

*Last updated: January 2026*
*Version: Draft 1.0*
