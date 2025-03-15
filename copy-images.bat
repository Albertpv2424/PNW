@echo off
echo Creando directorios...
mkdir c:\PNW\odds-api-laravel\public\uploads\premios
mkdir c:\PNW\odds-api-laravel\public\uploads\promociones

echo Copiando imágenes de premios...
copy c:\PNW\frontend\src\assets\premios\tour.png c:\PNW\odds-api-laravel\public\uploads\premios\
copy c:\PNW\frontend\src\assets\premios\karting.png c:\PNW\odds-api-laravel\public\uploads\premios\
copy c:\PNW\frontend\src\assets\premios\cena.png c:\PNW\odds-api-laravel\public\uploads\premios\
copy c:\PNW\frontend\src\assets\premios\entradas.png c:\PNW\odds-api-laravel\public\uploads\premios\

echo Copiando imágenes de promociones...
copy c:\PNW\frontend\src\assets\promociones\bienvenida.png c:\PNW\odds-api-laravel\public\uploads\promociones\
copy c:\PNW\frontend\src\assets\promociones\apuesta-segura.png c:\PNW\odds-api-laravel\public\uploads\promociones\
copy c:\PNW\frontend\src\assets\promociones\copa-rey.png c:\PNW\odds-api-laravel\public\uploads\promociones\
copy c:\PNW\frontend\src\assets\promociones\liga.png c:\PNW\odds-api-laravel\public\uploads\promociones\

echo Imágenes copiadas correctamente.