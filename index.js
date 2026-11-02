const express = require('express');
const app = express();
const PORT = 3000;

// JSON body parser middleware
app.use(express.json());

//Custom logging middleware (runs on EVERY request)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// In-memory data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const courses = [
  { id: 1, title: 'Intro to Express' },
  { id: 2, title: 'Advanced Node.js' },
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

// Additional pages
app.get('/about', (req, res) => {
  res.send('This is the About page for our Express app.');
});

app.get('/contact', (req, res) => {
  res.send('Contact us at hello@example.com');
});

// GET /users returns JSON list
app.get('/users', (req, res) => {
  res.json(users);
});

// Route parameter /users/:id
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `You requested user with ID: ${id}`, id });
});

// Query parameter /search?name=...
app.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Please provide a name query parameter, e.g. /search?name=alice' });
  }
  res.json({ message: `Search results for: ${name}`, name });
});

// POST /users accepts JSON body
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const newUser = { id: users.length + 1, name, age };
  users.push(newUser);
  res.status(201).json({ message: 'User received successfully', user: newUser });
});

// Challenge: Courses API
app.get('/courses', (req, res) => {
  res.json(courses);
});

app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.post('/courses', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const newCourse = { id: courses.length + 1, title };
  courses.push(newCourse);
  res.status(201).json({ message: 'Course added', course: newCourse });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});