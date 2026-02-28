import { v4 } from "uuid";
import transporter from "../configs/emailTransporterConfig.js";
import EntitiesServices from "../services/entitiesServices.js";
import { entityReport } from "../utils/createPdf.js";
import validateController from '../utils/validations/validateController.js';

export const createEntity = async (req, res) => {
  try {
    const { name, address, phone, directorName, email, type } = req.body;
    console.log(name, address, phone, directorName, email, type);
    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phone);
    await validateController('name', directorName);
    await validateController('email', email);
    const result = await EntitiesServices.createEntity(
      v4(),
      name,
      type,
      address,
      phone,
      email,
      directorName
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getEntities = async (req, res) => {
  try {
    const result = await EntitiesServices.getEntities();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const existsEntity = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await EntitiesServices.getEntityById(id);

    if (result.rowCount > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking entity existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEntity = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await EntitiesServices.getEntityById(id);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Entity not found" });
    }
  } catch (err) {
    console.error("Error checking entity existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEntity = async (req, res) => {
  try {
    const { name, address, phone, directorName, email, type } = req.body;
    console.log(name, address, phone, directorName, email, type);
    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phone);
    await validateController('name', directorName);
    await validateController('email', email);
    const result = await EntitiesServices.updateEntity(
      req.params.id,
      name,
      type,
      address,
      phone,
      email,
      directorName
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEntity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await EntitiesServices.deleteEntity(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Entity not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting entity:", err);
    res.status(400).json({ error: err.message });
  }
};

export const sendEntityReport = async (req, res) => {
  try {
    const { info } = req.body;
    const email = req.user.email; // Obtiene el email del payload del token

    // Generar el PDF en memoria
    const doc = entityReport(info);

    // Guardar el PDF en un buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer")); // Convertir ArrayBuffer a Buffer

    // Enviar el PDF por correo electrónico
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Ficha de Entidad Asociada",
      text: "Adjunto encontrarás la ficha de entidad solicitada.",
      attachments: [
        {
          filename: "Ficha_de_Entidad.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`PDF enviado a ${email}`);

    // Responder con el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Ficha_de_Entidad.pdf"'
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("Error al generar o enviar el PDF:", err);
    res.status(500).send({ message: "Error al generar el PDF" });
  }
};
