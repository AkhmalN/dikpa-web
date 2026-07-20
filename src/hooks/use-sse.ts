import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type SSEMessageHandler = (eventData: Record<string, unknown>) => void;

interface UseSSEOptions {
  /** Full URL for SSE endpoint */
  url: string;
  /** Auth token (Bearer) */
  token: string | null;
  /** Handler for parsed JSON SSE messages */
  onMessage: SSEMessageHandler;
  /** Auto-reconnect delay in ms. Set to 0 to disable. Default 5000 */
  reconnectDelay?: number;
  /** Enable toast notifications on connection errors */
  silent?: boolean;
}

/**
 * Reusable SSE hook with Bearer auth support.
 * Uses fetch + ReadableStream because native EventSource doesn't support custom headers.
 * Handles automatic reconnection and cleanup.
 */
export function useSSE({
  url,
  token,
  onMessage,
  reconnectDelay = 5000,
  silent = false,
}: UseSSEOptions) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage; // always use latest handler without re-triggering effect

  useEffect(() => {
    if (!token) {
      if (!silent) console.warn("useSSE: No token, skipping connection");
      return;
    }

    let aborted = false;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        });

        if (!response.ok) {
          console.error(`useSSE: HTTP ${response.status}`);
          if (response.status === 401) {
            window.dispatchEvent(new CustomEvent("auth:logout"));
            return; // don't reconnect on 401
          }
          scheduleReconnect();
          return;
        }

        reader = response.body?.getReader() ?? null;
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";

        while (!aborted) {
          const { done, value } = await reader.read();
          if (done) {
            // Stream ended normally — reconnect
            scheduleReconnect();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6);
              try {
                const eventData = JSON.parse(jsonStr);
                onMessageRef.current(eventData);
              } catch {
                // Non-JSON data, skip
              }
            }
          }
        }
      } catch (err) {
        console.error("useSSE: fetch error", err);
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (aborted || reconnectDelay <= 0) return;
      reconnectTimer = setTimeout(connect, reconnectDelay);
    };

    connect();

    return () => {
      aborted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (reader) reader.cancel().catch(() => {});
    };
  }, [url, token, reconnectDelay, silent]);
}
