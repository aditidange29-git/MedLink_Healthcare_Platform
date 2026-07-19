"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL ?? "http://localhost:5000";
const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }] };

export default function useWebRTC(roomId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket & { targetSocketId?: string } | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);

  const createPC = useCallback(() => {
    const pc = new RTCPeerConnection(ICE);
    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current)
        socketRef.current.emit("ice-candidate", { candidate: e.candidate, to: socketRef.current.targetSocketId });
    };
    pc.ontrack = (e) => { setRemoteStream(e.streams[0]); setIsConnected(true); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setIsConnected(false); setRemoteStream(null);
      }
    };
    return pc;
  }, []);

  const joinRoom = useCallback(async (userId: string, role: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream); localRef.current = stream;
      const s = io(SIGNALING_URL, { transports: ["websocket"] }) as Socket & { targetSocketId?: string };
      socketRef.current = s;
      s.on("connect", () => s.emit("join-room", { roomId, userId, role }));
      s.on("existing-users", async (users: { socketId: string }[]) => {
        if (!users.length) return;
        s.targetSocketId = users[0].socketId;
        const pc = createPC(); pcRef.current = pc;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        s.emit("offer", { offer, to: users[0].socketId });
      });
      s.on("user-joined", ({ socketId }: { socketId: string }) => { s.targetSocketId = socketId; });
      s.on("offer", async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
        s.targetSocketId = from;
        const pc = createPC(); pcRef.current = pc;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        s.emit("answer", { answer, to: from });
      });
      s.on("answer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        if (pcRef.current) await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      });
      s.on("ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (pcRef.current && candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
      s.on("user-left", () => { setRemoteStream(null); setIsConnected(false); pcRef.current?.close(); pcRef.current = null; });
    } catch (err) {
      setError("Failed to access camera/microphone. Please grant permissions.");
      throw err;
    }
  }, [roomId, createPC]);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit("leave-room"); socketRef.current?.disconnect();
    pcRef.current?.close(); pcRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop()); localRef.current = null;
    setLocalStream(null); setRemoteStream(null); setIsConnected(false);
  }, []);

  const sendData = useCallback((data: unknown) => {
    if (socketRef.current && isConnected) socketRef.current.emit("data-message", data);
  }, [isConnected]);

  const toggleAudio = useCallback(() => {
    const t = localRef.current?.getAudioTracks()[0];
    if (t) { t.enabled = !t.enabled; return t.enabled; } return false;
  }, []);

  const toggleVideo = useCallback(() => {
    const t = localRef.current?.getVideoTracks()[0];
    if (t) { t.enabled = !t.enabled; return t.enabled; } return false;
  }, []);

  useEffect(() => () => leaveRoom(), [leaveRoom]);
  return { localStream, remoteStream, isConnected, error, joinRoom, leaveRoom, sendData, toggleAudio, toggleVideo };
}
