import express from 'express';

const app = express();
const PORT = process.env.FINAZ_API_PORT || 3001;

// Middleware
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
