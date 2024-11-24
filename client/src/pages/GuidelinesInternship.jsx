import React, { Component } from "react";
import Sidenav from "../components/Sidenav";

class GuidelinesInternship extends Component {
  state = {};

  render() {
    return (
      <div className="row no-gutters">
        <div className="col-sm-2 sidenav">
          <Sidenav activeComponent="7" />
        </div>
        <div className="col-sm-10 of">
          <div className="container-fluid">
            <div class="alert alert-light" role="alert">
             {/* des modifications */}  
            
          
           <hr /> 
              <h4 style={{ color: "#000" }} class="alert-heading">
              Directives de stage pour les étudiants
              </h4>
              <a style={{ color: "#000", fontSize: "18px" }}>
              Un stage est une excellente opportunité d'apprendre dans un environnement informatique sans être employé par une entreprise.
               Les étudiants sont conseillés de définir leurs objectifs avant le début de leur stage et 
               de se concentrer sur leur réalisation pendant celui-ci{" "}
              </a>
              <hr />
              <h4 style={{ color: "#000" }} class="alert-heading">
              Voici les lignes directrices pour les stages pour les étudiants {" "}
              </h4>

              <ol style={{ marginLeft: "18px" }}>
                <li style={{ color: "#000", fontSize: "18px" }}>
                Le stage peut être à temps plein ou à temps partiel.
                </li>
                <li style={{ color: "#000", fontSize: "18px" }}>
                  Internship may be paid or unpaid.
                </li>
                <li style={{ color: "#000", fontSize: "18px" }}>
                La durée du stage varie en fonction du semestre :
                  <ul>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>
                    Maximum de 6 mois : pour les étudiants de premier cycle après le 5ème semestre.
                    </li>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>
                    Maximum de 2,5 mois : pour les étudiants de premier cycle après les 2ème et 4ème semestres.
                    </li>
                  </ul>
                </li>
                <li style={{ color: "#f44336", fontSize: "18px" }}>
                  <strong>
                    {" "}
                    Autorisation pour le stage :
Aucun étudiant ne pourra effectuer de stage sans l'autorisation préalable de l'école
                  </strong>
                </li>
                <li style={{ color: "#f44336", fontSize: "18px" }}>
                  <strong>
                    {" "}
                    Certificat de fin de stage :
À la fin du stage, un certificat de réalisation devra être téléchargé sur le portail de l'école.
                  </strong>
                </li>
                <li style={{ color: "#000", fontSize: "18px" }}>
                Critères d'éligibilité :
                  <ul>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>
                    Présence minimale de 75 % obligatoire.
                    </li>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>
                    Moyenne cumulative supérieure à 12 dans les années consécutives précédentes.
                    </li>
                  </ul>
                </li>
                <li style={{ color: "#000", fontSize: "18px" }}>
                Conduite pendant le stage :
                  <ul>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>             
                    Les stagiaires doivent faire preuve de ponctualité et de volonté d'apprendre pendant la période de stage.
                    </li>
                    <li style={{ marginLeft: "15px", fontSize: "18px" }}>
                    Ils doivent respecter les politiques, règles et réglementations de l'entreprise ou de l'école.                    </li>
                  </ul>
                </li>
                <li style={{ color: "#000", fontSize: "18px" }}>
                  {" "}
                  Horaire de stage :
Le stagiaire doit respecter l'horaire de stage déterminé par l'école.{" "}
                </li>
          
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuidelinesInternship;
