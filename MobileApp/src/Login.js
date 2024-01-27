import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import COLORS from "../consts/colors";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //validate error message
  const validate = () => {
    if (!email.includes("@")) {
      setEmailError("Invalid Email");
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
    } else if (email.length === 0) {
      setEmailError("Email is required!");
    } else if (email.indexOf(" ") >= 0) {
      setEmailError("Email cannot contain spaces");
    } else if (password.indexOf(" ") >= 0) {
      setPasswordError("Password cannot contain spaces");
    } else {
      setEmailError("");
      setPasswordError("");
    }
  };

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);

      navigation.navigate("HomeScreen");
    } catch (error) {
      alert(error.message);
    }
  };

  const forgetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    // <View style={styles.container}>
    //   <Text style={{ fontWeight: "700", fontSize: 26, marginTop: 140 }}>
    //     Login
    //   </Text>
    //   <View style={{ marginTop: 40 }}>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="Email"
    //       onChangeText={(email) => setEmail(email)}
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //     />
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="Password"
    //       onChangeText={(password) => setPassword(password)}
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //       secureTextEntry={true}
    //     />
    //   </View>
    //   <TouchableOpacity
    //     onPress={() => {
    //       loginUser(email, password);
    //       validate();
    //       navigation.navigate("HomeScreen");
    //     }}
    //     style={styles.button}
    //   >
    //     <Text style={{ fontWeight: "700", fontSize: 22 }}>Login</Text>
    //   </TouchableOpacity>

    //   <Text style={styles.error}>{emailError}</Text>
    //   {/* <Text style={styles.error}>{passwordError}</Text> */}
    //   <TouchableOpacity
    //     onPress={() => navigation.navigate("Registration")}
    //     style={{ marginTop: 20 }}
    //   >
    //     <Text style={{ fontWeight: "700", fontSize: 16 }}>
    //       Don't have an account?{" "}
    //       <Text style={{ color: "blue" }}>Register now</Text>
    //     </Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     onPress={() => {
    //       forgetPassword();
    //     }}
    //     style={{ marginTop: 20 }}
    //   >
    //     <Text style={{ fontWeight: "700", fontSize: 16 }}>
    //       Forget Password?
    //     </Text>
    //   </TouchableOpacity>
    // </View>

    <ImageBackground
      style={{ flex: 1 }}
      source={require("../assets/obbg.jpeg")}
    >
      <View style={{ alignItems: "center", width: 400, marginTop: "10%" }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 64,
            fontWeight: "bold",
            marginVertical: 20,
            marginBottom: 100,
          }}
        >
          Login
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            height: 750,
            width: 430,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 40, color: COLORS.green, fontWeight: "bold" }}
          >
            Welcome Back!
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 19,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Login to your account
          </Text>
          <TextInput
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              borderRadius: 100,
              color: COLORS.green,
              paddingHorizontal: 10,
              width: "80%",
              height: "8%",
              backgroundColor: "rgb(184, 184, 180)",
              marginVertical: 10,
              borderWidth: 1.5,
              borderColor: COLORS.green,
              paddingLeft: 20,
            }}
            // placeholderTextColor={COLORS.green}
          ></TextInput>

          <TextInput
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={{
              borderRadius: 100,
              color: COLORS.green,
              paddingHorizontal: 10,
              width: "80%",
              height: "8%",
              backgroundColor: "rgb(184, 184, 180)",
              marginVertical: 10,
              borderWidth: 1.5,
              borderColor: COLORS.green,
              paddingLeft: 20,
            }}
            // placeholderTextColor={COLORS.green}
          ></TextInput>
          <View
            style={{
              alignItems: "flex-end",
              width: "78%",
              paddingRight: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                forgetPassword();
              }}
            >
              <Text
                style={{
                  color: COLORS.green,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              loginUser(email, password);
              validate();
              // navigation.navigate("HomeScreen");
            }}
            style={styles.button}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 22, color: COLORS.white }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <Text style={styles.error}>{emailError}</Text>
          <Text style={styles.error}>{passwordError}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Don't have an account ?{" "}
              <Text
                style={{
                  color: COLORS.green,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Register now
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: -40,
    backgroundColor: "#fff",
  },

  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    textAlign: "center",
  },

  button: {
    marginTop: 60,
    height: 50,
    width: 320,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  error: {
    color: "red",
  },
});
