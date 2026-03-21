"use client"

import React from 'react';
import {
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastList,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  useToastManager,
  createToastManager
} from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, AlertCircleIcon, InfoIcon, Loader2Icon } from 'lucide-react';

export function DefaultToastExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);

  const showToast = () => {
    toastManager.add({
      title: "Success",
      description: "Your message has been sent successfully.",
      type: "success"
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <Button onClick={showToast}>Show Toast</Button>
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

function LoadingToastButtons() {
  const toastManager = useToastManager();

  const handleUpdate = () => {
    const id = toastManager.add({
      title: "Saving changes...",
      description: "Please wait while we save your data.",
      type: "loading",
      timeout: 0,
    });

    setTimeout(() => {
      toastManager.update(id, {
        title: "Changes saved",
        description: "Your data has been saved successfully.",
        type: "success",
        timeout: 5000,
      });
    }, 2000);
  };

  const handleUpdateWithError = () => {
    const id = toastManager.add({
      title: "Uploading file...",
      description: "Please wait while we upload your file.",
      type: "loading",
      timeout: 0,
    });

    setTimeout(() => {
      toastManager.update(id, {
        title: "Upload failed",
        description: "The file could not be uploaded.",
        type: "error",
        timeout: 5000,
        actionProps: {
          children: "Retry",
          onClick: () => {
            toastManager.update(id, {
              title: "Retrying upload...",
              description: "Attempting to upload again.",
              type: "loading",
              timeout: 0,
              actionProps: undefined,
            });
            setTimeout(() => {
              toastManager.update(id, {
                title: "Upload complete",
                description: "Your file has been uploaded.",
                type: "success",
                timeout: 5000,
              });
            }, 1500);
          },
        },
      });
    }, 2000);
  };

  const handlePromise = () => {
    const fakeRequest = new Promise<string>((resolve) =>
      setTimeout(() => resolve("Done!"), 2500)
    );

    toastManager.promise(fakeRequest, {
      loading: {
        title: "Processing...",
        description: "Running your request.",
      },
      success: (result) => ({
        title: "Complete",
        description: `Request finished: ${result}`,
      }),
      error: (err) => ({
        title: "Request failed",
        description: err?.message || "Something went wrong.",
      }),
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={handleUpdate} variant="outline">
        Loading → Success
      </Button>
      <Button onClick={handleUpdateWithError} variant="outline">
        Loading → Error → Retry
      </Button>
      <Button onClick={handlePromise} variant="outline">
        Promise Toast
      </Button>
    </div>
  );
}

export function ToastLoadingExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);

  return (
    <ToastProvider toastManager={toastManager}>
      <LoadingToastButtons />
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

export function ToastVariantsExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);

  const variants = {
    default: { title: "Default Toast", description: "This is a default toast message.", type: "default" },
    success: { title: "Success!", description: "Your action completed successfully.", type: "success" },
    error: { title: "Error", description: "Something went wrong. Please try again.", type: "error" },
    warning: { title: "Warning", description: "Please review your input before proceeding.", type: "warning" },
    loading: { title: "Loading...", description: "Please wait while we process your request.", type: "loading" }
  };

  const showToast = (variantKey: string) => {
    const variant = variants[variantKey as keyof typeof variants];
    toastManager.add({
      title: variant.title,
      description: variant.description,
      type: variant.type
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(variants).map((variant) => (
          <Button key={variant} onClick={() => showToast(variant)} variant="outline">
            {variant}
          </Button>
        ))}
      </div>
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

function CloseAllButtons() {
  const toastManager = useToastManager();
  let counter = 0;

  const addMultiple = () => {
    for (let i = 0; i < 3; i++) {
      counter++;
      toastManager.add({
        title: `Toast #${counter}`,
        description: "This is a queued toast.",
        type: "default",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={addMultiple} variant="outline">
        Add 3 Toasts
      </Button>
      <Button onClick={() => toastManager.close()} variant="destructive">
        Close All
      </Button>
    </div>
  );
}

export function ToastCloseAllExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);

  return (
    <ToastProvider toastManager={toastManager}>
      <CloseAllButtons />
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const typeIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle2Icon className="h-5 w-5 text-green-500" />,
  error: <AlertCircleIcon className="h-5 w-5 text-red-500" />,
  loading: <Loader2Icon className="h-5 w-5 animate-spin text-blue-500" />,
};

export function ToastCustomRenderExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);

  const showToast = (type: string) => {
    toastManager.add({
      title: type === "success" ? "Saved" : type === "error" ? "Failed" : "Saving...",
      description: type === "success"
        ? "Your changes have been saved."
        : type === "error"
          ? "Could not save changes."
          : "Please wait...",
      type,
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => showToast("success")} variant="outline">Success</Button>
        <Button onClick={() => showToast("error")} variant="outline">Error</Button>
        <Button onClick={() => showToast("loading")} variant="outline">Loading</Button>
      </div>
      <ToastPortal>
        <ToastViewport>
          <ToastList renderToast={(toast) => (
            <ToastContent>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {typeIcons[toast.type ?? ""] ?? <InfoIcon className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="grid gap-1">
                  {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                  {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
                </div>
              </div>
              <ToastClose />
            </ToastContent>
          )} />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}
