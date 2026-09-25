/// <reference types="vite/client" />

// GildeConnect-Widget (connect.gilde.org/widgets/v1.js)
declare namespace JSX {
  interface IntrinsicElements {
    'gilde-contact': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
      Record<string, string>
  }
}
