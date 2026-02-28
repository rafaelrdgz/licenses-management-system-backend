import { customAlphabet } from "nanoid";
import LicensesServices from "../services/licensesServices.js";
import validateController from "../utils/validations/validateController.js";

export const createLicense = async (req, res) => {
  try {
    const { driverId, category, restrictions } = req.body;
    
    await validateController('personId', driverId);
    await validateController('name', category);
    await validateController('points', restrictions);

    const issueDate = new Date();
    const expirationDate = new Date(
      issueDate.getFullYear() + 20,
      issueDate.getMonth(), // Mes debe ser el mismo
      issueDate.getDate() // Usar getDate() para el día del mes
    );

    const nanoid = customAlphabet("0123456789", 6);

    console.log(driverId, category, restrictions, issueDate, expirationDate);
    const result = await LicensesServices.createLicense(
      nanoid(),
      driverId,
      issueDate,
      expirationDate,
      restrictions,
      category
    );
    res.status(201).json(result.rows[0]);
    console.log(expirationDate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const existsLicense = async (req, res) => {
  try {
    const { id } = req.params;
    await validateController('license', id);
    console.log(id);
    const result = await LicensesServices.getLicenseById(id);

    if (result.rowCount > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking license existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLicenses = async (req, res) => {
  try {
    const result = await LicensesServices.getLicenses();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLicense = async (req, res) => {
  try {
    const { id } = req.params;
    await validateController('license', id);
    const result = await LicensesServices.getLicenseById(id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "License not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMissingCategories = async (req, res) => {
  try {
    const { id } = req.params;
    await validateController('license', id);
    const result = await LicensesServices.getMissingCategories(id);
    res.status(200).json(result.rows[0].get_missing_categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateLicense = async (req, res) => {
  try {
    const { expirationDate, restrictions, renewed, points } = req.body;

    await validateController('date', expirationDate);
    await validateController('points', restrictions);
    await validateController('boolean', renewed);
    await validateController('points', points);

    console.log(expirationDate, restrictions, renewed, points);

    const result = await LicensesServices.updateLicense(
      req.params.id,
      expirationDate,
      restrictions,
      renewed,
      points
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addLicenseCategory = async (req, res) => {
  try {
    const { expirationDate, restrictions, renewed, points, category } = req.body;

    await validateController('date', expirationDate);
    await validateController('points', restrictions);
    await validateController('boolean', renewed);
    await validateController('points', points);
    await validateController('name', category);

    console.log(expirationDate, restrictions, renewed, points, category);

    const result = await LicensesServices.addLicenseCategory(
      req.params.id,
      expirationDate,
      restrictions,
      renewed,
      points,
      category
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLicense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    await validateController('license', id);

    const result = await LicensesServices.deleteLicense(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "License not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting license:", err);
    res.status(400).json({ error: err.message });
  }
};
