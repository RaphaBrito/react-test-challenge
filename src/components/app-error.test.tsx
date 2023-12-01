import { expect, it } from "vitest";

import { render } from "../test/utils";

import { AppError } from "./app-error";

it("should render correctly", () => {
  const { container } = render(<AppError />);
  expect(container).toMatchSnapshot();
});
