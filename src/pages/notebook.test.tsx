import { render, waitFor, screen } from "@testing-library/react";

import * as notesHooks from "@/hooks/notes";
import { Notebook } from "@/pages/notebook";
import { type Note } from "@/types/note";

vitest.mock("@/hooks/notes");

describe("Notebook component", () => {
  const mockNotes: Note[] = [
    { id: 1, title: "Lembrete", description: "Colocar presença na aula." },
    {
      id: 2,
      title: "React",
      description: "Uma das bibliotecas mais utilizadas da atualidade.",
    },
    {
      id: 3,
      title: "CESAR",
      description: "Centro de Estudos e Sistemas Avançados do Recife.",
    },
  ];

  vitest.spyOn(notesHooks, "useNotes").mockReturnValue({
    notes: mockNotes,
    isPending: false,
    isError: false,
  });

  const mockCreateMutation = vitest.fn();
  const mockEditMutation = vitest.fn();
  const mockDeleteMutation = vitest.fn();

  vitest.spyOn(notesHooks, "useNotesCreateMutation").mockReturnValue({
    mutate: mockCreateMutation,
  });

  vitest.spyOn(notesHooks, "useNotesEditMutation").mockReturnValue({
    mutate: mockEditMutation,
  });

  vitest.spyOn(notesHooks, "useNotesDeleteMutation").mockReturnValue({
    mutate: mockDeleteMutation,
  });

  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it("renders loading state", async () => {
    vitest.spyOn(notesHooks, "useNotes").mockReturnValue({
      notes: [],
      isPending: true,
      isError: false,
    });

    render(<Notebook />);

    await waitFor(() => {
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });
  });

  it("renders error state", async () => {
    vitest.spyOn(notesHooks, "useNotes").mockReturnValue({
      notes: [],
      isPending: false,
      isError: true,
    });

    render(<Notebook />);

    await waitFor(() => {
      expect(
        screen.getByText("Que pena, algo de errado aconteceu :("),
      ).toBeInTheDocument();
    });
  });

  it("renders notes correctly", async () => {
    vitest.spyOn(notesHooks, "useNotes").mockReturnValue({
      notes: mockNotes,
      isPending: false,
      isError: false,
    });

    const { container } = render(<Notebook />);

    expect(container).toMatchSnapshot();

    await waitFor(() => {
      mockNotes.forEach((note) => {
        expect(screen.getByText(note.title)).toBeInTheDocument();
        expect(screen.getByText(note.description)).toBeInTheDocument();
      });
    });
  });

  /*
  it("handles note creation", async () => {
    render(Notebook);

    fireEvent.click(screen.getByText("Nova Nota"));

    // Simulate form input
    fireEvent.input(screen.getByPlaceholderText("Título"), {
      target: { value: "New Note Title" },
    });
    fireEvent.input(screen.getByPlaceholderText("Descrição"), {
      target: { value: "New Note Description" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    // Wait for mutation to complete
    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        title: "New Note Title",
        description: "New Note Description",
      });
    });
  });

  it("handles note editing", async () => {
    render(Notebook);

    fireEvent.click(screen.getByText("Editar"));

    // Simulate form input
    fireEvent.input(screen.getByPlaceholderText("Título"), {
      target: { value: "Updated Note Title" },
    });
    fireEvent.input(screen.getByPlaceholderText("Descrição"), {
      target: { value: "Updated Note Description" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    // Wait for mutation to complete
    await waitFor(() => {
      expect(mockEditMutation).toHaveBeenCalledWith({
        id: mockNotes[0].id,
        title: "Updated Note Title",
        description: "Updated Note Description",
      });
    });
  });

  it("handles note deletion", async () => {
    render(Notebook);

    fireEvent.click(screen.getByText("Remover"));

    // Wait for mutation to complete
    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith(mockNotes[0].id);
    });
  });*/
});
