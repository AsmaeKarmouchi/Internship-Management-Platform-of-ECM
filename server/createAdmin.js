const db = require('./models'); // Assurez-vous que ce chemin est correct pour votre structure de projet
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//copier createAdmin idi pour creer admin une seul fois dans index.js si cela ne marche pas
async function createAdmin() {

  try {

  // Vérifier d'abord si un administrateur existe déjà
  const existingAdmin = await db.Faculty.findOne({ where: { designation: "Admin" } });
  if (existingAdmin) {
    throw new Error('Un administrateur existe déjà.');
  }
  
  // Hasher le mot de passe avant de le sauvegarder
  //const hashedPassword = await bcrypt.hash('1999', 10);


    // Créer un nouvel administrateur
    const admin = await db.Faculty.create({
      firstname: 'Profile',
      lastname: 'Admin',
      year: null, // ou la valeur appropriée si nécessaire
      div: null,  // ou la valeur appropriée si nécessaire
      emailId: 'admin@gmail.com',
      department: 'Administration', // ou le département approprié
      username: 'Administrator',
      password: '0000', // Ceci sera haché par le hook beforeCreate
      designation: 'Admin', // C'est la désignation pour l'administrateur
    });

    console.log('Admin créé avec succès');
    return admin;
  } catch (err) {
    console.error('Erreur lors de la création de l\'admin:', err);
  }
}

createAdmin().then((admin) => {
  if (admin) {
    console.log('Administrateur créé:', admin);
  }
}).catch((error) => {
  console.error('Erreur lors de la création de l\'administrateur:', error);
});
