'use client';

import React, { createContext, useContext, useState } from 'react';
import { Cursor, CursorProps } from './cursor';

interface CursorContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  cursorProps: Partial<CursorProps>;
  setCursorProps: (props: Partial<CursorProps>) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

interface CursorProviderProps {
  children: React.ReactNode;
  defaultEnabled?: boolean;
  defaultProps?: Partial<CursorProps>;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({
  children,
  defaultEnabled = true,
  defaultProps = {},
}) => {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [cursorProps, setCursorProps] = useState<Partial<CursorProps>>(defaultProps);

  return (
    <CursorContext.Provider
      value={{
        enabled,
        setEnabled,
        cursorProps,
        setCursorProps,
      }}
    >
      {children}
      <Cursor enabled={enabled} {...cursorProps} />
    </CursorContext.Provider>
  );
}; 