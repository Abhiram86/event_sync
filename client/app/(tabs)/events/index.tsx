import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { gloabal } from "@/global_styles";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/api/event";
import EventCard from "@/components/EventCard";

export default function Events() {
  const {
    data: res,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });

  if (isError) console.log(error);

  if (isLoading)
    return (
      <View style={gloabal.container}>
        <Text style={gloabal.p}>Loading...</Text>
      </View>
    );

  // console.log({
  //   events: res?.data.events,
  // });

  return (
    <View style={styles.container}>
      <FlatList
        data={res?.data.events}
        renderItem={({ item }) => <EventCard data={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
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
