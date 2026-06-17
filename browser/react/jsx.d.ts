import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// The Sidebar component renders a non-standard <sidebar> element (styled via an
// element selector in style.css). Declare it so strict TSX accepts the tag
// without changing the rendered DOM.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      sidebar: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
