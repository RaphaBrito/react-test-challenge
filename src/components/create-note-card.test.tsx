import "@/test/utils";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  CreateNoteCard,
  type CreateNoteCardProps,
} from "@/components/create-note-card";
import { type NoteFormData } from "@/types/note";

describe("create note card", () => {
  it("should render correctly", () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateNoteCardProps;

    const { container } = render(<CreateNoteCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly after clicking", async () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateNoteCardProps;

    const { container } = render(<CreateNoteCard {...props} />);

    const addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    expect(addButton).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should render correctly after cancelling", async () => {
    const props = {
      onCreate: () => undefined,
    } satisfies CreateNoteCardProps;

    const { container } = render(<CreateNoteCard {...props} />);

    const addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();

    const cancelButton = screen.getByText("Cancelar");
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);

    expect(container).toMatchSnapshot();
  });

  it("should create a new note", async () => {
    const onCreate = vi.fn();

    const formDataResponse = {
      title: "new title",
      description: "new description",
    } satisfies NoteFormData;

    const props = {
      onCreate,
    } satisfies CreateNoteCardProps;

    render(<CreateNoteCard {...props} />);

    let addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();

    // Get components
    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toBeInTheDocument();

    const descriptionInput = screen.getByPlaceholderText("Description");
    expect(descriptionInput).toBeInTheDocument();

    const saveButton = screen.getByText("Salvar");
    expect(saveButton).toBeInTheDocument();

    // Mutate the inputs
    await userEvent.type(titleInput, formDataResponse.title);
    expect(titleInput).toHaveValue(formDataResponse.title);

    await userEvent.type(descriptionInput, formDataResponse.description);
    expect(descriptionInput).toHaveValue(formDataResponse.description);

    // Confirm creation
    await userEvent.click(saveButton);

    // Should appear again
    addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toBeCalledWith(formDataResponse);
  });
});
