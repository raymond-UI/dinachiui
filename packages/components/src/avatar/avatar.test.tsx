import { render } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar", () => {
  it("should render correctly", () => {
    const { getByText } = render(
      <Avatar>
        <AvatarImage src="https://github.com/dinachi.png" alt="@dinachi" />
        <AvatarFallback>DN</AvatarFallback>
      </Avatar>
    );
    expect(getByText("DN")).toBeInTheDocument();
  });
});
