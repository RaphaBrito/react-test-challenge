
import { expect, it, vi } from "vitest";

import {
    NoteFormCard,
    type NoteFormCardProps,
  } from "./note-form-card";
  import { render, screen, userEvent } from "../test/utils";
  import { type Note } from "../types/note";

  it("should render correctly without an existing note", () => {
    const props = {
      onConfirm: () => {
        return;
      },
      onCancel: () => {
        return;
      },
    } satisfies NoteFormCardProps;
  
    const result = render(<NoteFormCard {...props} />); 
    expect(result).toMatchSnapshot();
  });
  
  it("should render correctly with an existing note", () => {
    const note = {
      id: 0,
      title: "note title",
      description: "note description",
    } satisfies Note;
  
    const props = {
      note,
      onConfirm: () => {
        return;
      },
      onCancel: () => {
        return;
      },
    } satisfies NoteFormCardProps;
  
    const result = render(<NoteFormCard {...props} />); 
  });
  
  it("should not confirm with invalid data", async () => {
    const onConfirm = vi.fn();
  
    const props = {
      onConfirm,
      onCancel: () => {
        return;
      },
    } satisfies NoteFormCardProps;
  
    render(<NoteFormCard {...props} />);
  
    await userEvent.click(screen.getByText("Salvar"));
  
    expect(onConfirm).toBeCalledTimes(0);
  });
  
  it("should confirm with valid data", async () => {
    const note = {
      id: 0,
      title: "contact name",
      description: "contact email"
    } satisfies Note;
  
    // test if mock is receiving the formData
    const onConfirm = vi.fn();
  
    const props = {
      note,
      onConfirm,
      onCancel: () => {
        return;
      },
    } satisfies NoteFormCardProps;
  
    render(<NoteFormCard {...props} />);
  
    await userEvent.click(screen.getByText("Salvar"));
  
    expect(onConfirm).toBeCalledTimes(1);
  });
  
  it("should confirm with new and valid data", async () => {
    // test if mock is receiving the formData
    const onConfirm = vi.fn();
  
    const props = {
      onConfirm,
      onCancel: () => {
        return;
      },
    } satisfies NoteFormCardProps;
  
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
  });
  