import { expect, it, vi } from "vitest";

import { render, screen, userEvent } from "../test/utils";
import { ContactFormData, type Contact } from "../types/contact";

import {
  ContactFormCard,
  type ContactFormCardProps,
} from "./contact-form-card";

it("should render correctly without an existing contact", () => {
  const props = {
    onConfirm: () => undefined,
    onCancel: () => undefined,
  } satisfies ContactFormCardProps;

  const { container } = render(<ContactFormCard {...props} />); // <ContactFormCard contact={props.contact} onConfirm={props.onConfirm} onCancel={props.onCancel} />
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

  const { container } = render(<ContactFormCard {...props} />); // <ContactFormCard contact={props.contact} onConfirm={props.onConfirm} onCancel={props.onCancel} />
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

  // Mutate the inputs
  await userEvent.type(nameInput, formDataResponse.name);
  expect(nameInput).toHaveValue(formDataResponse.name);

  await userEvent.type(emailInput, formDataResponse.email);
  expect(emailInput).toHaveValue(formDataResponse.email);

  await userEvent.type(phoneInput, formDataResponse.phone);
  expect(phoneInput).toHaveValue(formDataResponse.phone);

  // Perform actions
  await userEvent.click(saveButton);
  expect(onConfirm).toBeCalledTimes(1);
  expect(onConfirm).toBeCalledWith(formDataResponse);

  expect(onCancel).toBeCalledTimes(0);
});

/*
it("should not confirm (edge case to increase the coverage)", async () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  const props = {
    onConfirm,
    onCancel,
  } satisfies ContactFormCardProps;

  const formDataResponse = {
    name: "",
    email: "",
    phone: "",
  } satisfies ContactFormData;

  const { container } = render(<ContactFormCard {...props} />);

  // Get components
  const nameInput = screen.getByPlaceholderText("Name");
  expect(nameInput).toBeInTheDocument();

  const emailInput = screen.getByPlaceholderText("Email");
  expect(emailInput).toBeInTheDocument();

  const phoneInput = screen.getByPlaceholderText("Phone");
  expect(phoneInput).toBeInTheDocument();

  const saveButton = screen.getByText("Salvar");
  expect(saveButton).toBeInTheDocument();
  saveButton.removeAttribute("disabled"); // Remove disabled check
  expect(saveButton).toBeEnabled();

  //expect(saveButton).toHaveProperty('disabled', false);

  expect(saveButton).toMatchSnapshot();

  // Mutate the inputs
  expect(nameInput).toHaveValue("");
  expect(emailInput).toHaveValue("");
  expect(phoneInput).toHaveValue("");

  // Perform actions
  expect(saveButton).not.toBeDisabled();
  await userEvent.click(saveButton);
  expect(onConfirm).toBeCalledTimes(0);
  expect(onCancel).toBeCalledTimes(0);
});
*/
