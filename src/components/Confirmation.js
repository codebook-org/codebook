"use client";
import React, { forwardRef, useState } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

const Confirmation = forwardRef(
  (
    {
      children,
      onConfirm,
      title = "Are you sure?",
      description = "This action cannot be undone",
      confirmText = "Confirm",
      cancelText = "Cancel",
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    return (
      <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AlertDialogPrimitive.Trigger asChild ref={ref} {...props}>
          {children}
        </AlertDialogPrimitive.Trigger>
        <AlertDialogPrimitive.Portal>
          <div
            className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-xs
               data-[state=open]:animate-in data-[state=open]:fade-in-0
               data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          />
          <AlertDialogPrimitive.Content
            forceMount
            className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-md -translate-x-1/2 -translate-y-1/2 
             bg-monaco-dark border border-monaco-light p-6 rounded-3xl shadow-2xl focus:outline-none
             overflow-hidden
             transition-all duration-200
             data-[state=open]:animate-in 
             data-[state=open]:fade-in-0 
             data-[state=open]:zoom-in-95 
             data-[state=open]:slide-in-from-bottom-2
             data-[state=closed]:animate-out 
             data-[state=closed]:fade-out-0 
             data-[state=closed]:zoom-out-95 
             data-[state=closed]:slide-out-to-bottom-2"
          >
            {/* Big ass graphical question mark... might remove later? */}
            <div className="absolute -right-10 -bottom-12 select-none font-bold text-monaco-light text-[240px] leading-none opacity-20 pointer-events-none">
              ?
            </div>
            <div className="relative z-10">
              <AlertDialogPrimitive.Title className="text-sm font-semibold text-monaco-txt mb-2">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="text-xs text-monaco-muted mb-6 leading-relaxed">
                {description}
              </AlertDialogPrimitive.Description>
              <div className="flex justify-end gap-3">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-monaco-mid text-xs font-medium text-monaco-txt hover:bg-monaco-light transition-colors cursor-pointer"
                  >
                    {cancelText}
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <button
                    onClick={() => {
                      onConfirm?.();
                      setOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-xs font-medium text-monaco-txt transition-colors cursor-pointer"
                  >
                    {confirmText}
                  </button>
                </AlertDialogPrimitive.Action>
              </div>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    );
  },
);

Confirmation.displayName = "Confirmation";

export default Confirmation;
