import type { SVGProps } from "react";

// lucide-react dropped brand/logo marks; these are minimal inline equivalents (currentColor, 24x24 viewBox).
type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.35C16.24 4.32 15.36 4.25 14.34 4.25c-2.13 0-3.59 1.3-3.59 3.68v2.07H8.25v3H10.75V21h2.75Z" />
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H21l-6.5 7.43L22.2 21h-6.3l-4.94-6.46L5.24 21H3.1l6.96-7.95L2 3h6.46l4.47 5.9L18.9 3Zm-1.1 16.17h1.16L7.3 4.76H6.05l11.75 14.41Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H4.2V20h2.74V8.5ZM5.57 3.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20 13.4c0-3.1-1.66-4.54-3.87-4.54-1.78 0-2.58.98-3.02 1.66V8.5H10.4c.04.8 0 11.5 0 11.5h2.74v-6.42c0-.34.02-.69.13-.94.28-.68.92-1.4 2-1.4 1.4 0 1.96 1.07 1.96 2.63V20H20v-6.6Z" />
    </svg>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.75l4.01-3.11Z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2s-.2-1.44-.83-2.07c-.79-.83-1.68-.83-2.09-.88C15.8 4 12 4 12 4h-.01s-3.8 0-6.68.25c-.4.05-1.29.05-2.08.88C2.6 5.76 2.4 7.2 2.4 7.2S2.15 8.9 2.15 10.6v1.6c0 1.7.25 3.4.25 3.4s.2 1.44.82 2.07c.8.83 1.84.8 2.3.9 1.68.16 7.08.24 7.08.24s3.8 0 6.68-.25c.4-.05 1.3-.05 2.09-.88.62-.63.82-2.07.82-2.07s.25-1.7.25-3.4v-1.6c0-1.7-.25-3.4-.25-3.4ZM9.95 14.2V8.8l5.6 2.7-5.6 2.7Z" />
    </svg>
  );
}
