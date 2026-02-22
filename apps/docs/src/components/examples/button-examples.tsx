import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Bold, Italic, Mail, Plus, Search, Trash2, Underline } from 'lucide-react';

export function DefaultButtonExample() {
  return <Button>Click me</Button>;
}

export function ButtonVariantsExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

export function ButtonSizesExample() {
  return (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function ButtonIconExample() {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ButtonIconWithTooltipExample() {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <Mail className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Send email</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <Search className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Search</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <Bold className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="destructive" size="icon" />}>
          <Trash2 className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
