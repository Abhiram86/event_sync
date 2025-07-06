import { leaveEvent } from "@/api/event";
import { gloabal } from "@/global_styles";
import useUserStore from "@/store/User";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
}

interface AttendeesProps {
  id: string;
  attendees: User[];
}

export default function Attendees({ id, attendees }: AttendeesProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>(attendees);
  const { user } = useUserStore();

  useEffect(() => {
    setUsers([...attendees]);
  }, [attendees]);

  useEffect(() => {
    const socket = io("http://192.168.1.6:8080", {
      transports: ["websocket"],
    });
    setSocket(socket);
    socket.on("connect", () => {
      console.log("connected to server");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", id);

    const hanldeUserJoined = (data: User) => {
      setUsers((prev) => [...prev, data]);
      console.log("user joined", data);
    };

    const handleUserLeft = (userId: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    socket.on("userJoined", hanldeUserJoined);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.emit("leaveRoom", id);
      console.log("left room", id);
      socket.off("userJoined", hanldeUserJoined);
      socket.off("userLeft", handleUserLeft);
    };
  }, [socket, id]);

  const RenderItem = ({ item }: { item: User }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            height: 25,
            width: 25,
            backgroundColor: "#565656",
            borderRadius: "100%",
          }}
        ></View>
        <Text style={gloabal.p}>{item.name}</Text>
      </View>
      {user?.id === item.id && (
        <TouchableOpacity
          onPress={() => leaveEvent(id)}
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "red",
              fontSize: 14,
            }}
          >
            Leave
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "semibold",
          color: "#fff",
          marginBottom: 15,
        }}
      >
        Attendees ({users.length})
      </Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
        ListEmptyComponent={() => <Text style={gloabal.p}>No attendees</Text>}
      />
    </View>
  );
}
