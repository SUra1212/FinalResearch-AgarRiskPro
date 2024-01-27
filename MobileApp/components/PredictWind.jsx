import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { ref, onValue } from "firebase/database"
import { db } from '../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome5'
import COLORS from "../consts/colors";


const PredictWind = () => {
  const [pred_value, setPredValue] = useState(0);
  const [Windspeed, setWindspeed] = useState('');
  const [Humidity, setHumidity] = useState('');
  const [Disease, setDisease] = useState('');
  const [Temperature, setTemperature] = useState('');
  const [error, setError] = useState(null);
  const [showFilterDay, setShowFilterDay] = useState(false);
  const [showFilterStartHour, setShowFilterStartHour] = useState(false);
  const [showFilterEndHour, setShowFilterEndHour] = useState(false);


  const [filterDay, setFilterDay] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');

  //const [filterStartHour, setFilterStartHour] = useState<Date | null>(null);
  const [displayStartTime, setDisplayStartTime] = useState('');
  const [filterStartHour, setFilterStartHour] = useState(new Date());

  const [displayEndTime, setDisplayEndTime] = useState('');
  const [filterEndHour, setFilterEndHour] = useState(new Date());

  const [errorDisease, setErrorDisease] = useState(null);
  const [errorWindspeed, setErrorWindspeed] = useState(null);
  const [errorHumidity, setErrorHumidity] = useState(null);
  const [errorTemperature, setErrorTemperature] = useState(null);

  const onFilterDayChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setShowFilterDay(false);
      if (selectedDate) {
        setDisplayDate(selectedDate.toLocaleDateString());

        const formattedDate = selectedDate.getDate().toString();
        console.log("Selected Day (Day):", formattedDate);
        setFilterDay(formattedDate);
      }
    } else {
      setShowFilterDay(false);
    }
  };

  const onFilterStartHourChange = (event, selectedTime) => {
    if (event.type === 'set') {
      setShowFilterStartHour(false); // Close the picker
      if (selectedTime) {
        setDisplayStartTime(selectedTime.toLocaleTimeString());

        const formatteTime = selectedTime.getHours().toString();
        console.log("Selected time (time):", formatteTime);
        setFilterStartHour(formatteTime);
      }
    } else {
      setShowFilterStartHour(false); // Cancel or dismiss the picker
    }
  };

  const onFilterEndHourChange = (event, selectedTime) => {
    if (event.type === 'set') {
      setShowFilterEndHour(false); // Close the picker
      if (selectedTime) {
        setDisplayEndTime(selectedTime.toLocaleTimeString());

        const formatteTime = selectedTime.getHours().toString();
        console.log("Selected time (time):", formatteTime);
        setFilterEndHour(formatteTime);
      }
    } else {
      setShowFilterEndHour(false); // Cancel or dismiss the picker
    }
  };


  const handleInputChange = (name, value) => {
    switch (name) {
      case 'Disease':
        setDisease(value);
        break;
      case 'Windspeed':
        setWindspeed(value);
        break;
      case 'Humidity':
        setHumidity(value);
        break;
      case 'Temperature':
        setTemperature(value);
        break;
      case 'FilterDay':
        setFilterDay(value);
        break;
      case 'FilterStartHour':
        setFilterStartHour(value);
        break;
      case 'FilterEndHour':
        setFilterEndHour(value);
        break;
      default:
        break;
    }
  };

  function readData() {
    const startCountRef = ref(db);

    onValue(startCountRef, (snapShot) => {
      const data = snapShot.val();

      if (data) {
        let totalWindSpeed = 0;
        let totalTemperature = 0;
        let totalHumidity = 0;
        let dataCount = 0;

        for (const key in data) {
          const entry = data[key];
          const windSpeed = parseFloat(entry.windSpeed);
          const temperature = parseFloat(entry.temperature);
          const humidity = parseFloat(entry.humidity);
          const day = entry.day;
          const hour = entry.hour;

          // Filter by day and hour range
          if (
            day === filterDay &&
            hour >= filterStartHour &&
            hour <= filterEndHour
          ) {
            console.log('Data matches the filter conditions:', entry);

            if (!isNaN(windSpeed) && !isNaN(temperature) && !isNaN(humidity)) {
              totalWindSpeed += windSpeed;
              totalTemperature += temperature;
              totalHumidity += humidity;
              dataCount++;
            }
          }
        }

        if (dataCount > 0) {
          // Calculate average values
          const averageWindSpeed = totalWindSpeed / dataCount / 10;
          const averageTemperature = totalTemperature / dataCount;
          const averageHumidity = totalHumidity / dataCount;

          console.log("Average windSpeed:", averageWindSpeed);
          console.log("Average temperature:", averageTemperature);
          console.log("Average humidity:", averageHumidity);

          // Now you can set these average values as needed
          setHumidity(averageHumidity.toFixed(2));
          setTemperature(averageTemperature.toFixed(2));
          setWindspeed(averageWindSpeed.toFixed(2));
        }
      }
    });
    resetFilter();
  }

  const resetFilter = () => {
    setFilterDay(new Date());
    setFilterStartHour(new Date());
    setFilterEndHour(new Date());
  };

  const validateFields = () => {
    let isValid = true;

    if (!Disease) {
      setErrorDisease('Disease is required');
      isValid = false;
    } else {
      setErrorDisease(null);
    }

    if (!Windspeed) {
      setErrorWindspeed('Wind Speed is required');
      isValid = false;
    } else {
      setErrorWindspeed(null);
    }

    if (!Humidity) {
      setErrorHumidity('Humidity is required');
      isValid = false;
    } else {
      setErrorHumidity(null);
    }

    if (!Temperature) {
      setErrorTemperature('Temperature is required');
      isValid = false;
    } else {
      setErrorTemperature(null);
    }

    if (!filterDay || !filterStartHour || !filterEndHour) {
      setError('Please fill in all date and time fields');
      isValid = false;
    } else {
      setError(null);
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const feature_list = {
        Windspeed: parseFloat(Windspeed),
        Humidity: parseInt(Humidity),
        Temperature: parseFloat(Temperature),
        Disease,
      };
      console.log(feature_list)
      try {
        const response = await axios.post('http://10.0.2.2:5000/api/predict/wind', feature_list);
        console.log("api response code === ", response.data);
        const predValue = response.data.pred_value;
        setPredValue(predValue);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Error predicting spreading time');
      }
      // try {
      //   const URL = "http://20.24.88.138:3002/api/items";
      //   axios.get(URL)
      //     .then(response => {
      //       console.log(" response ========= ", response.status);
      //     })
      //     .catch((error) => {
      //       console.log(error)
      //     });
      // } catch (error) {
      //   console.log(error);
      //   setError('Error predicting spreading time');
      // }
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
 <ImageBackground
      style={{ flex: 1 }}
      source={require("../assets/formbg.jpeg")}
    >
      <ScrollView>
        <View style={{ width: 400, marginTop: "5%" }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 10,
              marginLeft: 20,
            }}
          >
            Disease Spreading Time Duration Predictor by wind
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              height: 850,
              width: 430,
              borderRadius: 45,
              paddingTop: 15,
              marginLeft: -8,
            }}
          >

            <View style={{ marginLeft: 30 }}>

              <View style={styles.inputfield}>
                <Text style={styles.label}>Filter by Day</Text>
                <TouchableOpacity onPress={() => setShowFilterDay(true)}>
                  <View style={styles.inputContainer}>
                    <Icon name="calendar" size={20} color="blue" />
                    <Text style={styles.inputText}>
                      {displayDate || formatDate(filterDay)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {showFilterDay && (
                  <DateTimePicker
                    testID="filterDayPicker"
                    value={filterDay || new Date()} // Provide a default value to avoid the error
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onFilterDayChange}
                  />
                )}
              </View>

              <View>
                <View style={styles.inputfield}>
                  <Text style={styles.label}>Filter by Start Hour</Text>
                  <TouchableOpacity onPress={() => setShowFilterStartHour(true)}>
                    <View style={styles.inputContainer}>
                      <Icon name="clock" size={20} color="blue" />
                      <Text style={styles.inputText}>
                        {displayStartTime || formatTime(filterStartHour)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showFilterStartHour && (
                    <DateTimePicker
                      testID="filterStartHourPicker"
                      value={filterStartHour}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onFilterStartHourChange}
                    />
                  )}
                </View>
                <View style={styles.inputfield}>
                  <Text style={styles.label}>Filter by End Hour</Text>
                  <TouchableOpacity onPress={() => setShowFilterEndHour(true)}>
                    <View style={styles.inputContainer}>
                      <Icon name="clock" size={20} color="blue" />
                      <Text style={styles.inputText}>
                        {displayEndTime || formatTime(filterEndHour)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showFilterEndHour && (
                    <DateTimePicker
                      testID="filterEndHourPicker"
                      value={filterEndHour}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onFilterEndHourChange}
                    />
                  )}
                </View>
              </View>




              <TouchableOpacity style={styles.button}
                onPress={() => {
                  readData();
                  resetFilter();
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 22,
                    color: COLORS.white,
                  }}
                >
                  Live data
                </Text>
              </TouchableOpacity>





              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: COLORS.black,
                    marginLeft: 3,
                    marginTop: 20,
                  }}
                >
                  Disease
                </Text>
                <Picker
                  selectedValue={Disease}
                  onValueChange={(value) => {
                    setDisease(value);
                    setErrorDisease(null);
                  }}
                  style={{
                    borderRadius: 10,
                    color: "black",
                    paddingHorizontal: 10,
                    width: 371,
                    height: 50,
                    backgroundColor: "#90EE90",
                    marginVertical: 10,
                    borderWidth: 1.5,
                    borderColor: COLORS.white,
                    paddingLeft: 20,
                    marginTop: 1,
                  }}
                  placeholderTextColor="grey"
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Anthracnose" value="Anthracnose" />
                  <Picker.Item label="Downy mildew" value="Downy mildew" />
                  <Picker.Item label="Powdery mildew" value="Powdery mildew" />
                  <Picker.Item label="Rust" value="Rust" />
                </Picker>
                {errorDisease && <Text style={styles.error}>{errorDisease}</Text>}
              </View>



              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: COLORS.black,
                  marginLeft: 3,
                  marginTop: 10,
                }}
              >
                Wind Speed(m/s)
              </Text>
              <TextInput
                value={Windspeed}
                onChangeText={(value) => {
                  setWindspeed(value);
                  setErrorWindspeed(null);
                }}
                style={{
                  borderRadius: 10,
                  color: "black",
                  paddingHorizontal: 10,
                  width: 371,
                  height: 50,
                  backgroundColor: "#90EE90",
                  marginVertical: 10,
                  borderWidth: 1.5,
                  borderColor: COLORS.white,
                  paddingLeft: 20,
                  marginTop: 1,
                }}
                placeholderTextColor="grey"
              ></TextInput>
              {errorWindspeed && <Text style={styles.error}>{errorWindspeed}</Text>}


              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: COLORS.black,
                  marginLeft: 3,
                  marginTop: 10,
                }}
              >
                Humidity (%)
              </Text>
              <TextInput
                value={Humidity}
                onChangeText={(value) => {
                  setHumidity(value);
                  setErrorHumidity(null);
                }}
                style={{
                  borderRadius: 10,
                  color: "black",
                  paddingHorizontal: 10,
                  width: 371,
                  height: 50,
                  backgroundColor: "#90EE90",
                  marginVertical: 10,
                  borderWidth: 1.5,
                  borderColor: COLORS.white,
                  paddingLeft: 20,
                  marginTop: 1,
                }}
                placeholderTextColor="grey"
              ></TextInput>
              {errorHumidity && <Text style={styles.error}>{errorHumidity}</Text>}



              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: COLORS.black,
                  marginLeft: 3,
                  marginTop: 10,
                }}
              >
                Temperature(°C)
              </Text>
              <TextInput
                value={Temperature}
                onChangeText={(value) => {
                  setTemperature(value);
                  setErrorTemperature(null);
                }}
                style={{
                  borderRadius: 10,
                  color: "black",
                  paddingHorizontal: 10,
                  width: 371,
                  height: 50,
                  backgroundColor: "#90EE90",
                  marginVertical: 10,
                  borderWidth: 1.5,
                  borderColor: COLORS.white,
                  paddingLeft: 20,
                  marginTop: 1,
                }}
                placeholderTextColor="grey"
              ></TextInput>
              {errorTemperature && <Text style={styles.error}>{errorTemperature}</Text>}


              <TouchableOpacity style={styles.button}
                onPress={handleSubmit}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 22,
                    color: COLORS.white,
                  }}
                >
                  Predict Spreading Time
                </Text>
              </TouchableOpacity>
              <View style={styles.result}>
                {pred_value !== 0 && (
                  <Text style={styles.resultText}>
                    Estimated Spreading Time (days): {pred_value}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  inputfieldRow: {
    flexDirection: "row", // Display items horizontally
    justifyContent: "space-between", // Space them evenly across the row
    marginBottom: 16,
  },
  error: {
    color: "red",
  },
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputText: {
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 2,
    height: 50,
    width: 371,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },

  form: {
    marginVertical: 10,
  },
  inputfield: {
    width: 371,
    height: 70,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
  },
  result: {
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "green",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
});

export default PredictWind;