import { gloabal } from "@/global_styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { formatData } from "@/utils/formatData";

interface EventCardProps {
  id: string;
  name: string;
  location: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventCard({ data }: { data: EventCardProps }) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/events/${data.id}`)}>
      <View
        style={{
          flexDirection: "column",
          position: "relative",
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#565656",
          gap: 10,
          width: 300,
        }}
      >
        <View>
          <Text style={gloabal.h1}>{data.name}</Text>
        </View>
        <View
          style={{
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: "#565656",
          }}
        >
          <View style={styles.field}>
            <Ionicons name="location-outline" size={24} color="#565656" />
            <Text style={gloabal.p}>{data.location}</Text>
          </View>
          <View style={styles.field}>
            <Ionicons name="time-outline" size={22} color="#565656" />
            <Text style={gloabal.p}>{formatData(data.startTime)}</Text>
          </View>
        </View>
        <View>
          <View style={styles.field}>
            <Ionicons name="add-outline" size={24} color="#565656" />
            <Text style={{ fontSize: 12, color: "#565656" }}>
              Created: {formatData(data.createdAt)}
            </Text>
          </View>
          <View style={styles.field}>
            <Ionicons name="create-outline" size={24} color="#565656" />
            <Text style={{ fontSize: 12, color: "#565656" }}>
              Updated: {formatData(data.updatedAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
