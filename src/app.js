const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Para procesar JSON en las solicitudes

// Resto de tu configuración de Express...

// Ruta para autenticación
app.post('/auth', (req, res) => {
  const { email } = req.body;

  // Verifica si el email está registrado en el arreglo de usuarios
  const users = [/* Tu arreglo de usuarios */];
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid user name or password' });
  }

  // Si el usuario existe, firma un token JWT
  const token = jwt.sign({ email: user.email, rol: user.rol, name: user.name }, process.env.SECRET_KEY, {
    algorithm: 'HS256',
  });

  // Envía el token como respuesta
  res.json({ token });
});

// Función de middleware para validar tokens JWT
function JWTValidation(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Verifica el rol y agrega el rol a los cabeceros del request
    if (decoded.rol === 'admin') {
      req.headers = { ...req.headers, rol: 'admin' };
    } else if (decoded.rol === 'user') {
      req.headers = { ...req.headers, rol: 'user' };
    }

    next();
  });
}

// Ruta para premium-clients
app.get('/premium-clients', JWTValidation, (req, res) => {
  if (req.headers.rol === 'admin') {
    res.send('premium-clients list');
  } else {
    res.status(403).json({ error: 'Access not allowed' });
  }
});

// Ruta para medium-clients
app.get('/medium-clients', JWTValidation, (req, res) => {
  if (req.headers.rol === 'admin' || req.headers.rol === 'user') {
    res.send('medium-clients list');
  } else {
    res.status(403).json({ error: 'Access not allowed' });
  }
});

// Resto de tus rutas y configuraciones...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

