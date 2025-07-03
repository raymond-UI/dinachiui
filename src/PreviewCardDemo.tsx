import * as React from "react"
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
} from "@dinachi/components"

export function PreviewCardDemo() {
  const [controlledOpen, setControlledOpen] = React.useState(false)

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Preview Card Demo</h2>
        <p className="text-gray-600 mb-6">
          A popup that appears when a link is hovered, showing a preview for sighted users.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <div className="max-w-md">
          <p className="text-base text-balance text-foreground">
            The principles of good{' '}
            <PreviewCard>
              <PreviewCardTrigger href="https://en.wikipedia.org/wiki/Typography">
                typography
              </PreviewCardTrigger>
              <PreviewCardContent>
                <img
                  width="240"
                  height="160"
                  className="block w-full rounded-sm mb-3"
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=240&h=160&fit=crop"
                  alt="Typography example with vintage letterpress blocks"
                />
                <p className="text-sm text-pretty text-foreground">
                  <strong>Typography</strong> is the art and science of arranging type to
                  make written language clear, visually appealing, and effective in
                  communication.
                </p>
              </PreviewCardContent>
            </PreviewCard>{' '}
            remain into the digital age.
          </p>
        </div>
      </section>

      {/* Rich Content Example */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Rich Content Preview</h3>
        <div className="max-w-md">
          <p className="text-base text-foreground">
            Check out{' '}
            <PreviewCard>
              <PreviewCardTrigger href="https://github.com">
                GitHub
              </PreviewCardTrigger>
              <PreviewCardContent className="w-80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">GitHub</h4>
                    <p className="text-sm text-gray-600">Where the world builds software</p>
                  </div>
                </div>
                <p className="text-sm">
                  GitHub is a web-based platform for version control and collaboration
                  that lets you and others work together on projects from anywhere.
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100M+ repositories</span>
                    <span>90M+ developers</span>
                  </div>
                </div>
              </PreviewCardContent>
            </PreviewCard>{' '}
            for collaborative development.
          </p>
        </div>
      </section>

      {/* Different Positions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Different Positions</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-2">Top position:</p>
            <PreviewCard>
              <PreviewCardTrigger href="https://example.com">
                Hover for top preview
              </PreviewCardTrigger>
              <PreviewCardPortal>
                <PreviewCardPositioner side="top" sideOffset={12}>
                  <PreviewCardPopup>
                    <PreviewCardArrow />
                    <p className="text-sm">This preview appears above the trigger!</p>
                  </PreviewCardPopup>
                </PreviewCardPositioner>
              </PreviewCardPortal>
            </PreviewCard>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Left position:</p>
            <PreviewCard>
              <PreviewCardTrigger href="https://example.com">
                Hover for left preview
              </PreviewCardTrigger>
              <PreviewCardPortal>
                <PreviewCardPositioner side="left" sideOffset={12}>
                  <PreviewCardPopup>
                    <PreviewCardArrow />
                    <p className="text-sm">This preview appears to the left!</p>
                  </PreviewCardPopup>
                </PreviewCardPositioner>
              </PreviewCardPortal>
            </PreviewCard>
          </div>
        </div>
      </section>

      {/* Controlled State */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Controlled State</h3>
        <div className="space-y-3">
          <div>
            <button
              onClick={() => setControlledOpen(!controlledOpen)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            >
              {controlledOpen ? 'Close' : 'Open'} Preview
            </button>
            <span className="text-sm text-gray-600">
              Current state: {controlledOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          <PreviewCard open={controlledOpen} onOpenChange={setControlledOpen}>
            <PreviewCardTrigger href="https://example.com">
              Controlled preview link
            </PreviewCardTrigger>
            <PreviewCardContent>
              <p className="text-sm mb-3">This preview is controlled externally!</p>
              <button
                onClick={() => setControlledOpen(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300"
              >
                Close from inside
              </button>
            </PreviewCardContent>
          </PreviewCard>
        </div>
      </section>

      {/* Custom Styling */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="max-w-md">
          <p className="text-base text-foreground">
            Learn more about{' '}
            <PreviewCard>
              <PreviewCardTrigger 
                href="https://reactjs.org"
                className="text-blue-500 font-semibold hover:text-blue-600"
              >
                React
              </PreviewCardTrigger>
              <PreviewCardContent className="w-72 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2">React</h4>
                  <p className="text-sm text-blue-800">
                    A JavaScript library for building user interfaces with component-based architecture.
                  </p>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">Components</span>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">Virtual DOM</span>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">JSX</span>
                  </div>
                </div>
              </PreviewCardContent>
            </PreviewCard>{' '}
            development.
          </p>
        </div>
      </section>

      {/* Multiple Links */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Preview Links</h3>
        <div className="max-w-lg">
          <p className="text-base text-foreground leading-relaxed">
            Popular development tools include{' '}
            <PreviewCard>
              <PreviewCardTrigger href="https://code.visualstudio.com">
                VS Code
              </PreviewCardTrigger>
              <PreviewCardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VS</span>
                  </div>
                  <span className="font-semibold">Visual Studio Code</span>
                </div>
                <p className="text-sm text-gray-700">
                  Free, open-source code editor with powerful features and extensions.
                </p>
              </PreviewCardContent>
            </PreviewCard>,{' '}
            <PreviewCard>
              <PreviewCardTrigger href="https://git-scm.com">
                Git
              </PreviewCardTrigger>
              <PreviewCardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="font-semibold">Git</span>
                </div>
                <p className="text-sm text-gray-700">
                  Distributed version control system for tracking changes in source code.
                </p>
              </PreviewCardContent>
            </PreviewCard>, and{' '}
            <PreviewCard>
              <PreviewCardTrigger href="https://nodejs.org">
                Node.js
              </PreviewCardTrigger>
              <PreviewCardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <span className="font-semibold">Node.js</span>
                </div>
                <p className="text-sm text-gray-700">
                  JavaScript runtime built on Chrome's V8 engine for server-side development.
                </p>
              </PreviewCardContent>
            </PreviewCard>{' '}
            for modern web development workflows.
          </p>
        </div>
      </section>
    </div>
  )
} 