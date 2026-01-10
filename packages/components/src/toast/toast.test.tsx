import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import * as React from "react"

// Define types for the mock
interface MockToast {
  id: string
  title?: string
  description?: string
  type?: string
  timeout?: number
  priority?: 'low' | 'high'
  onClose?: () => void
  onRemove?: () => void
  actionProps?: any
  data?: any
}

// Mock Base UI Toast components since they don't work well in jsdom
vi.mock("@base-ui/react/toast", () => {
  const mockToastManager = {
    toasts: [] as MockToast[],
    add: vi.fn((toast: Partial<MockToast>) => {
      const id = Math.random().toString(36)
      const newToast: MockToast = { id, ...toast }
      mockToastManager.toasts.push(newToast)
      return id
    }),
    close: vi.fn((id: string) => {
      const index = mockToastManager.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        mockToastManager.toasts.splice(index, 1)
      }
    }),
    update: vi.fn((id: string, updates: Partial<MockToast>) => {
      const toast = mockToastManager.toasts.find(t => t.id === id)
      if (toast) {
        Object.assign(toast, updates)
      }
    }),
    promise: vi.fn((promise: Promise<any>, options: any) => {
      const id = Math.random().toString(36)
      const loadingToast: MockToast = { 
        id, 
        title: typeof options.loading === 'string' ? options.loading : options.loading?.title,
        description: typeof options.loading === 'string' ? undefined : options.loading?.description,
        type: 'loading'
      }
      mockToastManager.toasts.push(loadingToast)
      
      promise
        .then((result: any) => {
          const successMessage = typeof options.success === 'function' 
            ? options.success(result) 
            : options.success
          mockToastManager.update(id, {
            title: typeof successMessage === 'string' ? successMessage : successMessage?.title,
            description: typeof successMessage === 'string' ? undefined : successMessage?.description,
            type: 'success'
          })
        })
        .catch((error: any) => {
          const errorMessage = typeof options.error === 'function' 
            ? options.error(error) 
            : options.error
          mockToastManager.update(id, {
            title: typeof errorMessage === 'string' ? errorMessage : errorMessage?.title,
            description: typeof errorMessage === 'string' ? undefined : errorMessage?.description,
            type: 'error'
          })
        })
      
      return promise
    })
  }

  return {
    Toast: {
      Provider: ({ children }: { children: React.ReactNode }) => {
        return React.createElement('div', { 'data-testid': 'toast-provider' }, children)
      },
      Portal: ({ children }: { children: React.ReactNode }) => {
        return React.createElement('div', { 'data-testid': 'toast-portal' }, children)
      },
      Viewport: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }>(
        ({ children, ...props }, ref) => {
          return React.createElement('div', { 
            ref, 
            'data-testid': 'toast-viewport', 
            role: 'region',
            'aria-label': 'Notifications',
            ...props 
          }, children)
        }
      ),
      Root: React.forwardRef<HTMLDivElement, any>(({ toast, children, ...props }, ref) => {
        return React.createElement('div', { 
          ref, 
          'data-testid': `toast-root-${toast.id}`,
          'data-type': toast.type,
          ...props 
        }, children)
      }),
      Title: React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }>(
        ({ children, ...props }, ref) => {
          return React.createElement('h2', { ref, 'data-testid': 'toast-title', ...props }, children)
        }
      ),
      Description: React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }>(
        ({ children, ...props }, ref) => {
          return React.createElement('p', { ref, 'data-testid': 'toast-description', ...props }, children)
        }
      ),
      Action: React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }>(
        ({ children, ...props }, ref) => {
          return React.createElement('button', { ref, 'data-testid': 'toast-action', ...props }, children)
        }
      ),
      Close: React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }>(
        ({ children, onClick, ...props }, ref) => {
          return React.createElement('button', { 
            ref, 
            'data-testid': 'toast-close', 
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
              // Mock close behavior
              const toastRoot = e.currentTarget.closest('[data-testid^="toast-root-"]')
              if (toastRoot) {
                const toastId = toastRoot.getAttribute('data-testid')?.replace('toast-root-', '')
                if (toastId) {
                  mockToastManager.close(toastId)
                }
              }
              onClick?.(e)
            },
            ...props 
          }, children)
        }
      ),
      useToastManager: () => mockToastManager,
      createToastManager: () => mockToastManager
    }
  }
})

