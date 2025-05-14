const Contact = require('../models/Contact');

// @desc    Obtener todos los contactos
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    // Obtener todos los contactos en lugar de filtrar por usuario actual
    const contacts = await Contact.find()
      .populate('user', 'name email'); // Incluir los detalles del usuario que creó el contacto
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Crear un nuevo contacto
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  try {
    const { name, company, phone, email, address, notes, status } = req.body;

    const contact = await Contact.create({
      user: req.user._id,
      name,
      company,
      phone,
      email,
      address,
      notes,
      status
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener un contacto por ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Verificar que el contacto pertenece al usuario
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Actualizar un contacto
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    const { name, company, phone, email, address, notes, status } = req.body;

    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Verificar que el contacto pertenece al usuario
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, company, phone, email, address, notes, status },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Eliminar un contacto
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Verificar que el contacto pertenece al usuario
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contacto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact
};