import { getConnection } from '../database/connection.js';
import sql from 'mssql';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM GestionActivos.Usuario WHERE Correo = @email');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      if (password === user.Contraseña) {
        res.status(200).send('Login exitoso');
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).send('Error interno del servidor');
  }
};

