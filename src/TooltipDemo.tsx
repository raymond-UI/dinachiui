import { Avatar, AvatarFallback, AvatarImage } from "@dinachi/components/avatar";
import { Button } from "@dinachi/components/button";
import { Toolbar, ToolbarGroup, ToolbarButton } from "@dinachi/components/toolbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@dinachi/components/tooltip";
import { Bold, Italic, Underline } from "lucide-react";

export function TooltipDemo() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Comprehensive Tooltip Demo</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Tooltip with Buttons</h3>
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                Hover one
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip on a button.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Button variant="destructive" />}>
                Delete
              </TooltipTrigger>
              <TooltipContent>
                <p>This action is permanent.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Tooltip with Avatars</h3>
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger 
                render={<div className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full" />}
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>shadcn</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger 
                render={<div className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full" />}
              >
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/72096338?v=4&size=64" alt="@vercel" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vercel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Tooltip with Default Trigger</h3>
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger>Default Button</TooltipTrigger>
              <TooltipContent>
                <p>This uses the default button trigger.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger variant="outline">Outlined Button</TooltipTrigger>
              <TooltipContent>
                <p>This is an outlined button trigger.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Tooltip with Toolbar</h3>
        <TooltipProvider>
          <Toolbar>
            <ToolbarGroup>
              <Tooltip>
                <TooltipTrigger render={<ToolbarButton />}>
                  <Bold className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bold</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={<ToolbarButton />}>
                  <Italic className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Italic</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={<ToolbarButton />}>
                  <Underline className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Underline</p>
                </TooltipContent>
              </Tooltip>
            </ToolbarGroup>
          </Toolbar>
        </TooltipProvider>
      </div>
    </div>
  );
}
