import React from 'react';
import { 
  ToastProvider,
  ToastViewport,
  ToastList,
  createToastManager
} from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export function DefaultToastExample() {
  const toastManager = React.useMemo(() => createToastManager(), []);
  
  const showToast = () => {
    toastManager.add({
      id: Date.now().toString(),
      title: "Success",
      description: "Your message has been sent successfully.",
      type: "success"
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <Button onClick={showToast}>Show Toast</Button>
      <ToastViewport>
        <ToastList />
      </ToastViewport>
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
      id: Date.now().toString() + variantKey,
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
      <ToastViewport>
        <ToastList />
      </ToastViewport>
    </ToastProvider>
  );
}

