import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
// import {Colors} from 'react-native/Libraries/NewAppScreen';
import COLORS from "../../../consts/colors";

// const { width, height } = Dimensions.get("window");

const OnBoardScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../../../assets/obbg.jpeg")}
      >
        <View style={style.details}>
          <Text
            style={{ color: COLORS.white, fontSize: 35, fontWeight: "bold" }}
          >
            AgarRiskPro:
          </Text>
          <Text
            style={{ color: COLORS.white, fontSize: 35, fontWeight: "bold" }}
          >
            Cultivating Plant Health Excellence
          </Text>
          <Text style={{ color: COLORS.white, lineHeight: 25, marginTop: 15 }}>
            Real-time insights, personalized tips—boost your crops' health and
            yield with AgarRiskPro.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
            <View style={style.btn}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.white,
                }}
              >
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const style = StyleSheet.create({
  details: {
    height: "50%",
    bottom: 0,
    position: "absolute",
    paddingHorizontal: 40,
  },
  btn: {
    height: 50,
    width: 120,
    backgroundColor: COLORS.green,
    marginTop: 20,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OnBoardScreen;
