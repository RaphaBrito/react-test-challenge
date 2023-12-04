import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { NoteCard, type NoteCardProps } from "@/components/note-card";
import { type Note } from "@/types/note";

describe("NoteCard component", () => {
  it("should render correctly with an existing note", () => {
    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;

    const props = {
      note,
      onEdit: () => undefined,
      onDelete: () => undefined,
    } satisfies NoteCardProps;

    const { container } = render(<NoteCard {...props} />);

    expect(container).toMatchSnapshot();
  });

  it("should call onEdit with modified data", async () => {
    const onEdit = vi.fn();

    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;

    const formData = note;

    const props = {
      note,
      onEdit,
      onDelete: () => undefined,
    } satisfies NoteCardProps;

    render(<NoteCard {...props} />);

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

  it("should call onDelete when 'Remover' button is clicked", async () => {
    const onDelete = vi.fn();

    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;

    const props = {
      note,
      onEdit: () => undefined,
      onDelete,
    } satisfies NoteCardProps;

    render(<NoteCard {...props} />);

    await userEvent.click(screen.getByText("Remover"));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });

  it("should cancel when editing", async () => {
    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;

    const props = {
      note,
      onEdit: () => undefined,
      onDelete: () => undefined,
    } satisfies NoteCardProps;

    render(<NoteCard {...props} />);

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
