/// <reference types="vite/client" />

// Web-Components: GildeConnect-Widget (connect.gilde.org) und Audiola-Plattenspieler
declare namespace JSX {
  interface IntrinsicElements {
    'gilde-contact': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
      { [attr: string]: unknown }
    // Audiola-Plattenspieler (audiola.de/widgets/turntable/v1.js)
    'audiola-turntable': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
      { [attr: string]: unknown }
  }
}
