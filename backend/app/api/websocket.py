"""WebSocket endpoints for real-time live queue and notification updates."""
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import ws_manager

router = APIRouter(tags=["WebSockets"])
logger = logging.getLogger("kisanflow.websocket")


@router.websocket("/ws")
async def websocket_global(websocket: WebSocket):
    await ws_manager.connect(websocket, "global")
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or heartbeat
            await websocket.send_text(f'{{"type": "pong", "payload": {data}}}')
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, "global")


@router.websocket("/ws/center/{center_id}")
async def websocket_center(websocket: WebSocket, center_id: int):
    room = f"center:{center_id}"
    await ws_manager.connect(websocket, room)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room)


@router.websocket("/ws/farmer/{farmer_id}")
async def websocket_farmer(websocket: WebSocket, farmer_id: int):
    room = f"farmer:{farmer_id}"
    await ws_manager.connect(websocket, room)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room)


@router.websocket("/ws/admin")
async def websocket_admin(websocket: WebSocket):
    await ws_manager.connect(websocket, "admin")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, "admin")
