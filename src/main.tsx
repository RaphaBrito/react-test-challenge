import "./styles/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./App";
import { Contacts } from "./pages/contacts";
import { Notebook } from "./pages/notebook";
import { queryClient } from "./services/queryClient";

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/notebook",
    element: <Notebook />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
