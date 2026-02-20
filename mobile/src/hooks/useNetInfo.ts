import { useState, useEffect } from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export function useNetInfo(): boolean {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  useEffect(() => {
    const sub = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? null);
    });
    NetInfo.fetch().then((s) => setIsConnected(s.isConnected ?? null));
    return () => sub();
  }, []);
  return isConnected === true;
}
