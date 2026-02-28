import ClientsServices from "../services/clientsServices.js";
import validateController from "../utils/validations/validateController.js";

export const createClient = async (req, res) => {
  try {
    const { id, name, address, phoneNumber, email, lastNames, bornDate } =
      req.body;
    console.log(name, address, phoneNumber, email, lastNames, bornDate);

    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phoneNumber);
    await validateController('email', email);

    const result = await ClientsServices.createClient(
      id,
      name,
      lastNames,
      bornDate,
      address,
      phoneNumber,
      email
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const result = await ClientsServices.getClients();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const existClient = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await ClientsServices.getClientById(id);

    if (result.rowCount > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking person existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getClientById = async (req, res) => {
  try {
    const result = await ClientsServices.getClientById(req.params.id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { name, address, phoneNumber, email, lastNames, bornDate } = req.body;
    console.log(name, address, phoneNumber, email, lastNames, bornDate);

    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phoneNumber);
    await validateController('email', email);

    const result = await ClientsServices.updateClient(
      req.params.id,
      name,
      lastNames,
      bornDate,
      address,
      phoneNumber,
      email
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await ClientsServices.deleteClient(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(400).json({ error: err.message });
  }
};
