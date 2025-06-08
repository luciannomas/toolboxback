# Toolbox Backend API

API REST para manejo de archivos CSV con autenticación por API Key.

## Demo
Accede a la API en: [toolboxback-production.up.railway.app](https://toolboxback-production.up.railway.app)

## Endpoints

### Listar archivos disponibles
```bash
curl -X GET "https://toolboxback-production.up.railway.app/files" \
-H "Authorization: Bearer aSuperSecretKey"
```

### Obtener datos de un archivo específico
```bash
curl -X GET "https://toolboxback-production.up.railway.app/files/data?fileName=test1.csv" \
-H "Authorization: Bearer aSuperSecretKey"
```

## Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/luciannomas/toolboxback.git
```

2. Instala dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000` 