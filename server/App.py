import random
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

#note to self: 0 -> connect to board and everything else; 127 -> front/back only; aka for testing
hostIp = '0.0.0.0'
#hostIp = '127.0.0.1'
boardVal = 0

start_moving = 0
fan_speed = 0
default_fan_speed = 95
min_fan_speed = 10
max_fan_speed = 180

temp = 0
hum = 0
stop_number = 0

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




@app.route('/get_values', methods=['GET'])
def get_val_state():
    
    # start_moving, fan_motor_speed
    global start_moving
    global fan_speed

    start_moving_copy = start_moving
    start_moving = 0

    return jsonify({"start_moving":start_moving_copy, "fan_speed":fan_speed})


@app.route('/update_data', methods=['POST'])
def post_val_change():
   
    # it gets stopNr, tempVal, humVal
    global temp
    global hum
    global stop_number

    data = request.get_json()  

    status = "success"
    msg = ""

    if data and "stopNr" in data:
        stop_number = data["stopNr"]
    else:
        status = "error"
        msg += "stopNr not provided; "


    if data and "tempVal" in data:
        temp = data["tempVal"]
    else:
        status = "error"
        msg += "tempVal not provided; "


    if data and "humVal" in data:
        hum = data["humVal"]
    else:
        status = "error"
        msg += "humVal not provided; "
        
    
    if status == "error":
        return jsonify({"status": status, "message": msg}), 400
    else:
        return jsonify({"status": status, "message": msg})
    
    



@app.route('/get_all_values', methods=['GET'])
def get_all_values():
    
    global fan_speed
    global temp
    global hum
    global stop_number


    # TESTING ONLY; DELETE HERE \/ \/ \/

    # fan_speed = random.randint(0, 180)
    # temp = random.randint(200, 350) / 10
    # hum = random.randint(10, 40)
    # stop_number += random.randint(0,1)

    # TESTING ONLY; DELETE HERE /\ /\ /\
    

    return jsonify({"fan_speed":fan_speed, "temp":temp, "hum":hum, "stops":stop_number})



@app.route('/change_fan_speed', methods=['POST'])
def fan_change():
    global fan_speed, direction

    slider = int(request.args.get('slider',0))
    

    
    if(slider==0):
        new_speed = default_fan_speed
    elif slider < 0:
        new_speed = int(default_fan_speed - ( (default_fan_speed-min_fan_speed)*slider/100 ))
    else:
        new_speed = int(default_fan_speed + ( (max_fan_speed-default_fan_speed)*slider/100 ))


    
    #fan_speed = abs(slider)
    fan_speed = new_speed
    
    return jsonify({"fan_speed": fan_speed, "direction": direction})






   
   
    

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




#front - aspect
#database -mongoDB
#grafic frontend - temperatura/etc
#control motor -  automat/manual
