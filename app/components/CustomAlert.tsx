"use client";

import { motion, AnimatePresence } from "framer-motion";

type CustomAlertProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "info" | "confirm" | "danger";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
};

export default function CustomAlert({
  isOpen,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
}: CustomAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose || onCancel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
            <div className="modal-buttons">
              {type === "confirm" || type === "danger" ? (
                <>
                  <button
                    className="modal-btn modal-btn-secondary"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                  <button
                    className={`modal-btn ${
                      type === "danger" ? "modal-btn-danger" : "modal-btn-primary"
                    }`}
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  className="modal-btn modal-btn-primary"
                  onClick={onClose}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
