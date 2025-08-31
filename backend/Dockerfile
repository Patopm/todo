# Usa Python slim
FROM python:3.11-slim

# Variables de entorno para no generar pyc
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Directorio de la app
WORKDIR /code

# Instala dependencias de SO para psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copia e instala requirements
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install -r requirements.txt

# Copia código
COPY . .

# Recopila estáticos (para prod)
RUN python manage.py collectstatic --noinput

# Expone puerto
EXPOSE 8000

# Comando por defecto
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]