const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", validateID);
app.use("/repositories/:id/like", validateID);

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  if (repositories.length === 0) {
    return response.status(200).json({ repos: "Repository list empty." });
  }

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  // get data structure
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;

  // get the desired updated data
  const { title, url, techs } = request.body;

  //find the index based in the parameter ID
  const index = repositories.findIndex(repo => repo.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  const updateRepository = {
    id,
    title,
    url,
    techs,
    likes:repositories[index].likes
  }

  repositories[index] = updateRepository;

  return response.json(updateRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //find the index based in the parameter ID
  const index = repositories.findIndex(repo => repo.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //find the index based in the parameter ID
  const index = repositories.findIndex(repo => repo.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  repositories[index].likes++;

  return response.json(repositories[index]);
});

//----------------------
function validateID(request, response, next) {

  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
}
//-----------------------

module.exports = app;
