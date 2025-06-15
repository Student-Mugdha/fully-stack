import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from Socket.IO server:", reason);
});

export default socket;
