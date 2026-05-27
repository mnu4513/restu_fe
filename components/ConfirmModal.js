import { Dialog } from "@headlessui/react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Center */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-md
            rounded-3xl
            bg-white/90 dark:bg-[#0b0f19]/90
            backdrop-blur-2xl
            border border-gray-200 dark:border-white/10
            shadow-2xl
            p-6
          "
        >
          {/* Title */}
          <Dialog.Title className="text-xl font-black text-gray-900 dark:text-white">
            {title}
          </Dialog.Title>

          {/* Message */}
          <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
            {message}
          </Dialog.Description>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="
                px-4 py-2 rounded-xl
                bg-gray-200 dark:bg-white/10
                text-gray-700 dark:text-white
                hover:scale-[1.02]
                transition
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="
                px-4 py-2 rounded-xl
                bg-gradient-to-r from-green-500 to-orange-500
                text-white font-semibold
                hover:scale-[1.02]
                active:scale-95
                transition
              "
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}