@echo off
echo Verificando directorios...

if not exist c:\PNW\odds-api-laravel\public\uploads (
    echo Creando directorio uploads...
    mkdir c:\PNW\odds-api-laravel\public\uploads
)

if not exist c:\PNW\odds-api-laravel\public\uploads\premios (
    echo Creando directorio premios...
    mkdir c:\PNW\odds-api-laravel\public\uploads\premios
)

if not exist c:\PNW\odds-api-laravel\public\uploads\promociones (
    echo Creando directorio promociones...
    mkdir c:\PNW\odds-api-laravel\public\uploads\promociones
)

echo Verificando imágenes de premios...

if exist c:\PNW\frontend\src\assets\premios\tour.png (
    echo Copiando tour.png...
    copy c:\PNW\frontend\src\assets\premios\tour.png c:\PNW\odds-api-laravel\public\uploads\premios\
) else (
    echo ADVERTENCIA: No se encontró tour.png
)

if exist c:\PNW\frontend\src\assets\premios\karting.png (
    echo Copiando karting.png...
    copy c:\PNW\frontend\src\assets\premios\karting.png c:\PNW\odds-api-laravel\public\uploads\premios\
) else (
    echo ADVERTENCIA: No se encontró karting.png
)

if exist c:\PNW\frontend\src\assets\premios\cena.png (
    echo Copiando cena.png...
    copy c:\PNW\frontend\src\assets\premios\cena.png c:\PNW\odds-api-laravel\public\uploads\premios\
) else (
    echo ADVERTENCIA: No se encontró cena.png
)

if exist c:\PNW\frontend\src\assets\premios\entradas.png (
    echo Copiando entradas.png...
    copy c:\PNW\frontend\src\assets\premios\entradas.png c:\PNW\odds-api-laravel\public\uploads\premios\
) else (
    echo ADVERTENCIA: No se encontró entradas.png
)

echo Verificando imágenes de promociones...

if exist c:\PNW\frontend\src\assets\promociones\bienvenida.png (
    echo Copiando bienvenida.png...
    copy c:\PNW\frontend\src\assets\promociones\bienvenida.png c:\PNW\odds-api-laravel\public\uploads\promociones\
) else (
    echo ADVERTENCIA: No se encontró bienvenida.png
)

if exist c:\PNW\frontend\src\assets\promociones\apuesta-segura.png (
    echo Copiando apuesta-segura.png...
    copy c:\PNW\frontend\src\assets\promociones\apuesta-segura.png c:\PNW\odds-api-laravel\public\uploads\promociones\
) else (
    echo ADVERTENCIA: No se encontró apuesta-segura.png
)

if exist c:\PNW\frontend\src\assets\promociones\copa-rey.png (
    echo Copiando copa-rey.png...
    copy c:\PNW\frontend\src\assets\promociones\copa-rey.png c:\PNW\odds-api-laravel\public\uploads\promociones\
) else (
    echo ADVERTENCIA: No se encontró copa-rey.png
)

if exist c:\PNW\frontend\src\assets\promociones\liga.png (
    echo Copiando liga.png...
    copy c:\PNW\frontend\src\assets\promociones\liga.png c:\PNW\odds-api-laravel\public\uploads\promociones\
) else (
    echo ADVERTENCIA: No se encontró liga.png
)

echo Verificando permisos de carpetas...
icacls c:\PNW\odds-api-laravel\public\uploads /grant Everyone:(OI)(CI)F /T

echo Proceso completado.