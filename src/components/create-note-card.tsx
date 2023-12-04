import { useState } from "react";

import { NoteFormCard } from "./note-form-card";

import type { NoteFormData } from "../types/note";

export interface CreateNoteCardProps {
  onCreate: (formData: NoteFormData) => void;
}

export function CreateNoteCard({ onCreate }: CreateNoteCardProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (formData: NoteFormData) => {
    onCreate(formData);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  if (isCreating) {
    return <NoteFormCard onConfirm={handleCreate} onCancel={handleCancel} />;
  }

  return <button onClick={() => setIsCreating(true)}>+</button>;
}
