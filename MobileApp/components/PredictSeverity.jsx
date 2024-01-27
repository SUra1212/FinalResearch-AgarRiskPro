import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ref, onValue } from "firebase/database"
import { db } from '../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome5'
import COLORS from "../consts/colors";


const PredictSeverity = () => {
    const [pred_value, setPredValue] = useState(0);
    const [disease, setDisease] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
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
                disease,
            };
            console.log(feature_list)
            try {
                const response = await axios.post('http://10.0.2.2:5000/api/predict/Severity', feature_list);
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
                        Agarwood Disease Severity Predictor
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
                                    <Picker.Item label="Anthracnose" value="anthracnose" />
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


                            <TouchableOpacity style={styles.button}
                                onPress={handleSubmit}>
                                <Text
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 22,
                                        color: COLORS.white,
                                    }}
                                >
                                    Predict Severity
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.result}>
                                {pred_value === 1.0 && (
                                    <Text style={styles.resultText}>Severity Level: Mild</Text>
                                )}
                                {pred_value === 2.0 && (
                                    <Text style={styles.resultText1}>Severity Level: Moderate</Text>
                                )}
                                {pred_value === 3.0 && (
                                    <Text style={styles.resultText2}>Severity Level: Severe</Text>
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


export default PredictSeverity;