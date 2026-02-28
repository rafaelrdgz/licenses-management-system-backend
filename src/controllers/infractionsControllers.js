import { v4 } from "uuid";
import InfractionsServices from "../services/infractionsServices.js";
import validateController from "../utils/validations/validateController.js";

export const createInfraction = async (req, res) => {
  try {
    const { licenseid, type, address, description, pointsDeducted, paid } =
      req.body;
    console.log(licenseid, type, address, description, pointsDeducted, paid);

    await validateController('license', licenseid);
    await validateController('address', address);
    await validateController('points', pointsDeducted);

    const date = new Date();
    const result = await InfractionsServices.createInfraction(
      v4(),
      licenseid,
      type,
      date,
      address,
      description,
      pointsDeducted,
      paid
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getInfractions = async (req, res) => {
  try {
    const result = await InfractionsServices.getInfractions();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getInfraction = async (req, res) => {
  try {
    const result = await InfractionsServices.getInfraction(req.params.id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Infraction not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateInfraction = async (req, res) => {
  try {
    const {
      licenseid,
      type,
      date,
      address,
      description,
      pointsDeducted,
      paid,
    } = req.body;
    console.log(
      licenseid,
      type,
      date,
      address,
      description,
      pointsDeducted,
      paid
    );

    await validateController('license', licenseid);
    await validateController('type', type);
    await validateController('date', date);
    await validateController('address', address);
    await validateController('description', description);
    await validateController('points', pointsDeducted);
    await validateController('paid', paid);

    const result = await InfractionsServices.updateInfraction(
      req.params.id,
      licenseid,
      type,
      date,
      address,
      description,
      pointsDeducted,
      paid
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteInfraction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await InfractionsServices.deleteInfraction(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Infraction not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting infraction:", err);
    res.status(400).json({ error: err.message });
  }
};
