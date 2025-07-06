import { gloabal } from "@/global_styles";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { login, register } from "@/api/auth";
import useUserStore from "@/store/User";
import { saveToken } from "@/utils/SecureStore";
import { Redirect } from "expo-router";

export default function About() {
  const { user, setUser } = useUserStore();
  const [isLogging, setIsLogging] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  const handleLogin = async () => {
    // console.log("handleLogin called!");
    const res = await login({ email, password });
    if (res.error) return console.log(res.error);
    setUser(res.data.login.user);
    saveToken(res.data.login.token);
    console.log("user is ", res.data.login.user);

    console.log(res);
  };

  const handleRegister = async () => {
    const res = await register({ name, email, password });
    if (res.error) return console.log(res.error);
    setUser(res.data.register.user);
    saveToken(res.data.register.token);
    console.log(res);
  };

  const handleSubmit = async () => {
    // console.log("handleSubmit called!");
    if (isLogging) await handleLogin();
    else await handleRegister();
  };

  return (
    <View style={gloabal.container}>
      <View
        style={{
          flexDirection: "column",
          gap: 5,
        }}
      >
        {!isLogging && (
          <View style={{ flexDirection: "column", gap: 5 }}>
            <Text style={gloabal.p}>Name</Text>
            <TextInput
              onChangeText={(text) => setName(text)}
              style={styles.input}
            ></TextInput>
          </View>
        )}
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={gloabal.p}>Email</Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={gloabal.p}>Password</Text>
          <TextInput
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
          ></TextInput>
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={handleSubmit} style={gloabal.button}>
            <Text style={gloabal.p}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 2, flexDirection: "row", gap: 3 }}>
          <Text
            style={{
              color: "#646464",
            }}
          >
            Don&apos;t have an account?
          </Text>
          <Text
            onPress={() => setIsLogging((prev) => !prev)}
            style={[gloabal.p, { color: "dodgerblue" }]}
          >
            {isLogging ? "Login" : "Register"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    padding: 15,
    color: "#fff",
    width: 250,
    borderRadius: 12,
  },
});
