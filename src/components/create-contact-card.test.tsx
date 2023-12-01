import { render, screen, userEvent } from "../test/utils";
import { ContactFormData, type Contact } from "../types/contact";

import {
  CreateContactCard,
  type CreateContactCardProps,
} from "./create-contact-card";

describe("create contact card", () => {
  it("should render correctly", () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateContactCardProps;

    const { container } = render(<CreateContactCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly after clicking", async () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateContactCardProps;

    const { container } = render(<CreateContactCard {...props} />);

    const addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    expect(addButton).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should render correctly after cancelling", async () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateContactCardProps;

    const { container } = render(<CreateContactCard {...props} />);

    const addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();

    const cancelButton = screen.getByText("Cancelar");
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton)

    expect(container).toMatchSnapshot();
  });

  it("should create a new contact", async () => {
    const onCreate = vi.fn();

    const formDataResponse = {
      name: "new name",
      email: "new email",
      phone: "new phone",
    } satisfies ContactFormData;

    const props = {
      onCreate,
    } satisfies CreateContactCardProps;

    render(<CreateContactCard {...props} />);

    let addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();

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

    // Confirm creation
    await userEvent.click(saveButton);

    // Should appear again
    addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toBeCalledWith(formDataResponse);
  });
});
