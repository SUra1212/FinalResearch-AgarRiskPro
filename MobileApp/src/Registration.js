import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../config";
import COLORS from "../consts/colors";

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //validate email and password
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

  //user register
  registerUser = async (email, password, firstName, lastName) => {
    try {
      // Create a user with email and password
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Get the user object from the userCredential
      const user = userCredential.user;

      // Check if user is successfully created
      if (user) {
        // Store user details in Firestore
        navigation.navigate("Login");

        await firebase.firestore().collection("users").doc(user.uid).set({
          firstName,
          lastName,
          email,
        });
        

        // Registration successful, navigate to the next screen or perform any other action
        console.log("Registration successful!");
      } else {
        // User is null, handle accordingly
        console.error("User is null");
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle registration errors
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    // <View style={StyleSheet.container}>
    //   <Text
    //     style={{
    //       fontWeight: "700",
    //       fontSize: 23,
    //       marginTop: 40,
    //       marginLeft: 30,
    //     }}
    //   >
    //     Register Here!
    //   </Text>
    //   <View style={{ marginTop: 40 }}>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="First Name"
    //       onChangeText={(firstName) => setFirstName(firstName)}
    //       autoCorrect={false}
    //     ></TextInput>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="Last Name"
    //       onChangeText={(lastName) => setLastName(lastName)}
    //       autoCorrect={false}
    //     ></TextInput>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="Email"
    //       onChangeText={(email) => setEmail(email)}
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //       keyboardType="email-address"
    //     ></TextInput>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="Password"
    //       onChangeText={(password) => setPassword(password)}
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //       secureTextEntry={true}
    //     ></TextInput>
    //   </View>
    //   <TouchableOpacity
    //     onPress={() =>
    //       registerUser(email, password, firstName, lastName) && validate()
    //     }
    //     style={styles.button}
    //   >
    //     <Text style={{ fontWeight: "700", fontSize: 22 }}>Register</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     onPress={() => navigation.navigate("Login")}
    //     style={{
    //       marginTop: 20,
    //       alignItems: "center",
    //       justifyContent: "center",
    //     }}
    //   >
    //     <Text style={{ fontWeight: "700", fontSize: 16 }}>
    //       Already have an account? <Text style={{ color: "blue" }}>Login</Text>
    //     </Text>
    //   </TouchableOpacity>
    //   <View style={styles.error}>
    //     <Text style={styles.error}>{emailError}</Text>
    //     {/* <Text style={styles.error}>{passwordError}</Text> */}
    //   </View>
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
            marginTop: 20,
          }}
        >
          Register
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 16,
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          Create a new account
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
          <TextInput
            placeholder="First Name"
            onChangeText={(firstName) => setFirstName(firstName)}
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
            placeholder="Last Name"
            onChangeText={(lastName) => setLastName(lastName)}
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
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
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

          <TouchableOpacity
            onPress={() => {
              registerUser(email, password, firstName, lastName);
              validate();
            }}
            style={styles.button}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 22, color: COLORS.white }}
            >
              Register
            </Text>
          </TouchableOpacity>
          <Text style={styles.error}>{emailError}</Text>
          <Text style={styles.error}>{passwordError}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Already have an account ?{" "}
              <Text
                style={{
                  color: COLORS.green,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#C0E8DA",
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
    color: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
