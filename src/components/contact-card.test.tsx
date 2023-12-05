import "@/test/utils";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { ContactCard, type ContactCardProps } from "@/components/contact-card";
import { type Contact } from "@/types/contact";

describe("contact card", () => {
  it("should render correctly", () => {
    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const props = {
      contact,
      onEdit: () => undefined,
      onDelete: () => undefined,
    } satisfies ContactCardProps;

    const { container } = render(<ContactCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should call onDelete", async () => {
    const onDelete = vi.fn();

    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const props = {
      contact,
      onEdit: () => undefined,
      onDelete,
    } satisfies ContactCardProps;

    render(<ContactCard {...props} />);

    const deleteButton = screen.getByText("Remover");
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);
    expect(onDelete).toBeCalledWith(contact.id);
  });

  it("should call onEdit with modified data", async () => {
    const onEdit = vi.fn();

    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const formData = contact;

    const props = {
      contact,
      onEdit,
      onDelete: () => undefined,
    } satisfies ContactCardProps;

    render(<ContactCard {...props} />);

    let editButton = screen.getByText("Editar");
    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);
    expect(editButton).not.toBeInTheDocument();

    // Card "flipped" to editing mode
    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);

    // Has returned to the viewing mode
    editButton = screen.getByText("Editar");
    expect(editButton).toBeInTheDocument();

    expect(onEdit).toBeCalledWith(formData);
  });

  it("should cancel when editing", async () => {
    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const props = {
      contact,
      onEdit: () => undefined,
      onDelete: () => undefined,
    } satisfies ContactCardProps;

    render(<ContactCard {...props} />);

    let editButton = screen.getByText("Editar");
    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);
    expect(editButton).not.toBeInTheDocument();

    // Card "flipped" to editing mode
    const cancelButton = screen.getByText("Cancelar");
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    // Has returned to the viewing mode
    editButton = screen.getByText("Editar");
    expect(editButton).toBeInTheDocument();
  });
});
