import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./alert-dialog";

describe("AlertDialog", () => {
  it("renders trigger and opens dialog when clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    expect(trigger).toBeInTheDocument();

    // Dialog should not be visible initially
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();

    // Click trigger to open dialog
    await user.click(trigger);

    // Dialog should now be visible
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("closes dialog when cancel button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    await user.click(trigger);

    // Dialog should be visible
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Dialog should be closed
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("closes dialog when action button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    await user.click(trigger);

    // Dialog should be visible
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    const actionButton = screen.getByRole("button", { name: "Continue" });
    await user.click(actionButton);

    // Dialog should be closed
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation with Escape key", async () => {
    const user = userEvent.setup();
    
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    await user.click(trigger);

    // Dialog should be visible
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    // Press Escape to close dialog
    await user.keyboard("{Escape}");

    // Dialog should be closed
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("applies custom className to components", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger className="custom-trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="custom-backdrop" />
          <AlertDialogPopup className="custom-popup">
            <AlertDialogHeader className="custom-header">
              <AlertDialogTitle className="custom-title">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="custom-description">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="custom-footer">
              <AlertDialogCancel className="custom-cancel">Cancel</AlertDialogCancel>
              <AlertDialogAction className="custom-action">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    expect(trigger).toHaveClass("custom-trigger");
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    
    const ControlledDialog = () => {
      const [open, setOpen] = React.useState(false);
      
      const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange(newOpen);
      };
      
      return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogBackdrop />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialogPortal>
        </AlertDialog>
      );
    };

    render(<ControlledDialog />);

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    
    // Dialog should not be visible initially
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    
    await user.click(trigger);
    
    // onOpenChange should be called with true
    expect(onOpenChange).toHaveBeenCalledWith(true);
    
    // Dialog should be visible
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("forwards refs correctly", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const popupRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    
    render(
      <AlertDialog defaultOpen>
        <AlertDialogTrigger ref={triggerRef}>Open Dialog</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup ref={popupRef}>
            <AlertDialogHeader>
              <AlertDialogTitle ref={titleRef}>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(popupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
  });
}); 