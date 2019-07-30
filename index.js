const express = require("express");

const server = express();

// Para que o server consiga entender arquivos json
server.use(express.json());

// Lista de Variaveis
let requestCount = 0;
const projects = [];

// Middleware local
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

// Middleware global
function numberOfRequests(req, res, next) {
  requestCount++;
  console.log("Ja foram efetuadas " + requestCount + " requisições");
  return next();
}
server.use(numberOfRequests);

// Rotas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };
  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(project);
});

// Porta que servidor ira escutar
server.listen(3000);
