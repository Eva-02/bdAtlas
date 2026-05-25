const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existingAdmin) {
    console.log('Admin inicial ya existe');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: 'Admin inicial',
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: 'admin',
  });
  console.log('Admin inicial creado con éxito');
};

module.exports = seedAdmin;
