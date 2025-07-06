import { gloabal } from "@/global_styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={[gloabal.container, { gap: 20 }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <View style={{ padding: 4, backgroundColor: "#fff", borderRadius: 12 }}>
          <Ionicons name="flash-sharp" color="#121212" size={22} />
        </View>
        <Text style={gloabal.h1}>EventSync</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          backgroundColor: "#262626",
          paddingBlock: 8,
          paddingInline: 12,
          borderRadius: 30,
        }}
      >
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: "dodgerblue",
            borderRadius: "100%",
          }}
        ></View>
        <Text
          style={{
            fontSize: 12,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Live Updates
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={gloabal.h1}>Join Events</Text>
        <Text style={[gloabal.h1, { color: "#565656" }]}>
          See Who&apos;s Joining
        </Text>
        <Text style={gloabal.h1}>In Real-Time</Text>
      </View>
      <View style={{ alignItems: "center", paddingInline: 40 }}>
        <Text style={[gloabal.p, { textAlign: "center", color: "#565656" }]}>
          Browse college fests, open mics, and tech meetups. Watch attendee
          lists update live as people join.
        </Text>
      </View>
      <Link
        href={"/events"}
        style={[gloabal.button, { width: 300, textAlign: "center" }]}
      >
        <Text style={gloabal.p}>Browse Events</Text>
      </Link>
    </View>
  );
}
