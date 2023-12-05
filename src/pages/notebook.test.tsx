import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import jsonServer from "json-server";

import * as notes from "@/hooks/notes";
import { Notebook } from "@/pages/notebook";
import { type NoteFormData } from "@/types/note";

const json = {
  contacts: [
    {
      id: 1,
      name: "Raphael",
      email: "brito@gmail.com",
      phone: "+558190836728",
    },
    {
      id: 2,
      name: "Cesar",
      email: "cesar@gmail.com",
      phone: "+558190836728",
    },
    {
      id: 3,
      name: "cesare",
      email: "Cesare@gmail.com",
      phone: "+558190836728",
    },
  ],
  notes: [
    {
      id: 1,
      title: "Lembrete",
      description: "Colocar presença na aula.",
    },
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
  ],
};
// vi.mock("notes");

const server = jsonServer.create();
const router = jsonServer.router(json);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(5432, () => {
  console.log("JSON Server is running");
});

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function ProviderWrapper({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

afterEach(() => {
  vi.restoreAllMocks();

  router.db.setState(JSON.parse(JSON.stringify(json)) as typeof json);
  router.db.write();
});

describe("Notebook component", () => {
  it("renders loading state", async () => {
    vi.spyOn(notes, "useNotes").mockReturnValue({
      notes: [],
      isPending: true,
      isError: false,
    });

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await waitFor(() => {
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("renders error state", async () => {
    vi.spyOn(notes, "useNotes").mockReturnValue({
      notes: [],
      isPending: false,
      isError: true,
    });

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Que pena, algo de errado aconteceu :("),
      ).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("renders notes correctly", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await waitFor(() => {
      expect(screen.getByText(json.notes[0].title)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles note creation", async () => {
    const formDataResponse = {
      title: "new note title",
      description: "new description",
    } satisfies NoteFormData;

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await userEvent.click(screen.getByText("+"));

    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toBeInTheDocument();

    await userEvent.type(titleInput, "new note title");
    expect(titleInput).toHaveValue("new note title");

    const descriptionInput = screen.getByPlaceholderText("Description");
    expect(descriptionInput).toBeInTheDocument();

    await userEvent.type(descriptionInput, "new description");
    expect(descriptionInput).toHaveValue("new description");

    await userEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText(formDataResponse.title)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles note editing", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    const firstEditButton = screen.getAllByText("Editar")[0];

    await userEvent.click(firstEditButton);

    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toBeInTheDocument();

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "edited note title");

    const descriptionInput = screen.getByPlaceholderText("Description");
    expect(descriptionInput).toBeInTheDocument();

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "edited description");

    await userEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("edited note title")).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles note deletion", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Notebook />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    const firstTitle = screen.getByText("Lembrete");
    const firstDeleteButton = screen.getAllByText("Remover")[0];

    await userEvent.click(firstDeleteButton);

    await waitFor(() => {
      expect(firstTitle).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
