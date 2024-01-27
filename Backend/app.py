from flask import Flask, jsonify, request
import pickle
import numpy as np
from flask_cors import CORS



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = 'some_secret_key'

# Function for the first prediction model
def prediction1(lst):
    filename = 'model/predictor1.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
    pred_value = model.predict([lst])
    return pred_value[0]

# Function for the second prediction model
def prediction2(lst):
    filename = 'model/predictor.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
    pred_value = model.predict([lst])
    return pred_value[0]

def prediction3(lst):
    filename = 'model/severityPredictor.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
    pred_value = model.predict([lst])
    return pred_value[0]

def prediction4(lst):
    filename = 'model/remedyPredictor.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
    pred_value = model.predict([lst])
    return pred_value[0]

def prediction5(lst):
    filename = 'model/earlyRisk.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
        pred_value = model.predict([lst])
        return pred_value[0]


@app.route('/')
def hello_world():
    return 'Hello, World!'

# First route for the first prediction model
@app.route('/api/predict/water', methods=['POST'])
def predict_water():
    try:
        data = request.json
        Temperature = data['Temperature']
        Humidity = data['Humidity']
        Rainfall = data['Rainfall']
        Moisture = data['Moisture']
        Windspeed = data['Windspeed']
        Disease = data['Disease']
        
        feature_list = [float(Temperature), int(Humidity), int(Rainfall), int(Moisture), float(Windspeed)]
        Disease_list = ['Anthracnose','Dieback','Leaf spot','Root rot']

        def traverse_list(lst, value):
            for item in lst:
                if item == value:
                    feature_list.append(1)
                else:
                    feature_list.append(0)
        
        traverse_list(Disease_list, Disease)

        pred_value = prediction1(feature_list)
        pred_value = round(pred_value, 2)

        return jsonify({"pred_value": pred_value})

    except Exception as e:
        return jsonify({"error": str(e)})

# Second route for the second prediction model
@app.route('/api/predict/wind', methods=['POST'])
def predict_wind():
    try:
        data = request.json
        Windspeed = data['Windspeed']
        Humidity = data['Humidity']
        Disease = data['Disease']
        Temperature = data['Temperature']
        
        feature_list = [float(Windspeed), int(Humidity), float(Temperature)]
        Disease_list = ['Anthracnose','Downy mildew','Powdery mildew','Rust']

        def traverse_list(lst, value):
            for item in lst:
                if item == value:
                    feature_list.append(1)
                else:
                    feature_list.append(0)
        
        traverse_list(Disease_list, Disease)

        pred_value = prediction2(feature_list)
        pred_value = round(pred_value, 2)
        
        return jsonify({"pred_value": pred_value})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/predict/Severity', methods=['POST'])
def predict_severity():    
    try:
        data = request.json
        disease = data['disease']
        nitrogen = data['nitrogen']
        phosphorus = data['phosphorus']
        potassium = data['potassium']
        temperature = data['temperature']
        humidity = data['humidity']

        feature_list = [float(nitrogen),float(phosphorus),float(potassium),float(temperature),float(humidity)]
        disease_list = ['anthracnose', 'bacterialWilt', 'cankerDisease', 'cercosporaLeafBlight', 'dieback', 'leafSpot', 'nematodeInfestations', 'nutrientDeficiency', 'powderyMildew', 'rootRot', 'rustDisease', 'salinityStress', 'waterlogging']

        def traverse_list(lst, value):
            for item in lst:
                if item == value:
                    feature_list.append(1)
                else:
                    feature_list.append(0)
        
        traverse_list(disease_list, disease)

        pred_value = prediction3(feature_list)
        pred_value = round(pred_value)

        return jsonify({"pred_value": pred_value})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/predict/Remedy', methods=['POST'])
def predict_remedy():
    try:
        data = request.json
        disease = data['disease']
        nitrogen = data['nitrogen']
        phosphorus = data['phosphorus']
        potassium = data['potassium']
        temperature = data['temperature']
        humidity = data['humidity']
        severity_level = data['severity_level']

        feature_list = [float(nitrogen),float(phosphorus),float(potassium),float(temperature),float(humidity)]

        disease_list = ['anthracnose', 'bacterialWilt', 'cankerDisease', 'cercosporaLeafBlight', 'dieback', 'leafSpot', 'nematodeInfestations', 'nutrientDeficiency', 'powderyMildew', 'rootRot', 'rustDisease', 'salinityStress', 'waterlogging']
        severity_level_list = ['mild', 'moderate', 'severe']

        def traverse_list(lst, value):
            for item in lst:
                if item == value:
                    feature_list.append(1)
                else:
                    feature_list.append(0)

        traverse_list(disease_list, disease)
        traverse_list(severity_level_list, severity_level)

        pred_value = prediction4(feature_list)
        print(pred_value)
        pred_value = round(pred_value)
        

        return jsonify({"pred_value": pred_value})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/api/predict/EarlyRisk', methods=['POST'])
def index():
    try:
        data = request.json
        temperature =data['temperature']
        humidity = data['humidity']
        nitrogen = data['nitrogen']
        potassium = data['potassium']
        phosphorus = data['phosphorus']
        # print(temperature)
        # print(humidity)
        # print(soilmoisture)
        # print(ph)
        # print(nitrogen)
        # print(potassium)
        # print(phosphorus)
        feature_list = []
        feature_list.append(float(temperature))
        feature_list.append(float(humidity))
        feature_list.append(float(nitrogen))
        feature_list.append(float(potassium))
        feature_list.append(float(phosphorus))

        pred_value = prediction5(feature_list)
        pred_value = np.round(pred_value)

        return jsonify({"pred_value": pred_value})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
