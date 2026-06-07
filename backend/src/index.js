const express = require('express');
const corsMiddleware = require('./middleware/cors');
const categoryRoutes = require('./routes/categories');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(corsMiddleware);

app.use('/api/categories', categoryRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
