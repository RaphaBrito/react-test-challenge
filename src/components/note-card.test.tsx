import { expect, it, vi } from "vitest";

import {
    NoteCard,
    type NoteCardProps,
  } from "./note-card";
  import { render, screen, userEvent } from "../test/utils";
  import { type Note } from "../types/note";

describe("NoteCard component", () => {
    it("should render correctly with an existing note", () => {
        const note = {
            id: 0,
            title: "note title",
            description: "note description"
          } satisfies Note;

        const props = {
        note,
          onEdit: () => undefined,
          onDelete: () => undefined,
        } satisfies NoteCardProps;
      
        const { container } = render(<NoteCard {...props} />); 

        expect(container).toMatchSnapshot();
      });

    it("when 'Editar' button is clicked, it should disappear", async() => {
        const onEdit = vi.fn()

        const note = {
            id: 0,
            title: "note title",
            description: "note description"
        } satisfies Note;

        const props = {
            note,
            onEdit,
            onDelete: () => undefined,
        } satisfies NoteCardProps;

        await userEvent.click(screen.getByText("Editar"));

        expect(screen.queryByText("Editar")).not.toBeInTheDocument();
        expect(screen.queryByText("Salvar")).toBeInTheDocument();
        expect(screen.queryByText("Cancelar")).toBeInTheDocument();
    });

  it("should call onDelete when 'Remover' button is clicked", async() => {
    const onDelete = vi.fn()

    const note = {
        id: 0,
        title: "note title",
        description: "note description"
    } satisfies Note;

    const props = {
        note,
        onEdit: () => undefined,
        onDelete
    } satisfies NoteCardProps;

    const result = render(<NoteCard {...props} />);

    await userEvent.click(screen.getByText("Remover"));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });
});
