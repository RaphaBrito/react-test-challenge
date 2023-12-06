import "@/test/utils";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import jsonServer from "json-server";

import * as contacts from "@/hooks/contacts";
import * as notes from "@/hooks/notes";
import { Contacts } from "@/pages/contacts";
import { Notebook } from "@/pages/notebook";
import { ContactFormData } from "@/types/contact";
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

const server = jsonServer.create();
export const router = jsonServer.router(json);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(5432, () => {
  console.log("JSON Server is running");
});

const resetDatabase = () => {
  router.db.setState(JSON.parse(JSON.stringify(json)) as typeof json);
  router.db.write();
};

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

  resetDatabase();
});

describe("ui tests", () => {
  it("notebook renders loading state", async () => {
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

  it("notebook renders error state", async () => {
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

  it("notebook renders notes correctly", async () => {
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

  it("notebook handles note creation", async () => {
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

  it("notebook handles note editing", async () => {
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

  it("notebook handles note deletion", async () => {
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

  it("contacts renders loading state", async () => {
    vi.spyOn(contacts, "useContacts").mockReturnValue({
      contacts: [],
      isPending: true,
      isError: false,
    });

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
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

  it("renders contacts error state", async () => {
    vi.spyOn(contacts, "useContacts").mockReturnValue({
      contacts: [],
      isPending: false,
      isError: true,
    });

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
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

  it("renders contacts correctly", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await waitFor(() => {
      expect(screen.getByText(json.contacts[0].name)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles contact creation", async () => {
    const formDataResponse = {
      name: "new name",
      email: "nem email",
      phone: "0800",
    } satisfies ContactFormData;

    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    await userEvent.click(screen.getByText("+"));

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

    await waitFor(() => {
      expect(screen.getByText(formDataResponse.name)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles contact editing", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    const firstEditButton = screen.getAllByText("Editar")[0];

    await userEvent.click(firstEditButton);

    const nameInput = screen.getByPlaceholderText("Name");
    expect(nameInput).toBeInTheDocument();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "edited name");

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "edited email");

    const phoneInput = screen.getByPlaceholderText("Phone");
    expect(phoneInput).toBeInTheDocument();

    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "edited phone");

    await userEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("edited name")).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("handles contact deletion", async () => {
    const queryClient = makeQueryClient();

    const { container } = render(
      <ProviderWrapper queryClient={queryClient}>
        <Contacts />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    const firstTitle = screen.getByText("Raphael");
    const firstDeleteButton = screen.getAllByText("Remover")[0];

    await userEvent.click(firstDeleteButton);

    await waitFor(() => {
      expect(firstTitle).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
