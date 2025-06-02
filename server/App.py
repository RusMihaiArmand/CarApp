from datetime import datetime
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import requests
import os
import shutil
import json
import gzip
import base64

app = Flask(__name__)
CORS(app)  



#note to self: 0 -> connect to board and everything else; 127 -> front/back only; aka for testing
hostIp = '0.0.0.0'
#hostIp = '127.0.0.1'
boardVal = 0

start_moving = 0
fan_speed = 95
default_fan_speed = 95
min_fan_speed = 10
max_fan_speed = 180

temp = 0
hum = 0
stop_number = 0
car_moving = False

lower_temp = 20.0
upper_temp = 40.0

client = MongoClient("mongodb+srv://mihaiarm:pass_seti@cluster0.wwuhep5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


recent_temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
recent_hum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
recent_speed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


fan_control_type = 'MANUAL' # 0 - manual, 1 - auto

#this is used by espduino
@app.route('/get_values', methods=['GET'])
def get_val_state():
    
    # start_moving, fan_motor_speed
    global start_moving
    global fan_speed
    global temp

    


    start_moving_copy = start_moving
    start_moving = 0

    return jsonify({"start_moving":start_moving_copy, "fan_speed":fan_speed})


@app.route('/update_data', methods=['POST'])
def post_val_change():
   
    # it gets stopNr, tempVal, humVal, car_status = 1 stationary / 0 moving
    global temp
    global hum
    global stop_number
    global car_moving
    global fan_speed
    global recent_hum
    global recent_temp
    global recent_speed

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


    if data and "car_status" in data:
        if data["car_status"] == 1:
            car_moving = False
        else:
            car_moving = True

    else:
        msg += "car_status not provided; "




    db = client["saved_data"]
    collection = db["readings"]

    current_time = datetime.now()
    
    data = {
        "fan_speed": fan_speed,
        "temperature": temp,
        "humidity": hum,
        "last_stop": stop_number,
        "moving": car_moving,
        "timestamp": current_time
    }

    collection.insert_one(data)


    recent_speed[0:9] = recent_speed[1:10]
    recent_speed[9] = fan_speed

    recent_hum[0:9] = recent_hum[1:10]
    recent_hum[9] = hum

    recent_temp[0:9] = recent_temp[1:10]
    recent_temp[9] = temp



    if fan_control_type == 'AUTO':
        if temp <= lower_temp:
            fan_speed = default_fan_speed
        else:
            if temp >= upper_temp:
                fan_speed = max_fan_speed
            else:
                fan_speed = int(default_fan_speed + ( (max_fan_speed-default_fan_speed)*(temp-lower_temp)/(upper_temp-lower_temp) ))
        
    
    if status == "error":
        return jsonify({"status": status, "message": msg}), 400
    else:
        return jsonify({"status": status, "message": msg})
    
    
@app.route('/get_graph_values', methods=['GET'])
def get_graph_values():
    global recent_temp
    global recent_hum
    global recent_speed

    return jsonify({"temp_vals": recent_temp, "hum_vals": recent_hum, "speed_vals": recent_speed})

#this is used by frontend
@app.route('/get_all_values', methods=['GET'])
def get_all_values():
    
    global fan_speed
    global temp
    global hum
    global stop_number
    global car_moving

    

    return jsonify({"fan_speed":fan_speed, "temp":temp, "hum":hum, "stops":stop_number})



@app.route('/change_fan_speed', methods=['POST'])
def fan_change():
    global fan_speed

    if fan_control_type == 'MANUAL':

        slider = int(request.args.get('slider',0))
        
        if(slider==0):
            new_speed = default_fan_speed
        else:
            if slider < 0:
                new_speed = int(default_fan_speed - ( (default_fan_speed-min_fan_speed)*slider/100 ))
            else:
                new_speed = int(default_fan_speed + ( (max_fan_speed-default_fan_speed)*slider/100 ))

        fan_speed = new_speed
    

    return jsonify({"fan_speed": fan_speed})



@app.route('/change_control_type', methods=['POST'])
def change_control_type():

    global fan_control_type

    if fan_control_type == 'MANUAL':
        fan_control_type = 'AUTO'
    else:
        fan_control_type = 'MANUAL'

    return jsonify({"control_type":fan_control_type})



@app.route('/continue_car_movement', methods=['POST'])
def restart_car():

    global car_moving
    global start_moving

    if(car_moving == False):
        start_moving = 1
        return jsonify({"msg":"ok"})
    
    return jsonify({"msg":"Car already moving"})



    



@app.route('/get_control_type', methods=['GET'])
def get_control_type():
    global fan_control_type
    return jsonify({"control_type":fan_control_type})




   



@app.route('/api/greet', methods=['GET'])
def greet():
    return jsonify({"message": "Hello from Python backend!"})


if __name__ == '__main__':
    app.run(host = hostIp, port=5000)






# mongodb+srv://mihaiarm:<db_password>@cluster0.wwuhep5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
# pass = pass_seti
# mongodb+srv://mihaiarm:pass_seti@cluster0.wwuhep5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


