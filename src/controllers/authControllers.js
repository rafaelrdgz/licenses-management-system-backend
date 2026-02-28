import { config } from "dotenv";
import AuthServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Importa bcrypt directamente
import validateController from "../utils/validations/validateController.js";

config();
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.query;

    // Validate email and password
    await validateController('email', email);
    await validateController('password', password);
    
    const result = await AuthServices.loginWorker(email);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Verificar la contraseña utilizando bcrypt
      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al verificar la contraseña" });
        }

        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }

        // Generar un token JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: "5h" }
        );
        res.status(200).json({ token });
      });
    } else {
      res.status(404).json({ error: "Worker not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
