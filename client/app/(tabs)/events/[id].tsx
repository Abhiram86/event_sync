import { getEvent, joinEvent } from "@/api/event";
import { gloabal } from "@/global_styles";
import { formatData } from "@/utils/formatData";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Attendees from "@/components/Attendees";

export default function Event() {
  const { id } = useLocalSearchParams();

  const {
    data: res,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <View style={gloabal.container}>
        <Text style={gloabal.p}>Loading...</Text>
      </View>
    );

  if (isError) {
    console.log(error);
    return (
      <View style={gloabal.container}>
        <Text style={gloabal.p}>Error Loading Event</Text>
      </View>
    );
  }

  if (res?.error) {
    console.error("API Error for event:", res.error);
    return (
      <View style={gloabal.container}>
        <Text style={gloabal.p}>API Error: {res.error}</Text>
      </View>
    );
  }

  console.log("event is ", res?.data.event);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={gloabal.h1}>{res?.data.event.name}</Text>
          <TouchableOpacity
            onPress={() => joinEvent(id as string)}
            style={gloabal.button}
          >
            <Text style={gloabal.p}>Enter Event</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={gloabal.p}>{res?.data.event.location}</Text>
          <Text style={gloabal.p}>{formatData(res?.data.event.startTime)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Attendees id={id as string} attendees={res?.data.event.attendees} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    flexDirection: "column",
    alignItems: "center",
  },
});
