import { useState } from "react";

import styles from "../styles/card.module.css";

import { NoteFormCard } from "./note-form-card";

import type { Note, NoteFormData } from "../types/note";

export interface NoteCardProps {
  note: Note;
  onEdit: (formData: Note) => void;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleBeginEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleEdit = (formData: NoteFormData) => {
    onEdit({ id: note.id, ...formData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  if (isEditing) {
    return (
      <NoteFormCard
        note={note}
        onConfirm={handleEdit}
        onCancel={handleCancelEditing}
      />
    );
  }

  return (
    <div className={styles.card}>
      <h3>{note.title}</h3>
      <p>{note.description}</p>

      <div className={styles.cardFooter}>
        <button onClick={handleBeginEditing}>Editar</button>
        <button onClick={handleDelete}>Remover</button>
      </div>
    </div>
  );
}
