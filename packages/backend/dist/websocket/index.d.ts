import { Server as SocketIOServer } from 'socket.io';
export declare const setupWebSocket: (io: SocketIOServer) => SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const emitToUser: (io: SocketIOServer, userId: string, event: string, data: unknown) => void;
export declare const emitToHelpers: (io: SocketIOServer, event: string, data: unknown) => void;
export declare const emitToSession: (io: SocketIOServer, sessionId: string, event: string, data: unknown) => void;
//# sourceMappingURL=index.d.ts.map