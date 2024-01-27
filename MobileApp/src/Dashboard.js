import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, {useState, useEffect} from 'react'
import { firebase } from '../config'
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, fetch user data
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setName(snapshot.data()); // Assuming 'firstName' is the field in the user document
            } else {
              console.log("User data does not exist");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        // User is signed out, handle accordingly
        console.log("User is signed out");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={styles.ImageStyle}
          source={require("../assets/dashboardbg.jpg")}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            justifyContent: "center",
          }}
        >
          Hello, {name.firstName}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            justifyContent: "center",
          }}
        >
          Unlocking Plant Health Insights with AgarRiskPro
        </Text>
        <TouchableOpacity
          onPress={() => {
            firebase.auth().signOut();
          }}
          style={styles.buttonSignout}
        >
          <Text style={{ fontSize: 12, fontWeight: "700" }}>Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
    // <SafeAreaView style={styles.container}>
    //   <Text style={{ fontSize: 20, fontWeight: "bold" }}>
    //     Hello, {name.firstName}
    //   </Text>
    //   <TouchableOpacity
    //     onPress={() => {
    //       firebase.auth().signOut();
    //     }}
    //     style={styles.button}
    //   >
    //     <Text style={{ fontSize: 22, fontWeight: "bold" }}>Sign Out</Text>
    //   </TouchableOpacity>
    // </SafeAreaView>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },

  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  ImageStyle: {
    height: 200,
    opacity: 0.7,
    marginLeft: 10,
    marginTop: -45,
    borderRadius: 10,
    width: 400,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
  },
  scrollView: {
    backgroundColor: "#fff",
    marginHorizontal: -20,
  },
  buttonSignout: {
    marginTop: 50,
    height: 40,
    width: 90,
    backgroundColor: "#026efd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginLeft: 250,
    marginBottom: 20,
  },
});

