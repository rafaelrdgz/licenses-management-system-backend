import { v4 } from "uuid";
import examsServices from "../services/examsServices.js";
import validateController from "../utils/validations/validateController.js";

export const createExam = async (req, res) => {
  try {
    const { type, result, entityCode, examinerName, personId } = req.body;
    console.log(type, result, entityCode, examinerName, personId);

    await validateController('type', type);
    await validateController('result', result);
    await validateController('entityCode', entityCode);
    await validateController('name', examinerName);
    await validateController('personId', personId);

    const r = await examsServices.createExam(
      v4(),
      type,
      new Date(),
      result,
      entityCode,
      examinerName,
      personId
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const result = await examsServices.getExams();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getExam = async (req, res) => {
  try {
    const result = await examsServices.getExam(req.params.id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Exam not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { type, date, result, entityCode, examinerName, personId } = req.body;
    console.log(type, date, result, entityCode, examinerName, personId);

    await validateController('type', type);
    await validateController('result', result);
    await validateController('entityCode', entityCode);
    await validateController('name', examinerName);
    await validateController('personId', personId);

    const r = await examsServices.updateExam(
      req.params.id,
      type,
      date,
      result,
      entityCode,
      examinerName,
      personId
    );
    console.log(r);
    res.status(200).json(r.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await examsServices.deleteExam(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting exam:", err);
    res.status(400).json({ error: err.message });
  }
};

export const chechExams = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await examsServices.checkExams(id);
    console.log(result.rows[0].examenes_aprobados);
    if (result.rows[0].examenes_aprobados === true) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking exams existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