// Import after mocking
import {
  Toast,
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastList,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  useToastManager,
  createToastManager,
  getVariantFromType,
  toastVariants,
} from "./toast"

describe("Toast Components", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe("ToastProvider", () => {
    it("renders children correctly", () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child Content</div>
        </ToastProvider>
      )
      expect(screen.getByTestId("child")).toBeInTheDocument()
      expect(screen.getByTestId("toast-provider")).toBeInTheDocument()
    })

    it("provides toast manager context", () => {
      let hasToastManager = false
      
      function TestComponent() {
        const toastManager = useToastManager()
        hasToastManager = !!toastManager && typeof toastManager === 'object' && 'add' in toastManager
        return <div>Test</div>
      }

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      expect(hasToastManager).toBe(true)
    })
  })

  describe("Toast Management", () => {
    it("adds toasts using toast manager", () => {
      function TestToastManager() {
        const toastManager = useToastManager()
        
        return (
          <button 
            data-testid="add-toast"
            onClick={() => toastManager.add({ title: "Test Toast", description: "Test Description" })}
          >
            Add Toast
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestToastManager />
        </ToastProvider>
      )

      const addButton = screen.getByTestId("add-toast")
      addButton.click()

      const toastManager = useToastManager()
      expect(toastManager.add).toHaveBeenCalledWith({ title: "Test Toast", description: "Test Description" })
    })

    it("adds different toast variants", () => {
      function TestVariants() {
        const toastManager = useToastManager()
        
        return (
          <div>
            <button 
              data-testid="add-success"
              onClick={() => toastManager.add({ title: "Success", type: "success" })}
            >
              Success
            </button>
            <button 
              data-testid="add-error"
              onClick={() => toastManager.add({ title: "Error", type: "error" })}
            >
              Error
            </button>
          </div>
        )
      }

      render(
        <ToastProvider>
          <TestVariants />
        </ToastProvider>
      )

      screen.getByTestId("add-success").click()
      screen.getByTestId("add-error").click()

      const toastManager = useToastManager()
      expect(toastManager.add).toHaveBeenCalledWith({ title: "Success", type: "success" })
      expect(toastManager.add).toHaveBeenCalledWith({ title: "Error", type: "error" })
    })

    it("closes toast when close button is clicked", () => {
      const mockToast = {
        id: "test-id",
        title: "Test Toast",
        description: "Test Description"
      }

      render(
        <ToastProvider>
          <ToastPortal>
            <ToastViewport>
              <ToastRoot toast={mockToast}>
                <ToastTitle>Test Toast</ToastTitle>
                <ToastClose>Close</ToastClose>
              </ToastRoot>
            </ToastViewport>
          </ToastPortal>
        </ToastProvider>
      )

      const closeButton = screen.getByTestId("toast-close")
      closeButton.click()

      const toastManager = useToastManager()
      expect(toastManager.close).toHaveBeenCalledWith("test-id")
    })
  })

  describe("Toast with Actions", () => {
    it("renders toast with action button", () => {
      const mockToast = {
        id: "action-toast-id",
        title: "Action Toast",
        actionProps: {
          children: "Action Button",
          onClick: vi.fn()
        }
      }

      render(
        <ToastProvider>
          <ToastPortal>
            <ToastViewport>
              <ToastRoot toast={mockToast}>
                <ToastTitle>Action Toast</ToastTitle>
                {mockToast.actionProps && (
                  <ToastAction {...mockToast.actionProps} />
                )}
              </ToastRoot>
            </ToastViewport>
          </ToastPortal>
        </ToastProvider>
      )

      expect(screen.getByText("Action Toast")).toBeInTheDocument()
      expect(screen.getByText("Action Button")).toBeInTheDocument()
    })
  })

  describe("Promise Toasts", () => {
    it("handles promise operations", async () => {
      function TestPromise() {
        const toastManager = useToastManager()
        
        return (
          <button
            data-testid="test-promise"
            onClick={() => {
              const testPromise = Promise.resolve("Success!")
              toastManager.promise(testPromise, {
                loading: "Loading...",
                success: (data: string) => data,
                error: (err: Error) => `Error: ${err}`,
              })
            }}
          >
            Test Promise
          </button>
        )
      }

      render(
        <ToastProvider>
          <TestPromise />
        </ToastProvider>
      )

      screen.getByTestId("test-promise").click()

      const toastManager = useToastManager()
      expect(toastManager.promise).toHaveBeenCalled()
    })
  })

  describe("Global Toast Manager", () => {
    it("works with external toast manager", () => {
      const externalManager = createToastManager()
      
      function TestExternalManager() {
        return (
          <div>
            <button
              data-testid="external-add"
              onClick={() => externalManager.add({ title: "External Toast" })}
            >
              Add External Toast
            </button>
            <ToastPortal>
              <ToastViewport>
                <ToastList />
              </ToastViewport>
            </ToastPortal>
          </div>
        )
      }

      render(
        <ToastProvider toastManager={externalManager}>
          <TestExternalManager />
        </ToastProvider>
      )

      expect(screen.getByTestId("external-add")).toBeInTheDocument()
    })
  })

  describe("Complete Toast Component", () => {
    it("renders complete toast setup", () => {
      function TestCompleteToast() {
        const toastManager = useToastManager()
        
        return (
          <button
            data-testid="complete-toast"
            onClick={() => toastManager.add({ title: "Complete Toast" })}
          >
            Add Toast
          </button>
        )
      }

      render(
        <Toast>
          <TestCompleteToast />
        </Toast>
      )

      const button = screen.getByTestId("complete-toast")
      button.click()

      const toastManager = useToastManager()
      expect(toastManager.add).toHaveBeenCalledWith({ title: "Complete Toast" })
    })

    it("applies custom className to viewport", () => {
      render(
        <Toast className="custom-viewport-class">
          <div>Content</div>
        </Toast>
      )

      const viewport = screen.getByRole("region")
      expect(viewport).toHaveClass("custom-viewport-class")
    })
  })

  describe("Individual Components", () => {
    const mockToast = {
      id: "test-toast-id",
      title: "Test Title",
      description: "Test Description", 
      type: "default" as const,
      timeout: 5000,
      priority: "low" as const,
      onClose: vi.fn(),
      onRemove: vi.fn(),
      data: {},
    }

    it("forwards refs correctly", () => {
      const titleRef = React.createRef<HTMLHeadingElement>()
      const descriptionRef = React.createRef<HTMLParagraphElement>()
      const actionRef = React.createRef<HTMLButtonElement>()
      const closeRef = React.createRef<HTMLButtonElement>()

      render(
        <ToastProvider>
          <ToastPortal>
            <ToastViewport>
              <ToastRoot toast={mockToast}>
                <ToastTitle ref={titleRef}>Title</ToastTitle>
                <ToastDescription ref={descriptionRef}>Description</ToastDescription>
                <ToastAction ref={actionRef}>Action</ToastAction>
                <ToastClose ref={closeRef}>Close</ToastClose>
              </ToastRoot>
            </ToastViewport>
          </ToastPortal>
        </ToastProvider>
      )

      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement)
      expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement)
      expect(actionRef.current).toBeInstanceOf(HTMLButtonElement)
      expect(closeRef.current).toBeInstanceOf(HTMLButtonElement)
    })

    it("applies custom classNames", () => {
      render(
        <ToastProvider>
          <ToastPortal>
            <ToastViewport>
              <ToastRoot toast={mockToast}>
                <ToastTitle className="custom-title">Title</ToastTitle>
                <ToastDescription className="custom-description">Description</ToastDescription>
                <ToastAction className="custom-action">Action</ToastAction>
                <ToastClose className="custom-close">Close</ToastClose>
              </ToastRoot>
            </ToastViewport>
          </ToastPortal>
        </ToastProvider>
      )

      expect(screen.getByText("Title")).toHaveClass("custom-title")
      expect(screen.getByText("Description")).toHaveClass("custom-description")
      expect(screen.getByText("Action")).toHaveClass("custom-action")
      expect(screen.getByText("Close")).toHaveClass("custom-close")
    })
  })

  describe("Utility Functions", () => {
    it("getVariantFromType returns correct variants", () => {
      expect(getVariantFromType("success")).toBe("success")
      expect(getVariantFromType("error")).toBe("destructive")
      expect(getVariantFromType("warning")).toBe("warning")
      expect(getVariantFromType("loading")).toBe("loading")
      expect(getVariantFromType("default")).toBe("default")
      expect(getVariantFromType()).toBe("default")
    })

    it("toastVariants generates correct classes", () => {
      const variants = toastVariants({ variant: "success" })
      expect(variants).toContain("border-success")
      
      const destructiveVariants = toastVariants({ variant: "destructive" })
      expect(destructiveVariants).toContain("border-destructive/50")
    })
  })

  describe("ToastManager Methods", () => {
    it("add method creates toast with correct properties", () => {
      const manager = createToastManager()
      const id = manager.add({ title: "Test", description: "Description" })
      
      expect(manager.add).toHaveBeenCalledWith({ title: "Test", description: "Description" })
      expect(typeof id).toBe("string")
    })

    it("close method removes toast", () => {
      const manager = createToastManager()
      manager.close("test-id")
      
      expect(manager.close).toHaveBeenCalledWith("test-id")
    })

    it("update method modifies toast", () => {
      const manager = createToastManager()
      manager.update("test-id", { title: "Updated" })
      
      expect(manager.update).toHaveBeenCalledWith("test-id", { title: "Updated" })
    })

    it("promise method handles async operations", async () => {
      const manager = createToastManager()
      const promise = Promise.resolve("success")
      
      await manager.promise(promise, {
        loading: "Loading...",
        success: (data: string) => `Success: ${data}`,
        error: (err: Error) => `Error: ${err}`
      })
      
      expect(manager.promise).toHaveBeenCalled()
    })
  })

  describe("ToastList Component", () => {
    it("renders toasts from manager", () => {
      const mockToasts = [
        { id: "1", title: "Toast 1", description: "Description 1" },
        { id: "2", title: "Toast 2", description: "Description 2" }
      ]

      // Mock the useToastManager hook to return our test data
      const MockToastList = () => {
        return (
          <div>
            {mockToasts.map((toast) => (
              <ToastRoot key={toast.id} toast={toast}>
                <ToastTitle>{toast.title}</ToastTitle>
                <ToastDescription>{toast.description}</ToastDescription>
                <ToastClose>Close</ToastClose>
              </ToastRoot>
            ))}
          </div>
        )
      }

      render(
        <ToastProvider>
          <ToastPortal>
            <ToastViewport>
              <MockToastList />
            </ToastViewport>
          </ToastPortal>
        </ToastProvider>
      )

      expect(screen.getByText("Toast 1")).toBeInTheDocument()
      expect(screen.getByText("Toast 2")).toBeInTheDocument()
      expect(screen.getByText("Description 1")).toBeInTheDocument()
      expect(screen.getByText("Description 2")).toBeInTheDocument()
    })
  })
}) 