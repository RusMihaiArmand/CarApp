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

# hostIp = '0.0.0.0'
hostIp = '127.0.0.1'

@app.route('/led', methods=['GET'])
def led_change():
    global ledState
    ledState = not ledState

    if ledState:
        return jsonify({"ledState":"ON"})
    return jsonify({"ledState":"OFF"})


@app.route('/speed', methods=['GET'])
def motor_change():

    slider = int(request.args.get('slider',0))
    

    if slider == 0:
        direction = 'STOP'
    else:
        if slider > 0:
            direction = 'FORWARD'
        else:
            direction = 'BACKWARDS'

    
    return jsonify({"speed": abs(slider), "direction": direction})




@app.route('/api/greet', methods=['GET'])
def greet():
    return jsonify({"message": "Hello from Python backend!"})


if __name__ == '__main__':
    app.run(host = hostIp, port=5000)
