import base64
import json
from io import BytesIO

import numpy as np
import cv2

from flask import Flask, request
import tensorflow as tf
import tensorflow.keras as tfk
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
app.config['SECRET_KEY'] = 'DontTellAnyone'

def decode(message):
    decoded_msg = BytesIO(base64.b64decode(message))
    img = image.img_to_array(image.load_img(decoded_msg))
    img = img.astype('float32')
    return img

def bbox(img):
    a = np.where(img >= 0.1)
    if len(a[0]) == 0:
        return 0, 100, 0, 100
    bbox = np.min(a[0]), np.max(a[0]), np.min(a[1]), np.max(a[1])
    return bbox

def preprocess(img):
    gray = 1 - cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) / 255.0

    rmin, rmax, cmin, cmax = bbox(gray)
    gray_cropped = gray[rmin:rmax, cmin:cmax].copy()

    res = cv2.resize(gray_cropped,
                     dsize=(28, 28),
                     interpolation=cv2.INTER_CUBIC)
    return res

def predict(img):
    model = tfk.models.load_model('model.h5')
    preds = model.predict(img.reshape(1, 28*28))[0]
    return preds

labels = ['-a', '-i', '-u',
          'ba', 'bi', 'bu', 'b-',
          'ka', 'ki', 'ku', 'k-',
          'da', 'di', 'du', 'd-',
          'ga', 'gi', 'gu', 'g-',
          'ha', 'hi', 'hu', 'h-',
          'la', 'li', 'lu', 'l-',
          'ma', 'mi', 'mu', 'm-',
          'na', 'ni', 'nu', 'n-',
          'nga', 'ngi', 'ngu', 'ng-',
          'pa', 'pi', 'pu', 'p-',
          'sa', 'si', 'su', 's-',
          'ta', 'ti', 'tu', 't-',
          'wa', 'wi', 'wu', 'w-',
          'ya', 'yi', 'yu', 'y-']

@app.route('/fromImage/', methods=['POST'])
def fromImage():
    message = request.form['b64']
    img = decode(message)
    processed_img = preprocess(img)
    preds = predict(processed_img)
    idx = np.where(preds == preds.max())
    print(preds, idx[0][0])
    return labels[idx[0][0]]

@app.route('/', methods=['GET', 'POST'])
def index():
    return "Hello World!"


if __name__ == '__main__':
  app.run(debug=True)
