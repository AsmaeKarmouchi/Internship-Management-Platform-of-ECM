require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4002; // Port par défaut si PORT n'est pas défini dans le .env
const connectionString = process.env.DATABASE; // Utilisez la variable d'environnement DATABASE pour la connexion à la base de données

const pool = new Pool({
  connectionString: connectionString,
});

// Vérification de la connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// Vos routes existantes
app.get("/", (req, res) => res.json({ hello: "World" }));
app.use("/api/auth", routes.auth);
app.use("/api/internships", routes.internships);
app.use("/api/admin", routes.admin);
app.use("/api/notices", routes.notices);
app.use("/api/faculty", routes.Faculty);

// Gestion des erreurs
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, console.log(`Serveur démarré sur le port ${port}`));

