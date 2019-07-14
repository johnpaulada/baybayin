import base64
import json
from io import BytesIO

import edlib
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

MIN_AREA = 1000
MAX_AREA = 100000
EPS = 10

with open('filipino_dict.txt', 'r') as f:
    filipino_dict = f.read().split('\n')

def extract_characters(img):
    # assumes that img is already grayed out

    ret, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_OTSU)
    contours, heirarchy = cv2.findContours(thresh, 1, 2)

    lower_bound = img.shape[1]
    upper_bound = 0
    valid_bounds = []
    for i, contour in enumerate(contours):
        x, y, w, h = cv2.boundingRect(contour)

        roi = img[y:y + h, x:x + w]

        area = w*h

        if MIN_AREA < area < MAX_AREA:
            valid_bounds.append((x, y, w, h))
            lower_bound = min(lower_bound, y)
            upper_bound = max(upper_bound, y+h)

    valid_bounds.sort(key=lambda tup: tup[0])
    segments = []

    def is_in_segments(x):
        for a, b in segments:
            if x <= b-EPS:
                return True, (a, b)
        return False, (-1, -1)

    for x, y, w, h in valid_bounds:
        res, cross = is_in_segments(x)
        if res:
            segments.remove(cross)
            segments.append((min(x, cross[0]), max(x+w, cross[1])))
        else:
            segments.append((x, x+w))

    results = []
    for a, b in segments:
        print(a, b)
        results.append(img[lower_bound:upper_bound, a:b])
    return results

def preprocess(img):
    rmin, rmax, cmin, cmax = bbox(img)
    img_cropped = img[rmin:rmax, cmin:cmax].copy()

    res = cv2.resize(img_cropped,
                     dsize=(28, 28),
                     interpolation=cv2.INTER_CUBIC)
    res = (res - res.min()) / (res.max() - res.min() + 1e-9)
    return res

def predict(img):
    model = tfk.models.load_model('model_robust.h5')
    preds = model.predict(img.reshape(1, 28*28))[0]
    return preds

def error_correct(msg, margin):
    possible = msg
    cur_error = 1e9
    for word in filipino_dict:
        error = edlib.align(msg, word, "NW", "distance", margin+1)['editDistance']
        if error == -1 or error > margin:
            continue
        if error < cur_error:
            cur_error = error
            possible = word
    if cur_error <= 2:
        return possible
    return msg

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
    gray = 255 - cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = gray.astype('uint8')

    characters = extract_characters(gray)

    res = ""
    for character in characters:
        char_processed = preprocess(character)
        preds = predict(char_processed)
        print(preds)
        idx = np.where(preds == preds.max())

        label = labels[idx[0][0]]
        res += label[:-1] if label[-1] == '-' else label[1:] if label[0] == '-' else label

    res_corrected = error_correct(res, margin=1) if len(characters) > 2 else res

    return res_corrected

@app.route('/', methods=['GET', 'POST'])
def index():
    return "Hello World!"


if __name__ == '__main__':
  app.run(debug=True)
