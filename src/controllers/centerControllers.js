import CenterServices from "../services/centerServices.js";
import transporter from "../configs/emailTransporterConfig.js";
import { centerReport as centerReportPdf } from "../utils/createPdf.js";
import validateController from "../utils/validations/validateController.js";

export const getCenter = async (req, res) => {
  try {
    const result = await CenterServices.getCenter();
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Center not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCenter = async (req, res) => {
  try {
    const {
      code,
      name,
      address,
      phone,
      directorName,
      humanResourcesName,
      accountantName,
      syndicateSecretaryName,
    } = req.body;

    // Validate inputs
    await validateController('entityCode', code);
    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phone);
    await validateController('name', directorName);
    await validateController('name', humanResourcesName);
    await validateController('name', accountantName);
    await validateController('name', syndicateSecretaryName);

    const response = await CenterServices.updateCenter(
      code,
      name,
      address,
      phone,
      directorName,
      humanResourcesName,
      accountantName,
      syndicateSecretaryName
    );
    res.json({
      message: "Centro actualizado exitosamente",
      response: response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando el centro" });
  }
};

export const centerReport = async (req, res) => {
  try {
    const { info } = req.body;
    const email = req.user.email; // Obtiene el email del payload del token

    // Generar el PDF en memoria
    const doc = centerReportPdf(info);

    // Guardar el PDF en un buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer")); // Convertir ArrayBuffer a Buffer

    // Enviar el PDF por correo electrónico
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Ficha del centro",
      text: "Adjunto encontrarás la ficha del centro solicitada.",
      attachments: [
        {
          filename: "Ficha_de_Centro.pdf",
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
      'attachment; filename="Ficha_de_Centro.pdf"'
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("Error al generar o enviar el PDF:", err);
    res.status(500).send({ message: "Error al generar el PDF" });
  }
};
