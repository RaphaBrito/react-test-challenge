import { useState } from "react";

import EmailIcon from "../assets/icons/e-mail.png";
import PhoneIcon from "../assets/icons/phone.png";
import AvatarPlaceholder from "../assets/images/avatar.png";
import styles from "../styles/card.module.css";

import { ContactFormCard } from "./contact-form-card";

import type { Contact, ContactFormData } from "../types/contact";

export interface ContactCardProps {
  contact: Contact;
  onEdit: (formData: Contact) => void;
  onDelete: (id: number) => void;
}

export function ContactCard({ contact, onDelete, onEdit }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleBeginEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleEdit = (formData: ContactFormData) => {
    onEdit({ id: contact.id, ...formData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(contact.id);
  };

  if (isEditing) {
    return (
      <ContactFormCard
        contact={contact}
        onConfirm={handleEdit}
        onCancel={handleCancelEditing}
      />
    );
  }

  return (
    <div className={styles.card}>
      <img className={styles.cardImage} src={AvatarPlaceholder} alt="avatar" />

      <h3>{contact.name}</h3>

      <div className={styles.cardContactInfo}>
        <img height="20px" src={PhoneIcon} alt="phone icon" />
        <p>{contact.phone}</p>
      </div>

      <div className={styles.cardContactInfo}>
        <img height="20px" src={EmailIcon} alt="e-mail icon" />
        <p>{contact.email}</p>
      </div>

      <div className={styles.cardFooter}>
        <button onClick={handleBeginEditing}>Editar</button>
        <button onClick={handleDelete}>Remover</button>
      </div>
    </div>
  );
}
