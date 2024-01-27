import { View, ImageBackground } from 'react-native'
import React from 'react'

const Background = ({ children }) => {
  return (
    <View>
      <ImageBackground
        source={require("../assets/obbg.jpeg")}
        style={{ height: "100%" }}
      />
      <View>{children}</View>
    </View>
  );
};

export default Background