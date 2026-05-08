import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
};

export function FormModal({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  isSubmitting,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  size = "md",
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle className="text-[18px] font-bold leading-[22px]">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-1">
          <div className="flex flex-col gap-4 py-2">{children}</div>
        </ScrollArea>
        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F5]"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-[#D6522F] text-primary-foreground"
          >
            {isSubmitting && <Spinner className="mr-2" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
