FROM python:slim
COPY requirements.txt .
RUN python3 -m pip install --upgrade -r requirements.txt
COPY . .
CMD ["python", "index.py"]