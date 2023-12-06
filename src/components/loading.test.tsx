import "@/test/utils";

import { render } from "@testing-library/react";

import { Loading } from "./loading";

it("should render correctly", () => {
  const { container } = render(<Loading />);
  expect(container).toMatchSnapshot("<Loading />");
});
