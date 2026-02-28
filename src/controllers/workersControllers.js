import WorkersServices from "../services/workersServices.js";
import validateController from "../utils/validations/validateController.js";

export const createWorker = async (req, res) => {
  try {
    const { id, name, email, lastNames, password, role } = req.body;
    console.log(name, email, lastNames, password, role);

    await validateController('name', name);
    await validateController('email', email);
    await validateController('password', password);
    // Add other validations as needed

    const result = await WorkersServices.createWorker(
      id,
      name,
      lastNames,
      email,
      password,
      role
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const result = await WorkersServices.getWorkers();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWorker = async (req, res) => {
  try {
    const result = await WorkersServices.getWorkerByID(req.params.id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Worker not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { id, name, lastNames, email, password, role } = req.body;
    console.log(id, name, lastNames, email, password, role);

    await validateController('name', name);
    await validateController('email', email);
    await validateController('password', password);
    // Add other validations as needed

    const result = await WorkersServices.updateWorker(
      id,
      name,
      lastNames,
      email,
      password,
      role
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await WorkersServices.deleteWorker(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Worker not found" });
    }
    console.log(result);
    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting worker:", err);
    res.status(400).json({ error: err.message });
  }
};

export const existsWorker = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await WorkersServices.getWorkerByID(id);

    if (result.rowCount > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking worker existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
