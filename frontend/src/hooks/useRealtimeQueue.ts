import { useEffect, useState, useRef } from 'react';
import { WS_BASE_URL } from '../context/AuthContext';

export interface RealtimeEvent {
  event: string;
  data: any;
}

export function useRealtimeQueue(centerId: number = 1, farmerId?: number) {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const roomPath = farmerId ? `/ws/farmer/${farmerId}` : `/ws/center/${centerId}`;
    const wsUrl = `${WS_BASE_URL}${roomPath}`;

    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastEvent(parsed);
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn("WebSocket connection unavailable, fallback active", e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [centerId, farmerId]);

  return { lastEvent, isConnected };
}
