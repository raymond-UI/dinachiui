import { fireEvent, render } from "@testing-library/react";
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

  it("renders only the fallback while an image is preloading", () => {
    const { getByText, container } = render(
      <Avatar>
        <AvatarImage src="https://github.com/dinachi.png" alt="@dinachi" />
        <AvatarFallback>DN</AvatarFallback>
      </Avatar>
    );
    expect(getByText("DN")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("keeps the image and fallback mounted while loading with keepMounted", () => {
    const { getByText, container } = render(
      <Avatar>
        <AvatarFallback>DN</AvatarFallback>
        <AvatarImage
          keepMounted
          src="https://github.com/dinachi.png"
          alt="@dinachi"
        />
      </Avatar>
    );
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("data-loading");
    expect(image).not.toHaveAttribute("data-error");
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(getByText("DN")).toBeInTheDocument();
  });

  it("keeps the fallback visible after the image fails with keepMounted", () => {
    const { getByText, container } = render(
      <Avatar>
        <AvatarFallback>DN</AvatarFallback>
        <AvatarImage
          keepMounted
          src="https://broken.invalid/avatar.png"
          alt="@dinachi"
        />
      </Avatar>
    );
    fireEvent.error(container.querySelector("img")!);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("data-error");
    expect(image).not.toHaveAttribute("data-loading");
    expect(getByText("DN")).toBeInTheDocument();
  });
});
