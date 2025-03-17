<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Restablecimiento de Contraseña</title>
    <style>
        /* Estilos anteriores se mantienen igual */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f7fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            padding: 40px;
            margin-top: 20px;
            border: 1px solid #e1e4e8;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f2f5;
        }
        .header img {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
        }
        h1 {
            color: #00b341;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        /* Estilo del botón exactamente como en la imagen */
        /* Cambiamos el color del texto del botón a blanco y aseguramos que se aplique */
        .button {
            display: inline-block;
            background-color: #00b341;
            color: #FFFFFF !important; /* Texto en blanco con !important para forzar */
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            transition: background-color 0.3s;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
            background-color: #00cc4a;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #777;
            text-align: center;
        }
        p {
            margin-bottom: 18px;
            font-size: 16px;
            color: #444;
        }
        .url-container {
            word-break: break-all;
            background-color: #f5f7fa;
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            border: 1px solid #e1e4e8;
            margin: 20px 0;
            color: #555;
        }
        .saludo {
            font-weight: 500;
            font-size: 18px;
        }
        strong {
            color: #00b341;
        }
        /* Logo personalizado con HTML/CSS básico */
        .logo-container {
            background-color: #00b341;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            width: 180px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Eliminamos los estilos del logo personalizado y mantenemos los originales */
        .header img {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
        }

        /* El botón está bien ahora */
        .button {
            display: inline-block;
            background-color: #00b341;
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            transition: background-color 0.3s;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Usamos la imagen directamente desde la carpeta public -->
            <img src="{{ url('uploads/logo.jpg') }}" alt="Predict & Win Logo">
            <h1>Restablecimiento de Contraseña</h1>
        </div>

        <p class="saludo">Hola,</p>

        <p>Has solicitado restablecer tu contraseña para tu cuenta en <strong>Predict & Win</strong>. Haz clic en el siguiente botón para crear una nueva contraseña:</p>

        <div class="button-container">
            <a href="{{ $resetUrl }}" class="button" style="color: #FFFFFF !important;">Restablecer Contraseña</a>
        </div>

        <p>Si no has solicitado este cambio, puedes ignorar este correo electrónico y tu contraseña permanecerá sin cambios.</p>

        <p>Por razones de seguridad, este enlace expirará en 60 minutos.</p>

        <p>Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:</p>

        <div class="url-container">{{ $resetUrl }}</div>

        <div class="footer">
            <p>Este es un correo electrónico automático, por favor no respondas a este mensaje.</p>
            <p>&copy; {{ date('Y') }} Predict & Win. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>