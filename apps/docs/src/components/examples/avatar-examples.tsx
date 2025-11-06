import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function DefaultAvatarExample() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export function AvatarSizesExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      
      <Avatar size="md">
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AvatarFallbackExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://broken-link.jpg" alt="Broken" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarImage src="" alt="Empty" />
        <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarImage src="https://another-broken-link.jpg" alt="User" />
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          UK
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AvatarGroupExample() {
  const users = [
    { name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
    { name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
    { name: "Bob Johnson", avatar: "" },
    { name: "Alice Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    { name: "Charlie Wilson", avatar: "" }
  ];

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {users.slice(0, 4).map((user, index) => (
          <Avatar key={index} size="sm" className="border-2 border-background">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      {users.length > 4 && (
        <div className="ml-2 text-sm text-muted-foreground">
          +{users.length - 4} more
        </div>
      )}
    </div>
  );
}