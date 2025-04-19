// components/DeleteConfirmation.tsx
'use client'

import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmation({ open, onClose, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  return (
    <dialog ref={dialogRef} className="rounded-xl p-6 shadow-xl max-w-sm w-full backdrop:bg-black/40">
      <h2 className="text-lg font-semibold mb-4">Confirm Account Deletion</h2>
      <p className="text-sm text-gray-700 mb-6">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          Yes, Delete
        </button>
      </div>
    </dialog>
  )
}
