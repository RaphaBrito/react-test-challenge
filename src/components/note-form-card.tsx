import { useState } from "react";

import styles from "../styles/card.module.css";

import type { Note, NoteFormData } from "../types/note";

export interface NoteFormCardProps {
  note?: Note;
  onConfirm: (formData: NoteFormData) => void;
  onCancel: () => void;
}

export function NoteFormCard({ note, onConfirm, onCancel }: NoteFormCardProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");

  const isValid = (): boolean => {
    return title.trim().length !== 0 && description.trim().length !== 0;
  };

  const handleConfirm = () => {
    if (!isValid()) {
      return;
    }

    const formData = { title, description } satisfies NoteFormData;

    onConfirm(formData);
  };

  const handleCancel = onCancel;

  return (
    <div className={styles.card}>
      <input
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        placeholder="Title"
      />

      <input
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        placeholder="Description"
      />

      <div className={styles.cardFooter}>
        <button onClick={handleConfirm} disabled={!isValid()}>
          Salvar
        </button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </div>
  );
}
