# Baas file saadud: https://www.koyeb.com/docs/deploy/flask

### jooksutamine
# docker build -f api.Dockerfile -t api .
# docker run -dit -p 5000:8000 --name api api

FROM python:3.12 AS builder
 
WORKDIR /
 
RUN python3 -m venv venv
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
 
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
# Stage 2
FROM python:3.12 AS runner
 
WORKDIR /
 
COPY --from=builder /venv venv
COPY main.py main.py
COPY /words /words
 
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV FLASK_app=main.py
 
EXPOSE 8000

CMD ["gunicorn", "--bind" , ":8000", "--workers", "2", "main:app"]