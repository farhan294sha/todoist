import React from 'react';
declare module 'react' {
    namespace JSX {
      interface IntrinsicElements {
        p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & { before?: string };
      }
    }
  }