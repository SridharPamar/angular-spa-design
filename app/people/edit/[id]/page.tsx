"use client"

import PersonEditForm from "@/components/PersonEditForm"

interface EditPersonPageProps {
  params: {
    id: string
  }
}

export default function EditPersonPage({ params }: EditPersonPageProps) {
  return <PersonEditForm personId={Number.parseInt(params.id)} />
}
