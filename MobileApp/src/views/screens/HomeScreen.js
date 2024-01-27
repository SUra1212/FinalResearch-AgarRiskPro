import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../../consts/colors";
import places from "../../../consts/places";
// import blogs from "../../../consts/blogs";
import pic1 from "../../../assets/dataAnalysis.png";
import pic2 from "../../../assets/solutions.png";
import pic3 from "../../../assets/reliable.png";
import pic4 from "../../../assets/efficiency.png";

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("screen");

const HomeScreen = ({ navigation }) => {
  const handleImagePress = (id) => {
    switch (id) {
      case "1":
        navigation.navigate("PredictRemedy");
        break;
      case "2":
        navigation.navigate("PredictSeverity");
        break;
      case "3":
        navigation.navigate("PredictWind");
        break;
      case "4":
        navigation.navigate("EarlyRisk");
        break;
      // Add more cases for other ids if needed
      default:
        // Do nothing for other ids
        break;
    }
  };
  const categoryIcons = [
    <Icon name="public" size={25} color={COLORS.green} />,
    <FontAwesomeIcon name="tree" size={25} color={COLORS.green} />,
    <Icon name="privacy-tip" size={25} color={COLORS.green} />,
    <Icon name="mail" size={25} color={COLORS.green} />,
  ];
  const ListCategories = () => {
    return (
      <View style={style.categoryContainer}>
        {categoryIcons.map((icon, index) => (
          <View key={index} style={style.iconContainer}>
            {icon}
          </View>
        ))}
      </View>
    );
  };

  const Card = ({ place }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleImagePress(place.id)}
      >
        <ImageBackground style={style.cardImage} source={place.image}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {place.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon name="place" size={20} color={COLORS.white} />
              <Text style={{ marginLeft: 5, color: COLORS.white }}>
                {/* {place.location} */}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={20} color={COLORS.white} />
              {/* <Text style={{marginLeft: 5, color: COLORS.white}}>5.0</Text> */}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const RecommendedCard = ({ place }) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <ImageBackground style={style.rmCardImage} source={place.image}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {place.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{ width: "100%", flexDirection: "row", marginTop: 10 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon name="place" size={22} color={COLORS.white} />
                <Text style={{ color: COLORS.white, marginLeft: 5 }}>
                  {/* {place.location} */}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Icon name="star" size={22} color={COLORS.white} />
                {/* <Text style={{ color: COLORS.white, marginLeft: 5 }}>5.0</Text> */}
              </View>
            </View>
            <Text style={{ color: COLORS.white, fontSize: 13 }}>
              {/* {place.details} */}
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  };
  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <StatusBar translucent={false} backgroundColor={COLORS.green} />
        <View style={style.header}>
          <Icon name="sort" size={28} color={COLORS.white} />
          <Icon name="notifications-none" size={28} color={COLORS.white} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: COLORS.green,
              height: 120,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={style.headerTitle}>AgarwoodCare:</Text>
              <Text style={style.headerTitle}>Health Solution Hub</Text>
              <View style={style.inputContainer}>
                <Icon name="search" size={28} />
                <TextInput
                  placeholder="Search here"
                  style={{ color: COLORS.grey, marginLeft: 10}}
                />
              </View>
            </View>
          </View>
          <ListCategories />
          <Text style={style.sectionTitle}>Services</Text>
          <View>
            <FlatList
              contentContainerStyle={{ paddingLeft: 20 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={places}
              renderItem={({ item }) => <Card place={item} />}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={style.sectionTitle}>Why AgarRisPro?</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 100, marginRight: 20 }}>
                  <Image source={pic1} style={{ width: 100, height: 100 }} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  Comprehensive Data Analysis
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    alignItems: "center",
                    marginBottom: 25,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  We delve deep into sensor-collected data, offering nuanced
                  insights for precise predictions
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 100, marginRight: 20 }}>
                  <Image source={pic2} style={{ width: 100, height: 100 }} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  Tailored Solutions
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    alignItems: "center",
                    marginBottom: 25,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  Our predictions and remedies are customized to specific plant
                  conditions, ensuring the most effective care
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 100, marginRight: 20 }}>
                  <Image source={pic3} style={{ width: 100, height: 100 }} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  Reliability
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    alignItems: "center",
                    marginLeft: 20,
                    marginBottom: 10,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  AgarRiskPro's algorithms are built on robust scientific
                  foundations, providing dependable predictions for informed
                  decision-making
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 100, marginRight: 20 }}>
                  <Image source={pic4} style={{ width: 100, height: 100 }} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  Efficiency
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    alignItems: "center",
                    marginLeft: 20,
                    marginBottom: 10,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  By leveraging technology, we streamline plant care, saving
                  time and resources while maximizing Agarwood yields
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.green,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 23,
  },
  inputContainer: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    position: "absolute",
    top: 90,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 12,
  },
  categoryContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginVertical: 20,
    fontWeight: "bold",
    fontSize: 30,
  },
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  rmCardImage: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
});
export default HomeScreen;
