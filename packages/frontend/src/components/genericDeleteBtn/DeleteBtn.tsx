
import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteButtonProps<T> {
  item: T;
  itemLabel: string;
  onDelete:any
  onSuccess?: () => void;
  buttonTooltip?: string;
  dialogTitle?: string;
  dialogContentPrefix?: string;
  confirmText?: string;
  cancelText?: string;
  customButton?: React.ReactNode; // ← חדש
}

export const DeleteButton = <T,>({
  item,
  itemLabel,
  onDelete,
  onSuccess,
  buttonTooltip = "מחיקה",
  dialogTitle = "אישור מחיקה",
  dialogContentPrefix = "האם למחוק את",
  confirmText = "מחק",
  cancelText = "ביטול",
  customButton, // ← קלט חדש
}: DeleteButtonProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onDelete(item);
      onSuccess?.();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Tooltip title={buttonTooltip} arrow>
        <span>
          {customButton ? (
            <span onClick={() => setOpen(true)}>{customButton}</span>
          ) : (
            <Button onClick={() => setOpen(true)}>
              <DeleteIcon style={{ color: "#bc4747ff" }} />
            </Button>
          )}
        </span>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {dialogContentPrefix} <strong>{itemLabel}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} color="error" disabled={loading}>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
