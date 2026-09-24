"use client"; // Error boundaries precisam ser client components.

import { ErrorScreen } from "@/components/status/error-screen";

export default function ErrorPage(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorScreen {...props} />;
}
