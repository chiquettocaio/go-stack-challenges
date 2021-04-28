const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

/* Config */
const app = express();
app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateExistingRepo)

/* Vars */
const repositories = [];

/* Middlewares */
function validateExistingRepo (req, res, next) {
  const { id } = req.params
  const repo = repositories.find(r => r.id === id)

  if (!repo) {
    return res
      .status(400)
      .json({ error: 'Repository not found' })
  }

  return next()
}

function repoHasRequiredInformation (req, res, next) {
  const { title, url, techs } = req.body

  if (!title || !url || !techs || !Array.isArray(techs) || !techs.length) {
    return res
      .status(400)
      .json({ error: 'New repositories must have title, url and at least one tech' })
  }

  return next()
}

/* Routes */
app.get("/repositories", (request, response) => {
  return response
    .status(200)
    .json(repositories)
});

app.post("/repositories", repoHasRequiredInformation, (request, response) => {
  const { title, url, techs } = request.body

  const repo = { id: v4(), title, url, techs, likes: 0 }
  repositories.push(repo)

  return response
    .status(201)
    .json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  let repo = repositories.find(r => r.id === id)
  repo.title = title || repo.title
  repo.url = url || repo.url
  repo.techs = techs || repo.techs

  return response
    .status(200)
    .json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(r => r.id === id)
  repositories.splice(repoIndex, 1)

  return response
    .status(204)
    .send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repo = repositories.find(r => r.id === id)
  repo.likes++

  return response
    .status(200)
    .json(repo)
});

module.exports = app;