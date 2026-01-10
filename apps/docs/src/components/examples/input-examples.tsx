"use client";

import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function DefaultInputExample() {
  return (
    <Input placeholder="Enter your email" />
  );
}

export function InputTypesExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
        <Input 
          id="email" 
          type="email" 
          placeholder="user@example.com" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Enter your password" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="number" className="text-sm font-medium text-foreground">Number</label>
        <Input 
          id="number" 
          type="number" 
          placeholder="Enter a number" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-foreground">URL</label>
        <Input 
          id="url" 
          type="url" 
          placeholder="https://example.com" 
        />
      </div>
    </div>
  );
}

export function InputWithLabelExample() {
  return (
    <div className="space-y-2 w-full max-w-sm">
      <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
      <Input 
        id="username" 
        placeholder="Enter your username" 
      />
      <p className="text-sm text-muted-foreground">
        This is your public display name.
      </p>
    </div>
  );
}

export function InputDisabledExample() {
  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label htmlFor="disabled" className="text-sm font-medium text-foreground">Disabled Input</label>
        <Input 
          id="disabled" 
          placeholder="This input is disabled" 
          disabled 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="readonly" className="text-sm font-medium text-foreground">Read-only Input</label>
        <Input 
          id="readonly" 
          value="This input is read-only" 
          readOnly 
        />
      </div>
    </div>
  );
}

export function InputWithValidationExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !value.includes('@')) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-2 w-full max-w-sm">
      <label htmlFor="email-validation" className="text-sm font-medium text-foreground">Email Address</label>
      <Input
        id="email-validation"
        type="email"
        placeholder="user@example.com"
        value={email}
        onChange={handleChange}
        aria-invalid={!!error}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {email && !error && (
        <p className="text-sm text-success">Valid email address</p>
      )}
    </div>
  );
}
