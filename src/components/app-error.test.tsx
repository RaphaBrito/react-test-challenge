import { render } from "@testing-library/react";

import { AppError } from "@/components/app-error";

it("should render correctly", () => {
  const { container } = render(<AppError />);
  expect(container).toMatchSnapshot();
});
