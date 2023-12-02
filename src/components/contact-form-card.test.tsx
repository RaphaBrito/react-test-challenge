import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  ContactFormCard,
  type ContactFormCardProps,
} from "@/components/contact-form-card";
import { ContactFormData, type Contact } from "@/types/contact";

describe("contact form card", () => {
  it("should render correctly without an existing contact", () => {
    const props = {
      onConfirm: () => undefined,
      onCancel: () => undefined,
    } satisfies ContactFormCardProps;

    const { container } = render(<ContactFormCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with an existing contact", () => {
    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const props = {
      contact,
      onConfirm: () => undefined,
      onCancel: () => undefined,
    } satisfies ContactFormCardProps;

    const { container } = render(<ContactFormCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should not confirm with invalid data", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const props = {
      onConfirm,
      onCancel,
    } satisfies ContactFormCardProps;

    render(<ContactFormCard {...props} />);

    // Get components
    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();

    // Perform actions
    await userEvent.click(saveButton);

    // Validate
    expect(onConfirm).toBeCalledTimes(0);
    expect(onCancel).toBeCalledTimes(0);
  });

  it("should confirm with valid data", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const contact = {
      id: 0,
      name: "contact name",
      email: "contact email",
      phone: "contact phone",
    } satisfies Contact;

    const props = {
      contact,
      onConfirm,
      onCancel,
    } satisfies ContactFormCardProps;

    const formDataResponse = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    } satisfies ContactFormData;

    render(<ContactFormCard {...props} />);

    // Get components
    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();

    // Perform actions
    await userEvent.click(saveButton);

    // Validate
    expect(onConfirm).toBeCalledTimes(1);
    expect(onConfirm).toBeCalledWith(formDataResponse);
    expect(onCancel).toBeCalledTimes(0);
  });

  it("should confirm with new and valid data", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const props = {
      onConfirm,
      onCancel,
    } satisfies ContactFormCardProps;

    const formDataResponse = {
      name: "new name",
      email: "new email",
      phone: "new phone",
    } satisfies ContactFormData;

    render(<ContactFormCard {...props} />);

    // Get components
    const nameInput = screen.getByPlaceholderText("Name");
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();

    const phoneInput = screen.getByPlaceholderText("Phone");
    expect(phoneInput).toBeInTheDocument();

    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled(); // Not valid

    // Mutate the inputs
    await userEvent.type(nameInput, formDataResponse.name);
    expect(nameInput).toHaveValue(formDataResponse.name);

    await userEvent.type(emailInput, formDataResponse.email);
    expect(emailInput).toHaveValue(formDataResponse.email);

    await userEvent.type(phoneInput, formDataResponse.phone);
    expect(phoneInput).toHaveValue(formDataResponse.phone);

    expect(saveButton).toBeEnabled(); // Now it's valid

    // Perform actions
    await userEvent.click(saveButton);

    // Validate
    expect(onConfirm).toBeCalledTimes(1);
    expect(onConfirm).toBeCalledWith(formDataResponse);
    expect(onCancel).toBeCalledTimes(0);
  });

  it("should call onCancel when the button is pressed", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const props = {
      onConfirm,
      onCancel,
    } satisfies ContactFormCardProps;

    render(<ContactFormCard {...props} />);

    // Get components
    const nameInput = screen.getByPlaceholderText("Name");
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();

    const phoneInput = screen.getByPlaceholderText("Phone");
    expect(phoneInput).toBeInTheDocument();

    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled(); // Not valid

    const cancelButton = screen.getByText("Cancelar");
    expect(saveButton).toBeInTheDocument();

    // Perform actions
    await userEvent.click(saveButton);
    await userEvent.click(cancelButton);

    // Validate
    expect(onConfirm).toBeCalledTimes(0);
    expect(onCancel).toBeCalledTimes(1);
  });
});
