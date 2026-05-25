const mongoose = require('mongoose');

const connectDB = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Falta la variable MONGODB_URI en .env');
    process.exit(1);
  }

  mongoose.set('strictQuery', false);
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((error) => {
      console.error('Error conectando a MongoDB Atlas:', error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
