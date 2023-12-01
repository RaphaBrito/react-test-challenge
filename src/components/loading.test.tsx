import { expect, it } from "vitest";

import { Loading } from "./loading";
import { render } from "../test/utils";

it("should render correctly", () => {
  const result = render(<Loading />);
  expect(result).toMatchSnapshot('<Loading />');
});
