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

  it("when 'Editar' button is clicked, it should disappear", async () => {
    const onEdit = vi.fn();

    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;

    const props = {
      note,
      onEdit,
      onDelete: () => undefined,
    } satisfies NoteCardProps;

    render(<NoteCard {...props} />);

    await userEvent.click(screen.getByText("Editar"));

    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Salvar")).toBeInTheDocument();
    expect(screen.queryByText("Cancelar")).toBeInTheDocument();
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
});
