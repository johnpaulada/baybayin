import cv2
import numpy as np

MIN_AREA = 1000
MAX_AREA = 100000
EPS = 10

img_raw = cv2.imread('test_images/10.jpg')
gray = cv2.cvtColor(img_raw, cv2.COLOR_BGR2GRAY)


def extract_characters(img):
    ret, thresh = cv2.threshold(gray, 128, 255, cv2.THRESH_OTSU)
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

    print("bounds:", lower_bound, upper_bound)

    valid_bounds.sort(key=lambda tup: tup[0])
    segments = []

    def is_in_segments(x):
        for a, b in segments:
            if a+EPS <= x and x <= b-EPS:
                return True, (a, b)
        return False, (-1, -1)

    for x, y, w, h in valid_bounds:
        print(x, y)

        res, cross = is_in_segments(x)
        print(res, cross)
        if res:
            segments.remove(cross)
            segments.append((min(x, cross[0]), max(x+w, cross[1])))
        else:
            segments.append((x, x+w))

    results = []
    for a, b in segments:
        results.append(img[lower_bound:upper_bound, a:b])
        img[lower_bound:upper_bound, a:b] = 0
    return results, img

chars, img = extract_characters(img_raw)

cv2.imshow('img', img)
cv2.waitKey(0)
