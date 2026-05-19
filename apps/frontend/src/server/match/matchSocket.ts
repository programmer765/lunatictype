import { SocketMsgCodes, PositionUpdatePayload, MatchSocketMessage } from "@repo/types";
const host : string = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';


type MatchSocketMessageCode = MatchSocketMessage["code"];
type EventCallback = (data: MatchSocketMessage) => void;


class MatchSocket {
  private socket: WebSocket | null = null;
  private listeners: Map<MatchSocketMessageCode, EventCallback[]> = new Map();
  private onErrorCallback: ((error: Event) => void) | null = null;

  connect(matchId: string) {
    // this.matchId = matchId;
    this.socket = new WebSocket(`${host}/match/${matchId}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        this.emit(data.code, data);

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    }

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.listeners.clear();
    }
  }

  sendPositionUpdate(position: number, wpm: number, rawWpm: number) {
    const payload : PositionUpdatePayload = {
      position,
      wpm,
      rawWpm
    }
    const message : MatchSocketMessage = {
      code: SocketMsgCodes.POSITION_UPDATE,
      isError: false,
      payload
    };

    this.send(message)
  }

  sendAck() {
    const message : MatchSocketMessage = {
      code: SocketMsgCodes.CLIENT_READY,
      isError: false,
    }
    this.send(message)
  }

  private send(message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }


  on(code: MatchSocketMessageCode, callback: EventCallback) {
    if (!this.listeners.has(code)) {
      this.listeners.set(code, []);
    }
    this.listeners.get(code)!.push(callback);
  }

  off(code: MatchSocketMessageCode, callback: EventCallback) {
    if (this.listeners.has(code)) {
      const callbacks = this.listeners.get(code)!.filter(cb => cb !== callback);
      this.listeners.set(code, callbacks);
    }
  }

  private emit(code: MatchSocketMessageCode, data: MatchSocketMessage) {
    if (this.listeners.has(code)) {
      this.listeners.get(code)!.forEach(callback => callback(data));
    }
  }


}


export const matchSocket = new MatchSocket();