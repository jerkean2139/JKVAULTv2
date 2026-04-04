import { NextResponse } from "next/server";

/**
 * Safely return an error response without leaking internal details.
 * Logs the full error server-side, returns a generic message to the client.
 */
export function apiError(
  message: string,
  status: number = 500,
  error?: unknown
): NextResponse {
  if (error) {
    console.error(`API Error [${status}]: ${message}`, error);
  }
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wraps an API handler with consistent error handling.
 * Catches all errors and returns sanitized responses.
 */
export function withErrorHandling(
  handler: (request: Request, context?: unknown) => Promise<NextResponse>
) {
  return async (request: Request, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("Unhandled API error:", error);
      return apiError("An unexpected error occurred", 500);
    }
  };
}
