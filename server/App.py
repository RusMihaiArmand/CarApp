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



@app.route('/led', methods=['GET'])
def led_change():
    global ledState
    ledState = not ledState

    if ledState:
        return jsonify(ledState="ON")
    return jsonify(ledState="OFF")





@app.route('/api/greet', methods=['GET'])
def greet():
    return jsonify({"message": "Hello from Python backend!"})


if __name__ == '__main__':
    app.run(port=5000)
