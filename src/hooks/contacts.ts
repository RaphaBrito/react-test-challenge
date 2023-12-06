import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Contact, ContactFormData } from "../types/contact";

export function useContacts() {
  const {
    data: contacts,
    isPending,
    isError,
  } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      return (await fetch("http://localhost:5432/contacts")).json();
    },
  });

  return { contacts, isPending, isError };
}

export function useContactsCreateMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: ContactFormData) => {
      return fetch(`http://localhost:5432/contacts`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return mutation;
}

export function useContactsEditMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (contact: Contact) => {
      return fetch(`http://localhost:5432/contacts/${contact.id}`, {
        method: "PUT",
        body: JSON.stringify(contact),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return mutation;
}

export function useContactsDeleteMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(`http://localhost:5432/contacts/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return mutation;
}
