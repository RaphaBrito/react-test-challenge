import { useState } from "react";

import { ContactFormCard } from "@/components/contact-form-card";
import { type ContactFormData } from "@/types/contact";

export interface CreateContactCardProps {
  onCreate: (formData: ContactFormData) => void;
}

export function CreateContactCard({ onCreate }: CreateContactCardProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (formData: ContactFormData) => {
    onCreate(formData);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  if (isCreating) {
    return <ContactFormCard onConfirm={handleCreate} onCancel={handleCancel} />;
  }

  return <button onClick={() => setIsCreating(true)}>+</button>;
}
