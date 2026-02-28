import DriversServices from "../services/driversServices.js";
import validateController from "../utils/validations/validateController.js";

export const getDrivers = async (req, res) => {
  try {
    const result = await DriversServices.getDrivers();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const existsDriver = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await DriversServices.getDriverByID(id);

    if (result.rowCount > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking driver existence:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDriver = async (req, res) => {
  try {
    const result = await DriversServices.getDriverByID(req.params.id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Driver not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const {
      name,
      address,
      phoneNumber,
      email,
      lastNames,
      bornDate,
      licenseStatus,
    } = req.body;

    await validateController('name', name);
    await validateController('address', address);
    await validateController('phone', phoneNumber);
    await validateController('email', email);
    await validateController('name', lastNames);
    await validateController('license', licenseStatus);

    console.log(
      name,
      address,
      phoneNumber,
      email,
      lastNames,
      bornDate,
      licenseStatus
    );
    const result = await DriversServices.updateDriver(
      req.params.id,
      name,
      lastNames,
      bornDate,
      address,
      phoneNumber,
      email,
      licenseStatus
    );
    console.log(result);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await DriversServices.deleteDriver(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (err) {
    console.error("Error deleting driver:", err);
    res.status(400).json({ error: err.message });
  }
};
