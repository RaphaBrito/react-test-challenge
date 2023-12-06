import "@/test/utils";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  NoteFormCard,
  type NoteFormCardProps,
} from "@/components/note-form-card";
import { type Note, NoteFormData } from "@/types/note";

it("should render correctly without an existing note", () => {
  const props = {
    onConfirm: () => undefined,
    onCancel: () => undefined,
  } satisfies NoteFormCardProps;

  const { container } = render(<NoteFormCard {...props} />);
  expect(container).toMatchSnapshot();
});

it("should render correctly with an existing note", () => {
  const note = {
    id: 0,
    title: "note title",
    description: "note description",
  } satisfies Note;

  const props = {
    note,
    onConfirm: () => undefined,
    onCancel: () => undefined,
  } satisfies NoteFormCardProps;

  const { container } = render(<NoteFormCard {...props} />);
  expect(container).toMatchSnapshot();
});

it("should not confirm with invalid data", async () => {
  const onConfirm = vi.fn();

  const props = {
    onConfirm,
    onCancel: () => undefined,
  } satisfies NoteFormCardProps;

  render(<NoteFormCard {...props} />);

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(0);
});

it("should confirm with valid data", async () => {
  const onConfirm = vi.fn();

  const note = {
    id: 0,
    title: "note title",
    description: "note description",
  } satisfies Note;

  const props = {
    note,
    onConfirm,
    onCancel: () => undefined,
  } satisfies NoteFormCardProps;

  const formDataResponse = {
    title: note.title,
    description: note.description,
  } satisfies NoteFormData;

  render(<NoteFormCard {...props} />);

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(1);
  expect(onConfirm).toBeCalledWith(formDataResponse);
});

it("should confirm with new and valid data", async () => {
  const onConfirm = vi.fn();

  const props = {
    onConfirm,
    onCancel: () => undefined,
  } satisfies NoteFormCardProps;

  const formDataResponse = {
    title: "new note title",
    description: "new description",
  } satisfies NoteFormData;

  render(<NoteFormCard {...props} />);

  const titleInput = screen.getByPlaceholderText("Title");
  expect(titleInput).toBeInTheDocument();

  await userEvent.type(titleInput, "new note title");
  expect(titleInput).toHaveValue("new note title");

  const descriptionInput = screen.getByPlaceholderText("Description");
  expect(descriptionInput).toBeInTheDocument();

  await userEvent.type(descriptionInput, "new description");
  expect(descriptionInput).toHaveValue("new description");

  await userEvent.click(screen.getByText("Salvar"));

  expect(onConfirm).toBeCalledTimes(1);
  expect(onConfirm).toBeCalledWith(formDataResponse);
});
