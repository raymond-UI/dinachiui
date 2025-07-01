import {
  Toast,
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastList,
  useToastManager,
} from "@dinachi/components";

export function ToastDemo() {
  return (
    <ToastProvider limit={3} >
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Toast Demo</h2>

        <BasicToastExamples />
        <ToastTypesDemo />
        <ToastWithActionDemo />
        <PromiseToastDemo />
        <CustomTimeoutDemo />

        {/* Toast viewport for displaying toasts */}
        <ToastPortal>
          <ToastViewport>
            <ToastList />
          </ToastViewport>
        </ToastPortal>
      </div>
    </ToastProvider>
  );
}

function BasicToastExamples() {
  const { add } = useToastManager();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Toasts</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Simple Toast",
              description: "This is a simple toast notification.",
            })
          }
        >
          Basic Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() => add({ title: "Title Only" })}
        >
          Title Only
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({ description: "Description only toast without a title." })
          }
        >
          Description Only
        </button>
      </div>
    </div>
  );
}

function ToastTypesDemo() {
  const { add } = useToastManager();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toast Types</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Success!",
              description: "Your action was completed successfully.",
              type: "success",
            })
          }
        >
          Success Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Error!",
              description: "Something went wrong. Please try again.",
              type: "error",
            })
          }
        >
          Error Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Warning",
              description: "Please review your input and try again.",
              type: "warning",
            })
          }
        >
          Warning Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Loading...",
              description: "Please wait while we process your request.",
              type: "loading",
            })
          }
        >
          Loading Toast
        </button>
      </div>
    </div>
  );
}

function ToastWithActionDemo() {
  const { add, close } = useToastManager();

  const showUndoToast = () => {
    const toastId = add({
      title: "File deleted",
      description: "The file has been moved to trash.",
      type: "success",
      actionProps: {
        children: "Undo",
        onClick: () => {
          close(toastId);
          add({
            title: "File restored",
            description: "The file has been restored from trash.",
            type: "success",
          });
        },
      },
    });
  };

  const showRetryToast = () => {
    const toastId = add({
      title: "Upload failed",
      description: "The file could not be uploaded. Would you like to retry?",
      type: "error",
      actionProps: {
        children: "Retry",
        onClick: () => {
          close(toastId);
          add({
            title: "Retrying upload...",
            description: "Attempting to upload the file again.",
            type: "loading",
          });
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toasts with Actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={showUndoToast}
        >
          Delete File (with Undo)
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={showRetryToast}
        >
          Failed Upload (with Retry)
        </button>
      </div>
    </div>
  );
}

function PromiseToastDemo() {
  const { promise } = useToastManager();

  const simulateApiCall = () => {
    const apiCall = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        // 70% success rate
        if (Math.random() > 0.3) {
          resolve("Data saved successfully!");
        } else {
          reject(new Error("Network error occurred"));
        }
      }, 2000);
    });

    promise(apiCall, {
      loading: "Saving data...",
      success: (data: string) => data,
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const simulateFileUpload = () => {
    const uploadPromise = new Promise<{ filename: string; size: string }>(
      (resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.4) {
            resolve({ filename: "document.pdf", size: "2.4 MB" });
          } else {
            reject(new Error("File too large"));
          }
        }, 3000);
      }
    );

    promise(uploadPromise, {
      loading: {
        title: "Uploading file...",
        description: "Please wait while we upload your file.",
      },
      success: (data: { filename: string; size: string }) => ({
        title: "Upload complete!",
        description: `${data.filename} (${data.size}) uploaded successfully.`,
        type: "success" as const,
      }),
      error: (err: Error) => ({
        title: "Upload failed",
        description: `Upload failed: ${err.message}`,
        type: "error" as const,
        actionProps: {
          children: "Try again",
          onClick: () => simulateFileUpload(),
        },
      }),
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Promise Toasts</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={simulateApiCall}
        >
          Simulate API Call
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={simulateFileUpload}
        >
          Simulate File Upload
        </button>
      </div>
    </div>
  );
}

function CustomTimeoutDemo() {
  const { add } = useToastManager();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Custom Timeout</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Quick toast",
              description: "This toast disappears in 1 second.",
              timeout: 1000,
            })
          }
        >
          1 Second Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Persistent toast",
              description: "This toast stays for 10 seconds.",
              timeout: 10000,
            })
          }
        >
          10 Second Toast
        </button>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Manual dismiss",
              description: "This toast won't disappear automatically.",
              timeout: 0, // 0 means no auto-dismiss
            })
          }
        >
          No Auto-Dismiss
        </button>
      </div>
    </div>
  );
}

// Alternative demo using the complete Toast component
export function SimpleToastDemo() {
  const { add } = useToastManager();

  return (
    <Toast>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Simple Toast Demo</h2>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() =>
            add({
              title: "Hello Toast!",
              description: "This is a simple toast notification.",
            })
          }
        >
          Show Toast
        </button>
      </div>
    </Toast>
  );
}
