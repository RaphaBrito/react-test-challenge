import { expect, it } from "vitest";

import { render } from "../test/utils";

import { Loading } from "./loading";

it("should render correctly", () => {
  const { container } = render(<Loading />);
  expect(container).toMatchSnapshot("<Loading />");
});
