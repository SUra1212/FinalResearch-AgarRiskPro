import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ref, onValue } from "firebase/database"
import { db } from '../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome5'
import COLORS from "../consts/colors";


const EarlyRisk = () => {
    const [pred_value, setPredValue] = useState(0);
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [error, setError] = useState(null);
    const [showFilterDay, setShowFilterDay] = useState(false);
    const [showFilterStartHour, setShowFilterStartHour] = useState(false);
    const [showFilterEndHour, setShowFilterEndHour] = useState(false);

    const [errorNitrogen, setErrorNitrogen] = useState(null);
    const [errorphosphorus, setErrorPhosphorus] = useState(null);
    const [errorpotassium, setErrorPotassium] = useState(null);
    const [errortemperature, setErrorTemperature] = useState(null);
    const [errorhumidity, setErrorHumidity] = useState(null);


    const [filterDay, setFilterDay] = useState(new Date());
    const [displayDate, setDisplayDate] = useState('');

    const [displayStartTime, setDisplayStartTime] = useState('');
    const [filterStartHour, setFilterStartHour] = useState(new Date());

    const [displayEndTime, setDisplayEndTime] = useState('');
    const [filterEndHour, setFilterEndHour] = useState(new Date());


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
            case 'nitrogen':
                setNitrogen(value);
                break;
            case 'phosphorus':
                setPhosphorus(value);
                break;
            case 'potassium':
                setPotassium(value);
                break;
            case 'temperature':
                setTemperature(value);
                break;
            case 'humidity':
                setHumidity(value);
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
                let totalNitrogen = 0;
                let totalPhosphorus = 0;
                let totalPotassium = 0;
                let totalTemperature = 0;
                let totalHumidity = 0;
                let dataCount = 0;

                for (const key in data) {
                    const entry = data[key];
                    const nitrogenValue = parseFloat(entry.nitrogenValue);
                    const phosphorousValue = parseFloat(entry.phosphorousValue);
                    const potassiumValue = parseFloat(entry.potassiumValue);
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

                        if (!isNaN(nitrogenValue) && !isNaN(phosphorousValue) && !isNaN(potassiumValue) && !isNaN(temperature) && !isNaN(humidity)) {
                            totalNitrogen += nitrogenValue;
                            totalPhosphorus += phosphorousValue;
                            totalPotassium += potassiumValue;
                            totalTemperature += temperature;
                            totalHumidity += humidity;
                            dataCount++;
                        }
                    }
                }

                if (dataCount > 0) {
                    // Calculate average values
                    const averageNitrogen = totalNitrogen / dataCount;
                    const averagePhosphorus = totalPhosphorus / dataCount;
                    const averagePotassium = totalPotassium / dataCount;
                    const averageTemperature = totalTemperature / dataCount;
                    const averageHumidity = totalHumidity / dataCount;

                    console.log("Average nitrogen:", averageNitrogen);
                    console.log("Average averagePhosphorus:", averagePhosphorus);
                    console.log("Average averagePotassium:", averagePotassium);
                    console.log("Average temperature:", averageTemperature);
                    console.log("Average humidity:", averageHumidity);

                    // Now you can set these average values as needed
                    setNitrogen(averageNitrogen.toFixed(2))
                    setPhosphorus(averagePhosphorus.toFixed(2))
                    setPotassium(averagePotassium.toFixed(2))
                    setHumidity(averageHumidity.toFixed(2));
                    setTemperature(averageTemperature.toFixed(2));

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

        if (!nitrogen) {
            setErrorNitrogen('Nitrogen is required');
            isValid = false;
        } else {
            setErrorNitrogen(null);
        }
        if (!phosphorus) {
            setErrorPhosphorus('Phosphorus is required');
            isValid = false;
        } else {
            setErrorPhosphorus(null);
        }

        if (!potassium) {
            setErrorPotassium('Potassium is required');
            isValid = false;
        } else {
            setErrorPotassium(null);
        }

        if (!humidity) {
            setErrorHumidity('Humidity is required');
            isValid = false;
        } else {
            setErrorHumidity(null);
        }

        if (!temperature) {
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
                nitrogen: parseInt(nitrogen),
                phosphorus: parseFloat(phosphorus),
                potassium: parseInt(potassium),
                temperature: parseFloat(temperature),
                humidity: parseInt(humidity),
            };
            console.log(feature_list)
            try {
                const response = await axios.post('http://10.0.2.2:5000/api/predict/EarlyRisk', feature_list);
                console.log("api response code === ", response.data);
                const predValue = response.data.pred_value;
                setPredValue(predValue);
                setError(null);
            } catch (error) {
                console.error(error);
                setError('Error');
            }
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
                        Early Disease Risk Predictor
                    </Text>
                    <View
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            height: 1050,
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

                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    color: COLORS.black,
                                    marginLeft: 3,
                                    marginTop: 10,
                                }}
                            >
                                Nitrogen Level (mg/kg)
                            </Text>
                            <TextInput
                                value={nitrogen}
                                onChangeText={(value) => {
                                    setNitrogen(value);
                                    setErrorNitrogen(null);
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
                            {errorNitrogen && <Text style={styles.error}>{errorNitrogen}</Text>}

                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    color: COLORS.black,
                                    marginLeft: 3,
                                    marginTop: 10,
                                }}
                            >
                                Phosphorus Level (mg/kg)
                            </Text>
                            <TextInput
                                value={phosphorus}
                                onChangeText={(value) => {
                                    setPhosphorus(value);
                                    setErrorPhosphorus(null);
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
                            {errorphosphorus && <Text style={styles.error}>{errorphosphorus}</Text>}


                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    color: COLORS.black,
                                    marginLeft: 3,
                                    marginTop: 10,
                                }}
                            >
                                Potassium Level (mg/kg)
                            </Text>
                            <TextInput
                                value={potassium}
                                onChangeText={(value) => {
                                    setPotassium(value);
                                    setErrorPotassium(null);
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
                            {errorpotassium && <Text style={styles.error}>{errorpotassium}</Text>}


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
                                value={humidity}
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
                            {errorhumidity && <Text style={styles.error}>{errorhumidity}</Text>}



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
                                value={temperature}
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
                            {errortemperature && <Text style={styles.error}>{errortemperature}</Text>}


                            <TouchableOpacity style={styles.button}
                                onPress={handleSubmit}>
                                <Text
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 22,
                                        color: COLORS.white,
                                    }}
                                >
                                    Predict Early Risk
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.result}>
                                {pred_value === 1.0 && (
                                    <Text style={styles.resultText}>Alert: 10% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 2.0 && (
                                    <Text style={styles.resultText}>Alert: 15% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 3.0 && (
                                    <Text style={styles.resultText}>Alert: 15.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 4.0 && (
                                    <Text style={styles.resultText}>Alert: 16% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 5.0 && (
                                    <Text style={styles.resultText}>Alert: 16.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 6.0 && (
                                    <Text style={styles.resultText}>Alert: 17% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 7.0 && (
                                    <Text style={styles.resultText}>Alert: 17.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 8.0 && (
                                    <Text style={styles.resultText}>Alert: 18% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 9.0 && (
                                    <Text style={styles.resultText}>Alert: 18.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 10.0 && (
                                    <Text style={styles.resultText}>Alert: 19% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 11.0 && (
                                    <Text style={styles.resultText}>Alert: 19.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 12.0 && (
                                    <Text style={styles.resultText}>Alert: 20% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 13.0 && (
                                    <Text style={styles.resultText}>Alert: 20.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 14.0 && (
                                    <Text style={styles.resultText}>Alert: 21% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 15.0 && (
                                    <Text style={styles.resultText}>Alert: 21.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 16.0 && (
                                    <Text style={styles.resultText}>Alert: 22% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 17.0 && (
                                    <Text style={styles.resultText}>Alert: 22.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 18.0 && (
                                    <Text style={styles.resultText}>Alert: 23% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 19.0 && (
                                    <Text style={styles.resultText}>Alert: 23.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 20.0 && (
                                    <Text style={styles.resultText}>Alert: 24% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 21.0 && (
                                    <Text style={styles.resultText}>Alert: 24.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 22.0 && (
                                    <Text style={styles.resultText}>Alert: 25% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 23.0 && (
                                    <Text style={styles.resultText}>Alert: 25.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 24.0 && (
                                    <Text style={styles.resultText}>Alert: 26% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 25.0 && (
                                    <Text style={styles.resultText}>Alert: 26.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 26.0 && (
                                    <Text style={styles.resultText}>Alert: 27% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 27.0 && (
                                    <Text style={styles.resultText}>Alert: 27.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 28.0 && (
                                    <Text style={styles.resultText}>Alert: 28% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 29.0 && (
                                    <Text style={styles.resultText}>Alert: 28.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 30.0 && (
                                    <Text style={styles.resultText}>Alert: 29% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 31.0 && (
                                    <Text style={styles.resultText}>Alert: 29.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 32.0 && (
                                    <Text style={styles.resultText}>Alert: 30% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 33.0 && (
                                    <Text style={styles.resultText}>Alert: 30.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 34.0 && (
                                    <Text style={styles.resultText}>Alert: 31% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 35.0 && (
                                    <Text style={styles.resultText}>Alert: 31.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 36.0 && (
                                    <Text style={styles.resultText}>Alert: 32% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 37.0 && (
                                    <Text style={styles.resultText}>Alert: 32.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 38.0 && (
                                    <Text style={styles.resultText}>Alert: 33% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 39.0 && (
                                    <Text style={styles.resultText}>Alert: 33.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 40.0 && (
                                    <Text style={styles.resultText}>Alert: 34% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 41.0 && (
                                    <Text style={styles.resultText}>Alert: 34.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 42.0 && (
                                    <Text style={styles.resultText}>Alert: 35% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 43.0 && (
                                    <Text style={styles.resultText}>Alert: 35.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 44.0 && (
                                    <Text style={styles.resultText}>Alert: 36% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 45.0 && (
                                    <Text style={styles.resultText}>Alert: 36.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 46.0 && (
                                    <Text style={styles.resultText}>Alert: 37% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 47.0 && (
                                    <Text style={styles.resultText}>Alert: 37.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 48.0 && (
                                    <Text style={styles.resultText}>Alert: 38% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 49.0 && (
                                    <Text style={styles.resultText}>Alert: 38.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 50.0 && (
                                    <Text style={styles.resultText}>Alert: 39% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 51.0 && (
                                    <Text style={styles.resultText}>Alert: 39.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 52.0 && (
                                    <Text style={styles.resultText}>Alert: 40% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 53.0 && (
                                    <Text style={styles.resultText}>Alert: 40.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 54.0 && (
                                    <Text style={styles.resultText}>Alert: 41% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 55.0 && (
                                    <Text style={styles.resultText}>Alert: 41.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 56.0 && (
                                    <Text style={styles.resultText}>Alert: 42% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 57.0 && (
                                    <Text style={styles.resultText}>Alert: 42.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 58.0 && (
                                    <Text style={styles.resultText}>Alert: 43% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 59.0 && (
                                    <Text style={styles.resultText}>Alert: 43.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 60.0 && (
                                    <Text style={styles.resultText}>Alert: 44% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 61.0 && (
                                    <Text style={styles.resultText}>Alert: 44.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 62.0 && (
                                    <Text style={styles.resultText}>Alert: 45% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 63.0 && (
                                    <Text style={styles.resultText}>Alert: 45.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 64.0 && (
                                    <Text style={styles.resultText}>Alert: 46% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 65.0 && (
                                    <Text style={styles.resultText}>Alert: 46.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 66.0 && (
                                    <Text style={styles.resultText}>Alert: 47% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 67.0 && (
                                    <Text style={styles.resultText}>Alert: 47.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 68.0 && (
                                    <Text style={styles.resultText}>Alert: 48% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 69.0 && (
                                    <Text style={styles.resultText}>Alert: 48.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 70.0 && (
                                    <Text style={styles.resultText}>Alert: 49% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 71.0 && (
                                    <Text style={styles.resultText}>Alert: 49.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 72.0 && (
                                    <Text style={styles.resultText}>Alert: 50% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 73.0 && (
                                    <Text style={styles.resultText}>Alert: 50.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 74.0 && (
                                    <Text style={styles.resultText}>Alert: 51% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 75.0 && (
                                    <Text style={styles.resultText}>Alert: 51.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 76.0 && (
                                    <Text style={styles.resultText}>Alert: 52% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 77.0 && (
                                    <Text style={styles.resultText}>Alert: 52.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 78.0 && (
                                    <Text style={styles.resultText}>Alert: 53% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 79.0 && (
                                    <Text style={styles.resultText}>Alert: 53.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 80.0 && (
                                    <Text style={styles.resultText}>Alert: 54% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 81.0 && (
                                    <Text style={styles.resultText}>Alert: 54.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 82.0 && (
                                    <Text style={styles.resultText}>Alert: 55% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 83.0 && (
                                    <Text style={styles.resultText}>Alert: 55.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 84.0 && (
                                    <Text style={styles.resultText}>Alert: 56% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 85.0 && (
                                    <Text style={styles.resultText}>Alert: 56.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 86.0 && (
                                    <Text style={styles.resultText}>Alert: 57% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 87.0 && (
                                    <Text style={styles.resultText}>Alert: 57.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 88.0 && (
                                    <Text style={styles.resultText}>Alert: 58% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 89.0 && (
                                    <Text style={styles.resultText}>Alert: 58.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 90.0 && (
                                    <Text style={styles.resultText}>Alert: 59% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 91.0 && (
                                    <Text style={styles.resultText}>Alert: 59.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 92.0 && (
                                    <Text style={styles.resultText}>Alert: 60% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 93.0 && (
                                    <Text style={styles.resultText}>Alert: 60.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 94.0 && (
                                    <Text style={styles.resultText}>Alert: 61% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 95.0 && (
                                    <Text style={styles.resultText}>Alert: 61.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 96.0 && (
                                    <Text style={styles.resultText}>Alert: 62% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 97.0 && (
                                    <Text style={styles.resultText}>Alert: 62.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 98.0 && (
                                    <Text style={styles.resultText}>Alert: 63% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 99.0 && (
                                    <Text style={styles.resultText}>Alert: 63.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 100.0 && (
                                    <Text style={styles.resultText}>Alert: 64% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 101.0 && (
                                    <Text style={styles.resultText}>Alert: 64.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 102.0 && (
                                    <Text style={styles.resultText}>Alert: 65% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 103.0 && (
                                    <Text style={styles.resultText}>Alert: 65.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 104.0 && (
                                    <Text style={styles.resultText}>Alert: 66% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 105.0 && (
                                    <Text style={styles.resultText}>Alert: 66.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 106.0 && (
                                    <Text style={styles.resultText}>Alert: 67% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 107.0 && (
                                    <Text style={styles.resultText}>Alert: 67.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 108.0 && (
                                    <Text style={styles.resultText}>Alert: 68% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 109.0 && (
                                    <Text style={styles.resultText}>Alert: 68.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 110.0 && (
                                    <Text style={styles.resultText}>Alert: 69% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 111.0 && (
                                    <Text style={styles.resultText}>Alert: 69.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 112.0 && (
                                    <Text style={styles.resultText}>Alert: 70% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 113.0 && (
                                    <Text style={styles.resultText}>Alert: 70.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 114.0 && (
                                    <Text style={styles.resultText}>Alert: 71% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 115.0 && (
                                    <Text style={styles.resultText}>Alert: 71.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 116.0 && (
                                    <Text style={styles.resultText}>Alert: 72% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 117.0 && (
                                    <Text style={styles.resultText}>Alert: 72.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 118.0 && (
                                    <Text style={styles.resultText}>Alert: 73% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 119.0 && (
                                    <Text style={styles.resultText}>Alert: 73.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 120.0 && (
                                    <Text style={styles.resultText}>Alert: 74% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 121.0 && (
                                    <Text style={styles.resultText}>Alert: 74.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 122.0 && (
                                    <Text style={styles.resultText}>Alert: 75% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 123.0 && (
                                    <Text style={styles.resultText}>Alert: 75.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 124.0 && (
                                    <Text style={styles.resultText}>Alert: 76% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 125.0 && (
                                    <Text style={styles.resultText}>Alert: 76.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 126.0 && (
                                    <Text style={styles.resultText}>Alert: 77% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 127.0 && (
                                    <Text style={styles.resultText}>Alert: 77.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 128.0 && (
                                    <Text style={styles.resultText}>Alert: 78% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 129.0 && (
                                    <Text style={styles.resultText}>Alert: 78.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 130.0 && (
                                    <Text style={styles.resultText}>Alert: 79% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 131.0 && (
                                    <Text style={styles.resultText}>Alert: 79.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 132.0 && (
                                    <Text style={styles.resultText}>Alert: 80% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 133.0 && (
                                    <Text style={styles.resultText}>Alert: 80.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 134.0 && (
                                    <Text style={styles.resultText}>Alert: 81% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 135.0 && (
                                    <Text style={styles.resultText}>Alert: 81.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 136.0 && (
                                    <Text style={styles.resultText}>Alert: 82% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 137.0 && (
                                    <Text style={styles.resultText}>Alert: 82.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 138.0 && (
                                    <Text style={styles.resultText}>Alert: 83% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 139.0 && (
                                    <Text style={styles.resultText}>Alert: 83.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 140.0 && (
                                    <Text style={styles.resultText}>Alert: 84% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 141.0 && (
                                    <Text style={styles.resultText}>Alert: 84.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 142.0 && (
                                    <Text style={styles.resultText}>Alert: 85% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 143.0 && (
                                    <Text style={styles.resultText}>Alert: 85.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 144.0 && (
                                    <Text style={styles.resultText}>Alert: 86% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 145.0 && (
                                    <Text style={styles.resultText}>Alert: 86.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 146.0 && (
                                    <Text style={styles.resultText}>Alert: 87% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 147.0 && (
                                    <Text style={styles.resultText}>Alert: 87.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 148.0 && (
                                    <Text style={styles.resultText}>Alert: 88% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 149.0 && (
                                    <Text style={styles.resultText}>Alert: 88.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 150.0 && (
                                    <Text style={styles.resultText}>Alert: 89% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 151.0 && (
                                    <Text style={styles.resultText}>Alert: 89.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 152.0 && (
                                    <Text style={styles.resultText}>Alert: 90% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 153.0 && (
                                    <Text style={styles.resultText}>Alert: 70% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 154.0 && (
                                    <Text style={styles.resultText}>Alert: 71% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 155.0 && (
                                    <Text style={styles.resultText}>Alert: 72% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 156.0 && (
                                    <Text style={styles.resultText}>Alert: 73% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 157.0 && (
                                    <Text style={styles.resultText}>Alert: 74% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 158.0 && (
                                    <Text style={styles.resultText}>Alert: 75% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 159.0 && (
                                    <Text style={styles.resultText}>Alert: 76% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 160.0 && (
                                    <Text style={styles.resultText}>Alert: 77% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 161.0 && (
                                    <Text style={styles.resultText}>Alert: 78% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 162.0 && (
                                    <Text style={styles.resultText}>Alert: 79% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 163.0 && (
                                    <Text style={styles.resultText}>Alert: 80% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 164.0 && (
                                    <Text style={styles.resultText}>Alert: 81% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 165.0 && (
                                    <Text style={styles.resultText}>Alert: 82% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 166.0 && (
                                    <Text style={styles.resultText}>Alert: 83% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 167.0 && (
                                    <Text style={styles.resultText}>Alert: 84% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 168.0 && (
                                    <Text style={styles.resultText}>Alert: 85% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 169.0 && (
                                    <Text style={styles.resultText}>Alert: 86% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 170.0 && (
                                    <Text style={styles.resultText}>Alert: 87% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 171.0 && (
                                    <Text style={styles.resultText}>Alert: 88% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 172.0 && (
                                    <Text style={styles.resultText}>Alert: 89% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 173.0 && (
                                    <Text style={styles.resultText}>Alert: 90% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 174.0 && (
                                    <Text style={styles.resultText}>Alert: 91% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 175.0 && (
                                    <Text style={styles.resultText}>Alert: 92% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 176.0 && (
                                    <Text style={styles.resultText}>Alert: 93% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 177.0 && (
                                    <Text style={styles.resultText}>Alert: 94% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 178.0 && (
                                    <Text style={styles.resultText}>Alert: 80% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 179.0 && (
                                    <Text style={styles.resultText}>Alert: 81% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 180.0 && (
                                    <Text style={styles.resultText}>Alert: 82% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 181.0 && (
                                    <Text style={styles.resultText}>Alert: 83% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 182.0 && (
                                    <Text style={styles.resultText}>Alert: 84% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 183.0 && (
                                    <Text style={styles.resultText}>Alert: 85% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 184.0 && (
                                    <Text style={styles.resultText}>Alert: 86% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 185.0 && (
                                    <Text style={styles.resultText}>Alert: 87% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 186.0 && (
                                    <Text style={styles.resultText}>Alert: 88% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 187.0 && (
                                    <Text style={styles.resultText}>Alert: 89% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 188.0 && (
                                    <Text style={styles.resultText}>Alert: 90% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 189.0 && (
                                    <Text style={styles.resultText}>Alert: 91% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 190.0 && (
                                    <Text style={styles.resultText}>Alert: 92% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 191.0 && (
                                    <Text style={styles.resultText}>Alert: 93% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 192.0 && (
                                    <Text style={styles.resultText}>Alert: 94% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 193.0 && (
                                    <Text style={styles.resultText}>Alert: 95% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 194.0 && (
                                    <Text style={styles.resultText}>Alert: 60% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 195.0 && (
                                    <Text style={styles.resultText}>Alert: 60.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 196.0 && (
                                    <Text style={styles.resultText}>Alert: 61% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 197.0 && (
                                    <Text style={styles.resultText}>Alert: 61.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 198.0 && (
                                    <Text style={styles.resultText}>Alert: 62% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 199.0 && (
                                    <Text style={styles.resultText}>Alert: 62.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 200.0 && (
                                    <Text style={styles.resultText}>Alert: 63% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 201.0 && (
                                    <Text style={styles.resultText}>Alert: 63.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 202.0 && (
                                    <Text style={styles.resultText}>Alert: 64% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 203.0 && (
                                    <Text style={styles.resultText}>Alert: 64.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 204.0 && (
                                    <Text style={styles.resultText}>Alert: 65% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 205.0 && (
                                    <Text style={styles.resultText}>Alert: 65.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 206.0 && (
                                    <Text style={styles.resultText}>Alert: 66% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 207.0 && (
                                    <Text style={styles.resultText}>Alert: 66.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 208.0 && (
                                    <Text style={styles.resultText}>Alert: 67% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 209.0 && (
                                    <Text style={styles.resultText}>Alert: 67.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 210.0 && (
                                    <Text style={styles.resultText}>Alert: 68% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 211.0 && (
                                    <Text style={styles.resultText}>Alert: 68.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 212.0 && (
                                    <Text style={styles.resultText}>Alert: 69% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 213.0 && (
                                    <Text style={styles.resultText}>Alert: 69.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 214.0 && (
                                    <Text style={styles.resultText}>Alert: 70% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 215.0 && (
                                    <Text style={styles.resultText}>Alert: 70.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 216.0 && (
                                    <Text style={styles.resultText}>Alert: 71% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 217.0 && (
                                    <Text style={styles.resultText}>Alert: 71.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 218.0 && (
                                    <Text style={styles.resultText}>Alert: 72% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 219.0 && (
                                    <Text style={styles.resultText}>Alert: 72.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 220.0 && (
                                    <Text style={styles.resultText}>Alert: 73% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 221.0 && (
                                    <Text style={styles.resultText}>Alert: 73.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 222.0 && (
                                    <Text style={styles.resultText}>Alert: 74% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 223.0 && (
                                    <Text style={styles.resultText}>Alert: 74.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 224.0 && (
                                    <Text style={styles.resultText}>Alert: 75% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 225.0 && (
                                    <Text style={styles.resultText}>Alert: 75.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 226.0 && (
                                    <Text style={styles.resultText}>Alert: 76% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 227.0 && (
                                    <Text style={styles.resultText}>Alert: 76.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 228.0 && (
                                    <Text style={styles.resultText}>Alert: 77% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 229.0 && (
                                    <Text style={styles.resultText}>Alert: 77.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 230.0 && (
                                    <Text style={styles.resultText}>Alert: 78% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 231.0 && (
                                    <Text style={styles.resultText}>Alert: 78.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 232.0 && (
                                    <Text style={styles.resultText}>Alert: 79% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 233.0 && (
                                    <Text style={styles.resultText}>Alert: 79.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 234.0 && (
                                    <Text style={styles.resultText}>Alert: 80% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 235.0 && (
                                    <Text style={styles.resultText}>Alert: 80.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 236.0 && (
                                    <Text style={styles.resultText}>Alert: 81% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 237.0 && (
                                    <Text style={styles.resultText}>Alert: 81.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 238.0 && (
                                    <Text style={styles.resultText}>Alert: 82% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 239.0 && (
                                    <Text style={styles.resultText}>Alert: 82.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 240.0 && (
                                    <Text style={styles.resultText}>Alert: 83% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 241.0 && (
                                    <Text style={styles.resultText}>Alert: 83.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 242.0 && (
                                    <Text style={styles.resultText}>Alert: 84% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 243.0 && (
                                    <Text style={styles.resultText}>Alert: 84.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 244.0 && (
                                    <Text style={styles.resultText}>Alert: 85% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 245.0 && (
                                    <Text style={styles.resultText}>Alert: 85.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 246.0 && (
                                    <Text style={styles.resultText}>Alert: 86% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 247.0 && (
                                    <Text style={styles.resultText}>Alert: 86.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 248.0 && (
                                    <Text style={styles.resultText}>Alert: 87% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 249.0 && (
                                    <Text style={styles.resultText}>Alert: 87.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 250.0 && (
                                    <Text style={styles.resultText}>Alert: 88% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 251.0 && (
                                    <Text style={styles.resultText}>Alert: 88.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 252.0 && (
                                    <Text style={styles.resultText}>Alert: 89% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 253.0 && (
                                    <Text style={styles.resultText}>Alert: 89.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 254.0 && (
                                    <Text style={styles.resultText}>Alert: 90% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 255.0 && (
                                    <Text style={styles.resultText}>Alert: 90.5% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 256.0 && (
                                    <Text style={styles.resultText}>Alert: 91% Powdery Mildew Danger</Text>
                                )}
                                {pred_value === 257.0 && (
                                    <Text style={styles.resultText}>Alert: 10% Root rot Danger</Text>
                                )}
                                {pred_value === 258.0 && (
                                    <Text style={styles.resultText}>Alert: 10.5% Root rot Danger</Text>
                                )}
                                {pred_value === 259.0 && (
                                    <Text style={styles.resultText}>Alert: 11% Root rot Danger</Text>
                                )}
                                {pred_value === 260.0 && (
                                    <Text style={styles.resultText}>Alert: 11.5% Root rot Danger</Text>
                                )}
                                {pred_value === 261.0 && (
                                    <Text style={styles.resultText}>Alert: 12% Root rot Danger</Text>
                                )}
                                {pred_value === 262.0 && (
                                    <Text style={styles.resultText}>Alert: 12.5% Root rot Danger</Text>
                                )}
                                {pred_value === 263.0 && (
                                    <Text style={styles.resultText}>Alert: 13% Root rot Danger</Text>
                                )}
                                {pred_value === 264.0 && (
                                    <Text style={styles.resultText}>Alert: 13.5% Root rot Danger</Text>
                                )}
                                {pred_value === 265.0 && (
                                    <Text style={styles.resultText}>Alert: 14% Root rot Danger</Text>
                                )}
                                {pred_value === 266.0 && (
                                    <Text style={styles.resultText}>Alert: 14.5% Root rot Danger</Text>
                                )}
                                {pred_value === 267.0 && (
                                    <Text style={styles.resultText}>Alert: 15% Root rot Danger</Text>
                                )}
                                {pred_value === 268.0 && (
                                    <Text style={styles.resultText}>Alert: 15.5% Root rot Danger</Text>
                                )}
                                {pred_value === 269.0 && (
                                    <Text style={styles.resultText}>Alert: 16% Root rot Danger</Text>
                                )}
                                {pred_value === 270.0 && (
                                    <Text style={styles.resultText}>Alert: 16.5% Root rot Danger</Text>
                                )}
                                {pred_value === 271.0 && (
                                    <Text style={styles.resultText}>Alert: 17% Root rot Danger</Text>
                                )}
                                {pred_value === 272.0 && (
                                    <Text style={styles.resultText}>Alert: 17.5% Root rot Danger</Text>
                                )}
                                {pred_value === 273.0 && (
                                    <Text style={styles.resultText}>Alert: 18% Root rot Danger</Text>
                                )}
                                {pred_value === 274.0 && (
                                    <Text style={styles.resultText}>Alert: 18.5% Root rot Danger</Text>
                                )}
                                {pred_value === 275.0 && (
                                    <Text style={styles.resultText}>Alert: 19% Root rot Danger</Text>
                                )}
                                {pred_value === 276.0 && (
                                    <Text style={styles.resultText}>Alert: 19.5% Root rot Danger</Text>
                                )}
                                {pred_value === 277.0 && (
                                    <Text style={styles.resultText}>Alert: 20% Root rot Danger</Text>
                                )}
                                {pred_value === 278.0 && (
                                    <Text style={styles.resultText}>Alert: 20.5% Root rot Danger</Text>
                                )}
                                {pred_value === 279.0 && (
                                    <Text style={styles.resultText}>Alert: 21% Root rot Danger</Text>
                                )}
                                {pred_value === 280.0 && (
                                    <Text style={styles.resultText}>Alert: 21.5% Root rot Danger</Text>
                                )}
                                {pred_value === 281.0 && (
                                    <Text style={styles.resultText}>Alert: 22% Root rot Danger</Text>
                                )}
                                {pred_value === 282.0 && (
                                    <Text style={styles.resultText}>Alert: 22.5% Root rot Danger</Text>
                                )}
                                {pred_value === 283.0 && (
                                    <Text style={styles.resultText}>Alert: 23% Root rot Danger</Text>
                                )}
                                {pred_value === 284.0 && (
                                    <Text style={styles.resultText}>Alert: 23.5% Root rot Danger</Text>
                                )}
                                {pred_value === 285.0 && (
                                    <Text style={styles.resultText}>Alert: 24% Root rot Danger</Text>
                                )}
                                {pred_value === 286.0 && (
                                    <Text style={styles.resultText}>Alert: 24.5% Root rot Danger</Text>
                                )}
                                {pred_value === 287.0 && (
                                    <Text style={styles.resultText}>Alert: 25% Root rot Danger</Text>
                                )}
                                {pred_value === 288.0 && (
                                    <Text style={styles.resultText}>Alert: 25.5% Root rot Danger</Text>
                                )}
                                {pred_value === 289.0 && (
                                    <Text style={styles.resultText}>Alert: 26% Root rot Danger</Text>
                                )}
                                {pred_value === 290.0 && (
                                    <Text style={styles.resultText}>Alert: 26.5% Root rot Danger</Text>
                                )}
                                {pred_value === 291.0 && (
                                    <Text style={styles.resultText}>Alert: 27% Root rot Danger</Text>
                                )}
                                {pred_value === 292.0 && (
                                    <Text style={styles.resultText}>Alert: 27.5% Root rot Danger</Text>
                                )}
                                {pred_value === 293.0 && (
                                    <Text style={styles.resultText}>Alert: 28% Root rot Danger</Text>
                                )}
                                {pred_value === 294.0 && (
                                    <Text style={styles.resultText}>Alert: 28.5% Root rot Danger</Text>
                                )}
                                {pred_value === 295.0 && (
                                    <Text style={styles.resultText}>Alert: 29% Root rot Danger</Text>
                                )}
                                {pred_value === 296.0 && (
                                    <Text style={styles.resultText}>Alert: 29.5% Root rot Danger</Text>
                                )}
                                {pred_value === 297.0 && (
                                    <Text style={styles.resultText}>Alert: 30% Root rot Danger</Text>
                                )}
                                {pred_value === 298.0 && (
                                    <Text style={styles.resultText}>Alert: 30.5% Root rot Danger</Text>
                                )}
                                {pred_value === 299.0 && (
                                    <Text style={styles.resultText}>Alert: 31% Root rot Danger</Text>
                                )}
                                {pred_value === 300.0 && (
                                    <Text style={styles.resultText}>Alert: 31.5% Root rot Danger</Text>
                                )}
                                {pred_value === 301.0 && (
                                    <Text style={styles.resultText}>Alert: 32% Root rot Danger</Text>
                                )}
                                {pred_value === 302.0 && (
                                    <Text style={styles.resultText}>Alert: 32.5% Root rot Danger</Text>
                                )}
                                {pred_value === 303.0 && (
                                    <Text style={styles.resultText}>Alert: 33% Root rot Danger</Text>
                                )}
                                {pred_value === 304.0 && (
                                    <Text style={styles.resultText}>Alert: 33.5% Root rot Danger</Text>
                                )}
                                {pred_value === 305.0 && (
                                    <Text style={styles.resultText}>Alert: 34% Root rot Danger</Text>
                                )}
                                {pred_value === 306.0 && (
                                    <Text style={styles.resultText}>Alert: 34.5% Root rot Danger</Text>
                                )}
                                {pred_value === 307.0 && (
                                    <Text style={styles.resultText}>Alert: 35% Root rot Danger</Text>
                                )}
                                {pred_value === 308.0 && (
                                    <Text style={styles.resultText}>Alert: 35.5% Root rot Danger</Text>
                                )}
                                {pred_value === 309.0 && (
                                    <Text style={styles.resultText}>Alert: 36% Root rot Danger</Text>
                                )}
                                {pred_value === 310.0 && (
                                    <Text style={styles.resultText}>Alert: 36.5% Root rot Danger</Text>
                                )}
                                {pred_value === 311.0 && (
                                    <Text style={styles.resultText}>Alert: 37% Root rot Danger</Text>
                                )}
                                {pred_value === 312.0 && (
                                    <Text style={styles.resultText}>Alert: 37.5% Root rot Danger</Text>
                                )}
                                {pred_value === 313.0 && (
                                    <Text style={styles.resultText}>Alert: 38% Root rot Danger</Text>
                                )}
                                {pred_value === 314.0 && (
                                    <Text style={styles.resultText}>Alert: 38.5% Root rot Danger</Text>
                                )}
                                {pred_value === 315.0 && (
                                    <Text style={styles.resultText}>Alert: 39% Root rot Danger</Text>
                                )}
                                {pred_value === 316.0 && (
                                    <Text style={styles.resultText}>Alert: 39.5% Root rot Danger</Text>
                                )}
                                {pred_value === 317.0 && (
                                    <Text style={styles.resultText}>Alert: 40% Root rot Danger</Text>
                                )}
                                {pred_value === 318.0 && (
                                    <Text style={styles.resultText}>Alert: 40.5% Root rot Danger</Text>
                                )}
                                {pred_value === 319.0 && (
                                    <Text style={styles.resultText}>Alert: 41% Root rot Danger</Text>
                                )}
                                {pred_value === 320.0 && (
                                    <Text style={styles.resultText}>Alert: 41.5% Root rot Danger</Text>
                                )}
                                {pred_value === 321.0 && (
                                    <Text style={styles.resultText}>Alert: 42% Root rot Danger</Text>
                                )}
                                {pred_value === 322.0 && (
                                    <Text style={styles.resultText}>Alert: 42.5% Root rot Danger</Text>
                                )}
                                {pred_value === 323.0 && (
                                    <Text style={styles.resultText}>Alert: 43% Root rot Danger</Text>
                                )}
                                {pred_value === 324.0 && (
                                    <Text style={styles.resultText}>Alert: 43.5% Root rot Danger</Text>
                                )}
                                {pred_value === 325.0 && (
                                    <Text style={styles.resultText}>Alert: 44% Root rot Danger</Text>
                                )}
                                {pred_value === 326.0 && (
                                    <Text style={styles.resultText}>Alert: 44.5% Root rot Danger</Text>
                                )}
                                {pred_value === 327.0 && (
                                    <Text style={styles.resultText}>Alert: 45% Root rot Danger</Text>
                                )}
                                {pred_value === 328.0 && (
                                    <Text style={styles.resultText}>Alert: 45.5% Root rot Danger</Text>
                                )}
                                {pred_value === 329.0 && (
                                    <Text style={styles.resultText}>Alert: 46% Root rot Danger</Text>
                                )}
                                {pred_value === 330.0 && (
                                    <Text style={styles.resultText}>Alert: 46.5% Root rot Danger</Text>
                                )}
                                {pred_value === 331.0 && (
                                    <Text style={styles.resultText}>Alert: 47% Root rot Danger</Text>
                                )}
                                {pred_value === 332.0 && (
                                    <Text style={styles.resultText}>Alert: 47.5% Root rot Danger</Text>
                                )}
                                {pred_value === 333.0 && (
                                    <Text style={styles.resultText}>Alert: 48% Root rot Danger</Text>
                                )}
                                {pred_value === 334.0 && (
                                    <Text style={styles.resultText}>Alert: 48.5% Root rot Danger</Text>
                                )}
                                {pred_value === 335.0 && (
                                    <Text style={styles.resultText}>Alert: 49% Root rot Danger</Text>
                                )}
                                {pred_value === 336.0 && (
                                    <Text style={styles.resultText}>Alert: 49.5% Root rot Danger</Text>
                                )}
                                {pred_value === 337.0 && (
                                    <Text style={styles.resultText}>Alert: 50% Root rot Danger</Text>
                                )}
                                {pred_value === 338.0 && (
                                    <Text style={styles.resultText}>Alert: 50.5% Root rot Danger</Text>
                                )}
                                {pred_value === 339.0 && (
                                    <Text style={styles.resultText}>Alert: 51% Root rot Danger</Text>
                                )}
                                {pred_value === 340.0 && (
                                    <Text style={styles.resultText}>Alert: 51.5% Root rot Danger</Text>
                                )}
                                {pred_value === 341.0 && (
                                    <Text style={styles.resultText}>Alert: 52% Root rot Danger</Text>
                                )}
                                {pred_value === 342.0 && (
                                    <Text style={styles.resultText}>Alert: 52.5% Root rot Danger</Text>
                                )}
                                {pred_value === 343.0 && (
                                    <Text style={styles.resultText}>Alert: 53% Root rot Danger</Text>
                                )}
                                {pred_value === 344.0 && (
                                    <Text style={styles.resultText}>Alert: 53.5% Root rot Danger</Text>
                                )}
                                {pred_value === 345.0 && (
                                    <Text style={styles.resultText}>Alert: 54% Root rot Danger</Text>
                                )}
                                {pred_value === 346.0 && (
                                    <Text style={styles.resultText}>Alert: 54.5% Root rot Danger</Text>
                                )}
                                {pred_value === 347.0 && (
                                    <Text style={styles.resultText}>Alert: 55% Root rot Danger</Text>
                                )}
                                {pred_value === 348.0 && (
                                    <Text style={styles.resultText}>Alert: 55.5% Root rot Danger</Text>
                                )}
                                {pred_value === 349.0 && (
                                    <Text style={styles.resultText}>Alert: 56% Root rot Danger</Text>
                                )}
                                {pred_value === 350.0 && (
                                    <Text style={styles.resultText}>Alert: 56.5% Root rot Danger</Text>
                                )}
                                {pred_value === 351.0 && (
                                    <Text style={styles.resultText}>Alert: 57% Root rot Danger</Text>
                                )}
                                {pred_value === 352.0 && (
                                    <Text style={styles.resultText}>Alert: 57.5% Root rot Danger</Text>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
    },
    result: {
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
    },
    resultText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'green',
    },
    resultText1: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'orange',
    },
    resultText2: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'red',
    },
});


export default EarlyRisk;