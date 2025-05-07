from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
import shutil
import json
import gzip
import base64

app = Flask(__name__)
CORS(app)  



ledState = False
speed = 0
direction = 'STOP'

#hostIp = '0.0.0.0'
hostIp = '127.0.0.1'
boardVal = 0


@app.route('/state_val', methods=['GET'])
def val_state():
    global boardVal

    return jsonify({"testVal":boardVal})



@app.route('/post_data', methods=['POST'])
def val_change():
    global boardVal
    data = request.get_json()  

    if data and "testVal" in data:
        boardVal = data["testVal"]
        return jsonify({"status": "success", "boardVal": boardVal})
    else:
        return jsonify({"status": "error", "message": "testVal not provided"}), 400

   
    

@app.route('/change_led', methods=['POST'])
def led_change():
    global ledState
    ledState = not ledState

    if ledState:
        return jsonify({"ledState":"ON"})
    return jsonify({"ledState":"OFF"})


@app.route('/state_led', methods=['GET'])
def led_state():
    global ledState
    
    if ledState:
        return jsonify({"ledState":"ON"})
    return jsonify({"ledState":"OFF"})


@app.route('/change_speed', methods=['POST'])
def motor_change():
    global speed, direction

    slider = int(request.args.get('slider',0))
    speed = abs(slider)
    

    if slider == 0:
        direction = 'STOP'
    else:
        if slider > 0:
            direction = 'FORWARD'
        else:
            direction = 'BACKWARDS'

    
    return jsonify({"speed": speed, "direction": direction})



@app.route('/state_speed', methods=['GET'])
def motor_state():

    
    return jsonify({"speed": speed, "direction": direction})


@app.route('/api/greet', methods=['GET'])
def greet():
    return jsonify({"message": "Hello from Python backend!"})


if __name__ == '__main__':
    app.run(host = hostIp, port=5000)
