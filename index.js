const app = require('./app');
const connectDatabase = require('./config/database');
require('dotenv').config({ path: './.env' });

const startServer = async () => {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || 4000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });

    server.on('error', (error) => {
      console.log(`Server error: ${error}`);
      process.exit(1);
    });
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();
