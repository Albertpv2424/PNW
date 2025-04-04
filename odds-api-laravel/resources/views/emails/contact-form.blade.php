<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nuevo Mensaje de Contacto</title>
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
        }
        h1 {
            color: #00b341;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        .content {
            padding: 0 20px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #777;
            text-align: center;
        }
        .label {
            font-weight: bold;
            color: #00b341;
            display: inline-block;
            width: 150px;
        }
        .message-content {
            background-color: #f5f7fa;
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            border: 1px solid #e1e4e8;
            margin: 20px 0;
            color: #555;
        }
        p {
            margin-bottom: 18px;
            font-size: 16px;
            color: #444;
        }
        .saludo {
            font-weight: 500;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Usamos la imagen directamente desde la carpeta public -->
            <img src="{{ url('uploads/logo.jpg') }}" alt="Predict & Win Logo">
            <h1>Nuevo Mensaje de Contacto</h1>
        </div>
        
        <div class="content">
            <p class="saludo">Hola,</p>
            
            <p>Se ha recibido un nuevo mensaje de contacto con los siguientes detalles:</p>
            
            <p><span class="label">Nombre:</span> {{ $name }}</p>
            <p><span class="label">Correo electrónico:</span> {{ $email }}</p>
            <p><span class="label">Tipo de consulta:</span> {{ $issueType }}</p>
            
            <p class="label">Mensaje:</p>
            <div class="message-content">{{ $messageContent }}</div>
            
            <p>Por favor, responde a este mensaje lo antes posible.</p>
        </div>
        
        <div class="footer">
            <p>Este correo ha sido generado automáticamente desde el formulario de contacto de Predict & Win.</p>
            <p>&copy; {{ date('Y') }} Predict & Win. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>