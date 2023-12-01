import { expect, it, vi } from "vitest";

import {
  ContactFormCard,
  type ContactFormCardProps,
} from "./contact-form-card";
import { render, screen, userEvent } from "../test/utils";
import { type Contact } from "../types/contact";

it("should render correctly without an existing contact", () => {
  const props = {
    onConfirm: () => {
      return;
    },
    onCancel: () => {
      return;
    },
  } satisfies ContactFormCardProps;

  const result = render(<ContactFormCard {...props} />); // <ContactFormCard contact={props.contact} onConfirm={props.onConfirm} onCancel={props.onCancel} />
  expect(result).toMatchSnapshot();
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
    onConfirm: () => {
      return;
    },
    onCancel: () => {
      return;
    },
  } satisfies ContactFormCardProps;

  const result = render(<ContactFormCard {...props} />); // <ContactFormCard contact={props.contact} onConfirm={props.onConfirm} onCancel={props.onCancel} />
  expect(result).toMatchSnapshot();
});

it("should not confirm with invalid data", async () => {
  const onConfirm = vi.fn();

  const props = {
    onConfirm,
    onCancel: () => {
      return;
    },
  } satisfies ContactFormCardProps;

  render(<ContactFormCard {...props} />);

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(0);
});

it("should confirm with valid data", async () => {
  const contact = {
    id: 0,
    name: "contact name",
    email: "contact email",
    phone: "contact phone",
  } satisfies Contact;

  // test if mock is receiving the formData
  const onConfirm = vi.fn();

  const props = {
    contact,
    onConfirm,
    onCancel: () => {
      return;
    },
  } satisfies ContactFormCardProps;

  render(<ContactFormCard {...props} />);

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(1);
});

it("should confirm with new and valid data", async () => {
  // test if mock is receiving the formData
  const onConfirm = vi.fn();

  const props = {
    onConfirm,
    onCancel: () => {
      return;
    },
  } satisfies ContactFormCardProps;

  render(<ContactFormCard {...props} />);

  const nameInput = screen.getByPlaceholderText("Name");
  expect(nameInput).toBeInTheDocument();

  await userEvent.type(nameInput, "new name");
  expect(nameInput).toHaveValue("new name");

  const emailInput = screen.getByPlaceholderText("Email");
  expect(emailInput).toBeInTheDocument();

  await userEvent.type(emailInput, "new email");
  expect(emailInput).toHaveValue("new email");

  const phoneInput = screen.getByPlaceholderText("Phone");
  expect(phoneInput).toBeInTheDocument();

  await userEvent.type(phoneInput, "new phone");
  expect(phoneInput).toHaveValue("new phone");

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(1);
});
