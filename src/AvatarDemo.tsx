import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dinachi/components/avatar";

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="mb-2 text-center text-sm font-medium">Default</p>
        <Avatar>
          <AvatarImage src="https://8j5rkx2549.ufs.sh/f/u4JJNlymt4NahmEnPuCpwTOWN4PRbSi9z0uZt8rYnqBjkf2A" alt="@dinachi" />
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <p className="mb-2 text-center text-sm font-medium">Small</p>
        <Avatar size="sm" className="border border-border rounded-full">
          <AvatarImage src="https://github.com/dinachi.png" alt="@dinachi" />
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <p className="mb-2 text-center text-sm font-medium">Large</p>
        <Avatar size="lg">
          <AvatarImage src="https://8j5rkx2549.ufs.sh/f/u4JJNlymt4Nan820rGXd8SgEHB2PD5I1lJv6T09ZtXLjVhbF" alt="@dinachi" />
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <p className="mb-2 text-center text-sm font-medium">Fallback</p>
        <Avatar>
          <AvatarImage src="" alt="@dinachi" />
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}