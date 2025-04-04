<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Restablecimiento de Contraseña</title>
    <style>
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
            display: inline-block !important;
        }
        h1 {
            color: #00b341;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        p {
            margin-bottom: 18px;
            font-size: 16px;
            color: #444;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #00b341;
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 16px;
        }
        .url-container {
            background-color: #f5f7fa;
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            border: 1px solid #e1e4e8;
            margin: 20px 0;
            color: #555;
            word-break: break-all;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Usando una URL más confiable para correos electrónicos -->
            <img src="https://i.imgur.com/8ATquYo.png" alt="Predict & Win Logo" style="max-width: 180px; height: auto; display: inline-block !important;">
            <h1>Restablecimiento de Contraseña</h1>
        </div>

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