const app = require('./app');
const connectDB = require('./config/database');
const { PORT } = require('./config/constants');

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server Running]: Orkestrim API live at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`[Server Start Error]: ${err.message}`);
  }
};

startServer();
