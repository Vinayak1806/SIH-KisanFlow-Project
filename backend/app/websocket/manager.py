"""WebSocket connection manager for KisanFlow real-time events."""
from typing import Dict, Set, Any
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger("kisanflow.websocket")


class ConnectionManager:
    """Manages active WebSocket connections grouped into rooms."""

    def __init__(self):
        # Room name -> set of WebSockets
        self.rooms: Dict[str, Set[WebSocket]] = {}
        # Keep track of active sockets
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket, room: str = "global"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if room not in self.rooms:
            self.rooms[room] = set()
        self.rooms[room].add(websocket)
        logger.info(f"WebSocket client joined room '{room}'. Total rooms: {len(self.rooms)}")

    def disconnect(self, websocket: WebSocket, room: str = "global"):
        if room in self.rooms and websocket in self.rooms[room]:
            self.rooms[room].remove(websocket)
            if not self.rooms[room]:
                del self.rooms[room]
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket client disconnected from '{room}'")

    async def broadcast_to_room(self, room: str, event: str, data: Any):
        """Send JSON event to all clients in a specific room."""
        message = json.dumps({"event": event, "data": data})
        if room in self.rooms:
            dead_sockets = set()
            for ws in self.rooms[room]:
                try:
                    await ws.send_text(message)
                except Exception as ex:
                    logger.warning(f"Error broadcasting to socket in room {room}: {ex}")
                    dead_sockets.add(ws)
            for ws in dead_sockets:
                self.disconnect(ws, room)

    async def broadcast_all(self, event: str, data: Any):
        """Send JSON event to all active connections."""
        message = json.dumps({"event": event, "data": data})
        dead_sockets = set()
        for ws in self.active_connections:
            try:
                await ws.send_text(message)
            except Exception as ex:
                logger.warning(f"Error broadcasting to all: {ex}")
                dead_sockets.add(ws)
        for ws in dead_sockets:
            if ws in self.active_connections:
                self.active_connections.remove(ws)


ws_manager = ConnectionManager()
