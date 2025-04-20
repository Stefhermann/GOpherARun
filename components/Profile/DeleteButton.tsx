// components/DeleteAccountButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { deleteProfile } from "@/app/settings/profile/actions";
import DeleteConfirmationModal from './DeleteConfirmation'

export default function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(() => {
      deleteProfile()
    })
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#7A0019] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#600016] transition"
        disabled={isPending}
      >
        {isPending ? 'Deleting...' : 'Delete Account'}
      </button>

      <DeleteConfirmationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
