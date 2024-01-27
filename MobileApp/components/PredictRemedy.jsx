import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ref, onValue } from "firebase/database"
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome5'
import { db } from '../config';
import COLORS from "../consts/colors";


const PredictRemedy = () => {
    const [pred_value, setPredValue] = useState(0);
    const [disease, setDisease] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [severity_level, setSeverity_level] = useState('');
    const [error, setError] = useState(null);
    const [showFilterDay, setShowFilterDay] = useState(false);
    const [showFilterStartHour, setShowFilterStartHour] = useState(false);
    const [showFilterEndHour, setShowFilterEndHour] = useState(false);

    const [errorDisease, setErrorDisease] = useState(null);
    const [errorNitrogen, setErrorNitrogen] = useState(null);
    const [errorphosphorus, setErrorPhosphorus] = useState(null);
    const [errorpotassium, setErrorPotassium] = useState(null);
    const [errortemperature, setErrorTemperature] = useState(null);
    const [errorhumidity, setErrorHumidity] = useState(null);
    const [errorseverity_level, setErrorSeverity_level] = useState(null);


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
            case 'disease':
                setDisease(value);
                break;
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
            case 'severity_level':
                setSeverity_level(value);
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

        if (!disease) {
            setErrorDisease('Disease is required');
            isValid = false;
        } else {
            setErrorDisease(null);
        }

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

        if (!severity_level) {
            setErrorSeverity_level('Severity Level is required');
            isValid = false;
        } else {
            setErrorSeverity_level(null);
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
                severity_level,
                disease,
            };
            console.log(feature_list)
            try {
                const response = await axios.post('http://10.0.2.2:5000/api/predict/Remedy', feature_list);
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
                        Agarwood Disease Remedy and Capacity Predictor
                    </Text>
                    <View
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            height: 1200,
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
                                    selectedValue={disease}
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
                                    <Picker.Item label="bacterialWilt" value="bacterialWilt" />
                                    <Picker.Item label="cankerDisease" value="cankerDisease" />
                                    <Picker.Item label="Cercospora Leaf Blight" value="cercosporaLeafBlight" />
                                    <Picker.Item label="Dieback" value="dieback" />
                                    <Picker.Item label="Leaf Spot" value="leafSpot" />
                                    <Picker.Item label="Nematode Infestations" value="nematodeInfestations" />
                                    <Picker.Item label="Nutrient Deficiency" value="nutrientDeficiency" />
                                    <Picker.Item label="Powdery Mildew" value="powderyMildew" />
                                    <Picker.Item label="Root Rot" value="rootRot" />
                                    <Picker.Item label="Rust Disease" value="rustDisease" />
                                    <Picker.Item label="Salinity Stress" value="salinityStress" />
                                    <Picker.Item label="Waterlogging" value="waterlogging" />
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
                                    Severity Level
                                </Text>
                                <Picker
                                    selectedValue={severity_level}
                                    onValueChange={(value) => {
                                        setSeverity_level(value);
                                        setErrorSeverity_level(null);
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
                                    <Picker.Item label="Mild" value="mild" />
                                    <Picker.Item label="Moderate" value="moderate" />
                                    <Picker.Item label="Severe" value="severe" />
                                </Picker>
                                {errorseverity_level && <Text style={styles.error}>{errorseverity_level}</Text>}
                            </View>

                            <TouchableOpacity style={styles.button}
                                onPress={handleSubmit}>
                                <Text
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 22,
                                        color: COLORS.white,
                                    }}
                                >
                                    Predict Remedy
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.result}>
                                {pred_value === 1.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (40%)</Text>
                                )}
                                {pred_value === 2.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (41%)</Text>
                                )}
                                {pred_value === 3.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (42%)</Text>
                                )}
                                {pred_value === 4.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (44%)</Text>
                                )}
                                {pred_value === 5.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (46%)</Text>
                                )}
                                {pred_value === 6.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (48%)</Text>
                                )}
                                {pred_value === 7.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (50%)</Text>
                                )}
                                {pred_value === 8.0 && (
                                    <Text style={styles.resultText} >Add compost or other organic matter to the soil to improve nutrient content (52%)</Text>
                                )}
                                {pred_value === 9.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (54%)</Text>
                                )}
                                {pred_value === 10.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (56%)</Text>
                                )}
                                {pred_value === 11.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (58%)</Text>
                                )}
                                {pred_value === 12.0 && (
                                    <Text style={styles.resultText}>Add compost or other organic matter to the soil to improve nutrient content (60%)</Text>
                                )}
                                {pred_value === 13.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (56%)</Text>
                                )}
                                {pred_value === 14.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (62%)</Text>
                                )}
                                {pred_value === 15.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (63%)</Text>
                                )}
                                {pred_value === 16.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (64%)</Text>
                                )}
                                {pred_value === 17.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (68%)</Text>
                                )}
                                {pred_value === 18.0 && (
                                    <Text style={styles.resultText}>Apply a balanced fertilizer to the soil (70%)</Text>
                                )}
                                {pred_value === 19.0 && (
                                    <Text style={styles.resultText}>Apply a fungicide (70%)</Text>
                                )}
                                {pred_value === 20.0 && (
                                    <Text style={styles.resultText}>Apply a fungicide (80%)</Text>
                                )}
                                {pred_value === 21.0 && (
                                    <Text style={styles.resultText}>Apply a fungicide, and remove affected leaves (90%)</Text>
                                )}
                                {pred_value === 22.0 && (
                                    <Text style={styles.resultText}>Apply a fungicide, remove affected leaves (80%)</Text>
                                )}
                                {pred_value === 23.0 && (
                                    <Text style={styles.resultText}>Apply a fungicide, remove affected leaves, and destroy infected plant material (90%)</Text>
                                )}
                                {pred_value === 24.0 && (
                                    <Text style={styles.resultText}>Apply a nematicide (70%)</Text>
                                )}
                                {pred_value === 25.0 && (
                                    <Text style={styles.resultText}>Apply a nematicide, remove and destroy infected plant material (80%)</Text>
                                )}
                                {pred_value === 26.0 && (
                                    <Text style={styles.resultText}>Apply a nematicide, remove and destroy infected plant material, replant in a new location (90%)</Text>
                                )}
                                {pred_value === 27.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (61%)</Text>
                                )}
                                {pred_value === 28.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (62%)</Text>
                                )}
                                {pred_value === 29.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (63%)</Text>
                                )}
                                {pred_value === 30.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (64%)</Text>
                                )}
                                {pred_value === 31.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (65%)</Text>
                                )}
                                {pred_value === 32.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (66%)</Text>
                                )}
                                {pred_value === 33.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (67%)</Text>
                                )}
                                {pred_value === 34.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (69%)</Text>
                                )}
                                {pred_value === 35.0 && (
                                    <Text style={styles.resultText}>Apply Fungicide spray with neem oil (70%)</Text>
                                )}
                                {pred_value === 36.0 && (
                                    <Text style={styles.resultText}>Apply nitrogen fertilizer to the soil (70%)</Text>
                                )}
                                {pred_value === 37.0 && (
                                    <Text style={styles.resultText}>Apply nitrogen fertilizer to the soil (80%)</Text>
                                )}
                                {pred_value === 38.0 && (
                                    <Text style={styles.resultText}>Apply nitrogen fertilizer to the soil (90%)</Text>
                                )}
                                {pred_value === 39.0 && (
                                    <Text style={styles.resultText}>Apply phosphorus fertilizer to the soil (60%)</Text>
                                )}
                                {pred_value === 40.0 && (
                                    <Text style={styles.resultText}>Apply phosphorus fertilizer to the soil (70%)</Text>
                                )}
                                {pred_value === 41.0 && (
                                    <Text style={styles.resultText}>Apply phosphorus fertilizer to the soil (80%)</Text>
                                )}
                                {pred_value === 42.0 && (
                                    <Text style={styles.resultText}>Apply potassium fertilizer to the soil (60%)</Text>
                                )}
                                {pred_value === 43.0 && (
                                    <Text style={styles.resultText}>Apply potassium fertilizer to the soil (70%)</Text>
                                )}
                                {pred_value === 44.0 && (
                                    <Text style={styles.resultText}>Apply potassium fertilizer to the soil (80%)</Text>
                                )}
                                {pred_value === 45.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (34%)</Text>
                                )}
                                {pred_value === 46.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (36%)</Text>
                                )}
                                {pred_value === 47.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (38%)</Text>
                                )}
                                {pred_value === 48.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (40%)</Text>
                                )}
                                {pred_value === 49.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (42%)</Text>
                                )}
                                {pred_value === 50.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (44%)</Text>
                                )}
                                {pred_value === 51.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (46%)</Text>
                                )}
                                {pred_value === 52.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (48%)</Text>
                                )}
                                {pred_value === 53.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (50%)</Text>
                                )}
                                {pred_value === 54.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (54%)</Text>
                                )}
                                {pred_value === 55.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (55%)</Text>
                                )}
                                {pred_value === 56.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (56%)</Text>
                                )}
                                {pred_value === 57.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (57%)</Text>
                                )}
                                {pred_value === 58.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (58%)</Text>
                                )}
                                {pred_value === 59.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (59%)</Text>
                                )}
                                {pred_value === 60.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (60%)</Text>
                                )}
                                {pred_value === 61.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (61%)</Text>
                                )}
                                {pred_value === 62.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (62%)</Text>
                                )}
                                {pred_value === 63.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (63%)</Text>
                                )}
                                {pred_value === 64.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (64%)</Text>
                                )}
                                {pred_value === 65.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (65%)</Text>
                                )}
                                {pred_value === 66.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (66%)</Text>
                                )}
                                {pred_value === 67.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (67%)</Text>
                                )}
                                {pred_value === 68.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (68%)</Text>
                                )}
                                {pred_value === 69.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (69%)</Text>
                                )}
                                {pred_value === 70.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (70%)</Text>
                                )}
                                {pred_value === 71.0 && (
                                    <Text style={styles.resultText}>Bordeaux mixture (80%)</Text>
                                )}
                                {pred_value === 72.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (52%)</Text>
                                )}
                                {pred_value === 73.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (54%)</Text>
                                )}
                                {pred_value === 74.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (56%)</Text>
                                )}
                                {pred_value === 75.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (58%)</Text>
                                )}
                                {pred_value === 76.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (60%)</Text>
                                )}
                                {pred_value === 77.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (62%)</Text>
                                )}
                                {pred_value === 78.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (64%)</Text>
                                )}
                                {pred_value === 79.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (66%)</Text>
                                )}
                                {pred_value === 80.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (68%)</Text>
                                )}
                                {pred_value === 81.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (70%)</Text>
                                )}
                                {pred_value === 82.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (72%)</Text>
                                )}
                                {pred_value === 83.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (74%)</Text>
                                )}
                                {pred_value === 84.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (76%)</Text>
                                )}
                                {pred_value === 85.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (78%)</Text>
                                )}
                                {pred_value === 86.0 && (
                                    <Text style={styles.resultText}>Copper fungicide (80%)</Text>
                                )}
                                {pred_value === 87.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (48%)</Text>
                                )}
                                {pred_value === 88.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (50%)</Text>
                                )}
                                {pred_value === 89.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (50%)</Text>
                                )}
                                {pred_value === 90.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (54%)</Text>
                                )}
                                {pred_value === 91.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (56%)</Text>
                                )}
                                {pred_value === 92.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (58%)</Text>
                                )}
                                {pred_value === 93.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (60%)</Text>
                                )}
                                {pred_value === 94.0 && (
                                    <Text style={styles.resultText}>Copper oxychloride (70%)</Text>
                                )}
                                {pred_value === 95.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (71%)</Text>
                                )}
                                {pred_value === 96.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (72%)</Text>
                                )}
                                {pred_value === 97.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (73%)</Text>
                                )}
                                {pred_value === 98.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (74%)</Text>
                                )}
                                {pred_value === 99.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (75%)</Text>
                                )}
                                {pred_value === 100.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (76%)</Text>
                                )}

                                {pred_value === 101.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (77%)</Text>
                                )}
                                {pred_value === 102.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (78%)</Text>
                                )}
                                {pred_value === 103.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (79%)</Text>
                                )}
                                {pred_value === 104.0 && (
                                    <Text style={styles.resultText}>Fertilize with nitrogen-rich fertilizer (80%)</Text>
                                )}
                                {pred_value === 105.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (60%)</Text>
                                )}
                                {pred_value === 106.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (61%)</Text>
                                )}
                                {pred_value === 107.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (62%)</Text>
                                )}
                                {pred_value === 108.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (63%)</Text>
                                )}
                                {pred_value === 109.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (64%)</Text>
                                )}
                                {pred_value === 110.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (65%)</Text>
                                )}
                                {pred_value === 111.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (66%)</Text>
                                )}
                                {pred_value === 112.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (67%)</Text>
                                )}
                                {pred_value === 113.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (68%)</Text>
                                )}
                                {pred_value === 114.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (69%)</Text>
                                )}
                                {pred_value === 115.0 && (
                                    <Text style={styles.resultText}>Fertilize with phosphorus-rich fertilizer (70%)</Text>
                                )}
                                {pred_value === 116.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (50%)</Text>
                                )}
                                {pred_value === 117.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (51%)</Text>
                                )}
                                {pred_value === 118.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (52%)</Text>
                                )}
                                {pred_value === 119.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (53%)</Text>
                                )}
                                {pred_value === 120.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (54%)</Text>
                                )}
                                {pred_value === 121.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (55%)</Text>
                                )}
                                {pred_value === 122.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (56%)</Text>
                                )}
                                {pred_value === 123.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (57%)</Text>
                                )}
                                {pred_value === 124.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (58%)</Text>
                                )}
                                {pred_value === 125.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (59%)</Text>
                                )}
                                {pred_value === 126.0 && (
                                    <Text style={styles.resultText}>Fertilize with potassium-rich fertilizer (60%)</Text>
                                )}
                                {pred_value === 127.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (51%)</Text>
                                )}
                                {pred_value === 128.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (52%)</Text>
                                )}
                                {pred_value === 129.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (53%)</Text>
                                )}
                                {pred_value === 130.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (54%)</Text>
                                )}
                                {pred_value === 131.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (56%)</Text>
                                )}
                                {pred_value === 132.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (57%)</Text>
                                )}
                                {pred_value === 133.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (58%)</Text>
                                )}
                                {pred_value === 134.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (59%)</Text>
                                )}
                                {pred_value === 135.0 && (
                                    <Text style={styles.resultText}>Fungicide spray and removal of infected leaves (60%)</Text>
                                )}
                                {pred_value === 136.0 && (
                                    <Text style={styles.resultText}>Improve drainage (70%)</Text>
                                )}
                                {pred_value === 137.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (71%)</Text>
                                )}
                                {pred_value === 138.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (72%)</Text>
                                )}
                                {pred_value === 139.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (73%)</Text>
                                )}
                                {pred_value === 140.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (74%)</Text>
                                )}
                                {pred_value === 141.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (75%)</Text>
                                )}
                                {pred_value === 142.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (76%)</Text>
                                )}
                                {pred_value === 143.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (77%)</Text>
                                )}
                                {pred_value === 144.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (78%)</Text>
                                )}
                                {pred_value === 145.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (79%)</Text>
                                )}
                                {pred_value === 146.0 && (
                                    <Text style={styles.resultText}>Irrigation with fresh water, Prune any dead or damaged leaves. (80%)</Text>
                                )}
                                {pred_value === 147.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (52%)</Text>
                                )}
                                {pred_value === 148.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (53%)</Text>
                                )}
                                {pred_value === 149.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (54%)</Text>
                                )}
                                {pred_value === 150.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (55%)</Text>
                                )}
                                {pred_value === 151.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (56%)</Text>
                                )}
                                {pred_value === 152.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (57%)</Text>
                                )}
                                {pred_value === 153.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (58%)</Text>
                                )}
                                {pred_value === 154.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (59%)</Text>
                                )}
                                {pred_value === 155.0 && (
                                    <Text style={styles.resultText}>Isolate the plant and use Fungicide spray (60%)</Text>
                                )}
                                {pred_value === 156.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (24%)</Text>
                                )}
                                {pred_value === 157.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (26%)</Text>
                                )}
                                {pred_value === 158.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (28%)</Text>
                                )}
                                {pred_value === 159.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (30%)</Text>
                                )}
                                {pred_value === 160.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (32%)</Text>
                                )}
                                {pred_value === 161.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (34%)</Text>
                                )}
                                {pred_value === 162.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (36%)</Text>
                                )}
                                {pred_value === 163.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (38%)</Text>
                                )}
                                {pred_value === 164.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (40%)</Text>
                                )}
                                {pred_value === 165.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (44%)</Text>
                                )}
                                {pred_value === 166.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (45%)</Text>
                                )}
                                {pred_value === 167.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (46%)</Text>
                                )}
                                {pred_value === 168.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (47%)</Text>
                                )}
                                {pred_value === 169.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (48%)</Text>
                                )}
                                {pred_value === 170.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (49%)</Text>
                                )}
                                {pred_value === 171.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (50%)</Text>
                                )}
                                {pred_value === 172.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (51%)</Text>
                                )}
                                {pred_value === 173.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (52%)</Text>
                                )}
                                {pred_value === 174.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (53%)</Text>
                                )}
                                {pred_value === 175.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (54%)</Text>
                                )}
                                {pred_value === 176.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (55%)</Text>
                                )}
                                {pred_value === 177.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (53%)</Text>
                                )}
                                {pred_value === 178.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (57%)</Text>
                                )}
                                {pred_value === 179.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (58%)</Text>
                                )}
                                {pred_value === 180.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (59%)</Text>
                                )}
                                {pred_value === 181.0 && (
                                    <Text style={styles.resultText}>Lime sulfur (60%)</Text>
                                )}
                                {pred_value === 182.0 && (
                                    <Text style={styles.resultText}>Mancozeb (60%)</Text>
                                )}
                                {pred_value === 183.0 && (
                                    <Text style={styles.resultText}>Mancozeb (62%)</Text>
                                )}
                                {pred_value === 184.0 && (
                                    <Text style={styles.resultText}>Mancozeb (64%)</Text>
                                )}
                                {pred_value === 185.0 && (
                                    <Text style={styles.resultText}>Mancozeb (65%)</Text>
                                )}
                                {pred_value === 186.0 && (
                                    <Text style={styles.resultText}>Mancozeb (66%)</Text>
                                )}
                                {pred_value === 187.0 && (
                                    <Text style={styles.resultText}>Mancozeb (68%)</Text>
                                )}
                                {pred_value === 188.0 && (
                                    <Text style={styles.resultText}>Mancozeb (70%)</Text>
                                )}
                                {pred_value === 189.0 && (
                                    <Text style={styles.resultText}>Mancozeb (72%)</Text>
                                )}
                                {pred_value === 190.0 && (
                                    <Text style={styles.resultText}>Mancozeb (74%)</Text>
                                )}
                                {pred_value === 191.0 && (
                                    <Text style={styles.resultText}>Mancozeb (76%)</Text>
                                )}
                                {pred_value === 192.0 && (
                                    <Text style={styles.resultText}>Mancozeb (78%)</Text>
                                )}
                                {pred_value === 193.0 && (
                                    <Text style={styles.resultText}>Mancozeb (80%)</Text>
                                )}
                                {pred_value === 194.0 && (
                                    <Text style={styles.resultText}>Mancozeb (90%)</Text>
                                )}
                                {pred_value === 195.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (52%)</Text>
                                )}
                                {pred_value === 196.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (53%)</Text>
                                )}
                                {pred_value === 197.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (54%)</Text>
                                )}
                                {pred_value === 198.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (56%)</Text>
                                )}
                                {pred_value === 199.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (64%)</Text>
                                )}
                                {pred_value === 200.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture. (66%)</Text>
                                )}
                                {pred_value === 201.0 && (
                                    <Text style={styles.resultText}>Mulch the soil to help retain moisture (68%)</Text>
                                )}
                                {pred_value === 202.0 && (
                                    <Text style={styles.resultText}>No remedy needed</Text>
                                )}
                                {pred_value === 203.0 && (
                                    <Text style={styles.resultText}>Prevention of the spread of the disease by not planting new plants in the affected area (20%)</Text>
                                )}
                                {pred_value === 204.0 && (
                                    <Text style={styles.resultText}>Prune and remove affected branches (70%)</Text>
                                )}
                                {pred_value === 205.0 && (
                                    <Text style={styles.resultText}>Prune and remove affected branches, apply a fungicide (80%)</Text>
                                )}
                                {pred_value === 206.0 && (
                                    <Text style={styles.resultText}>Prune and remove affected branches, apply a fungicide, and destroy infected plant material (90%)</Text>
                                )}
                                {pred_value === 207.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (22%)</Text>
                                )}
                                {pred_value === 208.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (23%)</Text>
                                )}
                                {pred_value === 209.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (24%)</Text>
                                )}
                                {pred_value === 210.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (25%)</Text>
                                )}
                                {pred_value === 211.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (26%)</Text>
                                )}
                                {pred_value === 212.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (27%)</Text>
                                )}
                                {pred_value === 213.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (28%)</Text>
                                )}
                                {pred_value === 214.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (29%)</Text>
                                )}
                                {pred_value === 215.0 && (
                                    <Text style={styles.resultText}>Prune the plant to remove any affected areas and Apply a systemic fungicide (30%)</Text>
                                )}
                                {pred_value === 216.0 && (
                                    <Text style={styles.resultText}>Removal and burning of affected plants (80%)</Text>
                                )}
                                {pred_value === 217.0 && (
                                    <Text style={styles.resultText}>Removal and burning of affected plants and treatment of the soil with a bactericide (60%)</Text>
                                )}
                                {pred_value === 218.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (12%)</Text>
                                )}
                                {pred_value === 219.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (13%)</Text>
                                )}
                                {pred_value === 220.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (14%)</Text>
                                )}
                                {pred_value === 221.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (15%)</Text>
                                )}
                                {pred_value === 222.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (16%)</Text>
                                )}
                                {pred_value === 223.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (17%)</Text>
                                )}
                                {pred_value === 224.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (18%)</Text>
                                )}
                                {pred_value === 225.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (19%)</Text>
                                )}
                                {pred_value === 226.0 && (
                                    <Text style={styles.resultText}>Removal of infected plant (20%)</Text>
                                )}
                                {pred_value === 227.0 && (
                                    <Text style={styles.resultText}>Remove affected leaves and stems (70%)</Text>
                                )}
                                {pred_value === 228.0 && (
                                    <Text style={styles.resultText}>Remove affected leaves and stems, and apply a fungicide (80%)</Text>
                                )}
                                {pred_value === 229.0 && (
                                    <Text style={styles.resultText}>Remove affected leaves and stems, apply a fungicide (80%)</Text>
                                )}
                                {pred_value === 230.0 && (
                                    <Text style={styles.resultText}>Remove affected leaves and stems, apply a fungicide, and destroy infected plant material (90%)</Text>
                                )}
                                {pred_value === 231.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (23%)</Text>
                                )}
                                {pred_value === 232.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (25%)</Text>
                                )}
                                {pred_value === 233.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (26%)</Text>
                                )}
                                {pred_value === 234.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (27%)</Text>
                                )}
                                {pred_value === 235.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (28%)</Text>
                                )}
                                {pred_value === 236.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (29%)</Text>
                                )}
                                {pred_value === 237.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (30%)</Text>
                                )}
                                {pred_value === 238.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (31%)</Text>
                                )}
                                {pred_value === 239.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (32%)</Text>
                                )}
                                {pred_value === 240.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (33%)</Text>
                                )}
                                {pred_value === 241.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (34%)</Text>
                                )}
                                {pred_value === 242.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (35%)</Text>
                                )}
                                {pred_value === 243.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (36%)</Text>
                                )}
                                {pred_value === 244.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (37%)</Text>
                                )}
                                {pred_value === 245.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (38%)</Text>
                                )}
                                {pred_value === 246.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (39%)</Text>
                                )}
                                {pred_value === 247.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (40%)</Text>
                                )}
                                {pred_value === 248.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (41%)</Text>
                                )}
                                {pred_value === 249.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (42%)</Text>
                                )}
                                {pred_value === 250.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (43%)</Text>
                                )}
                                {pred_value === 251.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (44%)</Text>
                                )}
                                {pred_value === 252.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (45%)</Text>
                                )}
                                {pred_value === 253.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (46%)</Text>
                                )}
                                {pred_value === 254.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (47%)</Text>
                                )}
                                {pred_value === 255.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (48%)</Text>
                                )}
                                {pred_value === 256.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (49%)</Text>
                                )}
                                {pred_value === 257.0 && (
                                    <Text style={styles.resultText}>Remove and destroy infected plant (50%)</Text>
                                )}
                                {pred_value === 258.0 && (
                                    <Text style={styles.resultText}>Remove the affected leaves and spray the plant with a fungicide (90%)</Text>
                                )}
                                {pred_value === 259.0 && (
                                    <Text style={styles.resultText}>Remove the affected plant and replant in a well-drained location (90%)</Text>
                                )}
                                {pred_value === 260.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (32%)</Text>
                                )}
                                {pred_value === 261.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (33%)</Text>
                                )}
                                {pred_value === 262.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (34%)</Text>
                                )}
                                {pred_value === 263.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (35%)</Text>
                                )}
                                {pred_value === 264.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (36%)</Text>
                                )}
                                {pred_value === 265.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (38%)</Text>
                                )}
                                {pred_value === 266.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (39%)</Text>
                                )}
                                {pred_value === 267.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (40%)</Text>
                                )}
                                {pred_value === 268.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (41%)</Text>
                                )}
                                {pred_value === 269.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (42%)</Text>
                                )}
                                {pred_value === 270.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (43%)</Text>
                                )}
                                {pred_value === 271.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (44%)</Text>
                                )}
                                {pred_value === 272.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (45%)</Text>
                                )}
                                {pred_value === 273.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (46%)</Text>
                                )}
                                {pred_value === 274.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (47%)</Text>
                                )}
                                {pred_value === 275.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (48%)</Text>
                                )}
                                {pred_value === 276.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (49%)</Text>
                                )}
                                {pred_value === 277.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (50%)</Text>
                                )}
                                {pred_value === 278.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (51%)</Text>
                                )}
                                {pred_value === 279.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (52%)</Text>
                                )}
                                {pred_value === 280.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (54%)</Text>
                                )}
                                {pred_value === 281.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (56%)</Text>
                                )}
                                {pred_value === 282.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (57%)</Text>
                                )}
                                {pred_value === 283.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (58%)</Text>
                                )}
                                {pred_value === 284.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (59%)</Text>
                                )}
                                {pred_value === 285.0 && (
                                    <Text style={styles.resultText}>Soil drench with fungicide (60%)</Text>
                                )}
                                {pred_value === 286.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (60%)</Text>
                                )}
                                {pred_value === 287.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (61%)</Text>
                                )}
                                {pred_value === 288.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (62%)</Text>
                                )}
                                {pred_value === 289.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (63%)</Text>
                                )}
                                {pred_value === 290.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (64%)</Text>
                                )}
                                {pred_value === 291.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (65%)</Text>
                                )}
                                {pred_value === 292.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (66%)</Text>
                                )}
                                {pred_value === 293.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (67%)</Text>
                                )}
                                {pred_value === 294.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (69%)</Text>
                                )}
                                {pred_value === 295.0 && (
                                    <Text style={styles.resultText}>Soil drenched with gypsum (70%)</Text>
                                )}
                                {pred_value === 296.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a fungicide (80%)</Text>
                                )}
                                {pred_value === 297.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of baking soda and water (70%)</Text>
                                )}
                                {pred_value === 298.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (71%)</Text>
                                )}
                                {pred_value === 299.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (72%)</Text>
                                )}
                                {pred_value === 300.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (73%)</Text>
                                )}
                                {pred_value === 301.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (74%)</Text>
                                )}
                                {pred_value === 302.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (75%)</Text>
                                )}
                                {pred_value === 303.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (76%)</Text>
                                )}
                                {pred_value === 304.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (77%)</Text>
                                )}
                                {pred_value === 305.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (78%)</Text>
                                )}
                                {pred_value === 306.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (79%)</Text>
                                )}
                                {pred_value === 307.0 && (
                                    <Text style={styles.resultText}>Spray the plant with a mixture of water and baking soda (80%)</Text>
                                )}
                                {pred_value === 308.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (31%)</Text>
                                )}
                                {pred_value === 309.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (32%)</Text>
                                )}
                                {pred_value === 310.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (33%)</Text>
                                )}
                                {pred_value === 311.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (34%)</Text>
                                )}
                                {pred_value === 312.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (35%)</Text>
                                )}
                                {pred_value === 313.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (36%)</Text>
                                )}
                                {pred_value === 314.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (37%)</Text>
                                )}
                                {pred_value === 315.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (38%)</Text>
                                )}
                                {pred_value === 316.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (39%)</Text>
                                )}
                                {pred_value === 317.0 && (
                                    <Text style={styles.resultText}>Systemic bactericide and Water the plant at the base and avoid getting water on the leaves (40%)</Text>
                                )}
                                {pred_value === 318.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (42%)</Text>
                                )}
                                {pred_value === 319.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (44%)</Text>
                                )}
                                {pred_value === 320.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (46%)</Text>
                                )}
                                {pred_value === 321.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (48%)</Text>
                                )}
                                {pred_value === 322.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (50%)</Text>
                                )}
                                {pred_value === 323.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (52%)</Text>
                                )}
                                {pred_value === 324.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (54%)</Text>
                                )}
                                {pred_value === 325.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (56%)</Text>
                                )}
                                {pred_value === 326.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (58%)</Text>
                                )}
                                {pred_value === 327.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (59%)</Text>
                                )}
                                {pred_value === 328.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (60%)</Text>
                                )}
                                {pred_value === 329.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (62%)</Text>
                                )}
                                {pred_value === 330.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (64%)</Text>
                                )}
                                {pred_value === 331.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (66%)</Text>
                                )}
                                {pred_value === 332.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (69%)</Text>
                                )}
                                {pred_value === 333.0 && (
                                    <Text style={styles.resultText}>Systemic fungicide (70%)</Text>
                                )}
                                {pred_value === 334.0 && (
                                    <Text style={styles.resultText}>There is no remedy</Text>
                                )}
                                {pred_value === 335.0 && (
                                    <Text style={styles.resultText}>There is no remedy at this pH</Text>
                                )}
                                {pred_value === 336.0 && (
                                    <Text style={styles.resultText}>There is no remedy</Text>
                                )}
                                {pred_value === 337.0 && (
                                    <Text style={styles.resultText}>There is no remedy</Text>
                                )}
                                {pred_value === 338.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (34%)</Text>
                                )}
                                {pred_value === 339.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (35%)</Text>
                                )}
                                {pred_value === 340.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (36%)</Text>
                                )}
                                {pred_value === 341.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (37%)</Text>
                                )}
                                {pred_value === 342.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (38%)</Text>
                                )}
                                {pred_value === 343.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (39%)</Text>
                                )}
                                {pred_value === 344.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (40%)</Text>
                                )}
                                {pred_value === 345.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (41%)</Text>
                                )}
                                {pred_value === 346.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (42%)</Text>
                                )}
                                {pred_value === 347.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (43%)</Text>
                                )}
                                {pred_value === 348.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (44%)</Text>
                                )}
                                {pred_value === 349.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (45%)</Text>
                                )}
                                {pred_value === 350.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (46%)</Text>
                                )}
                                {pred_value === 351.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (47%)</Text>
                                )}
                                {pred_value === 352.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (48%)</Text>
                                )}
                                {pred_value === 353.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (49%)</Text>
                                )}
                                {pred_value === 354.0 && (
                                    <Text style={styles.resultText}>Transplant the plant to a new pot or bed that is filled with nutrient-rich soil (50%)</Text>
                                )}
                                {pred_value === 355.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (52%)</Text>
                                )}
                                {pred_value === 356.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (53%)</Text>
                                )}
                                {pred_value === 357.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (54%)</Text>
                                )}
                                {pred_value === 358.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (55%)</Text>
                                )}
                                {pred_value === 359.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (56%)</Text>
                                )}
                                {pred_value === 360.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (57%)</Text>
                                )}
                                {pred_value === 361.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (58%)</Text>
                                )}
                                {pred_value === 362.0 && (
                                    <Text style={styles.resultText}>Transplant to a new location, Apply a foliar spray of a plant growth regulator (59%)</Text>
                                )}
                                {pred_value === 363.0 && (
                                    <Text style={styles.resultText}>
                                        Transplant to a new location, Apply a foliar spray of a plant growth regulator (60%)
                                    </Text>
                                )}

                                {pred_value === 364.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (62%)
                                    </Text>
                                )}

                                {pred_value === 365.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (63%)
                                    </Text>
                                )}

                                {pred_value === 366.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (64%)
                                    </Text>
                                )}

                                {pred_value === 367.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (65%)
                                    </Text>
                                )}

                                {pred_value === 368.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (66%)
                                    </Text>
                                )}

                                {pred_value === 369.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (67%)
                                    </Text>
                                )}

                                {pred_value === 370.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (68%)
                                    </Text>
                                )}

                                {pred_value === 371.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (69%)
                                    </Text>
                                )}

                                {pred_value === 372.0 && (
                                    <Text style={styles.resultText}>
                                        Use a commercial fungicide and Continue to remove any affected leaves (70%)
                                    </Text>
                                )}

                                {pred_value === 373.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (71%)
                                    </Text>
                                )}

                                {pred_value === 374.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (72%)
                                    </Text>
                                )}

                                {pred_value === 375.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (73%)
                                    </Text>
                                )}

                                {pred_value === 376.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (74%)
                                    </Text>
                                )}

                                {pred_value === 377.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (75%)
                                    </Text>
                                )}

                                {pred_value === 378.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (76%)
                                    </Text>
                                )}

                                {pred_value === 379.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (77%)
                                    </Text>
                                )}

                                {pred_value === 380.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (78%)
                                    </Text>
                                )}

                                {pred_value === 381.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (79%)
                                    </Text>
                                )}

                                {pred_value === 382.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant at the base, avoiding getting water on the leaves and apply Fungicide spray (80%)
                                    </Text>
                                )}

                                {pred_value === 383.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant regularly (70%)
                                    </Text>
                                )}

                                {pred_value === 384.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant with fresh, non-saline water (70%)
                                    </Text>
                                )}

                                {pred_value === 385.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant with fresh, non-saline water and apply a fertilizer that is low in salt content (80%)
                                    </Text>
                                )}

                                {pred_value === 386.0 && (
                                    <Text style={styles.resultText}>
                                        Water the plant with fresh, non-saline water and apply a fertilizer that is very low in salt content (90%)
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


export default PredictRemedy;