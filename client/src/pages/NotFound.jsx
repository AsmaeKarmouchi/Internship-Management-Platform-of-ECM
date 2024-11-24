import React, { Component } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
class NotFoundPage extends Component {
  state = {};
  handleClick() {
    window.history.back();
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="jumbotron mt-5 text-center bg-secondary text-white">
          <h1 className="display-3 my-5">404, Introuvable</h1>
          <hr />
          Désolé, la page demandée est introuvable. Veuillez vous assurer que l'URL que vous avez saisie est correcte.
          <hr />
          <button className="btn btn-dark" onClick={this.handleClick}>
            <span className="mr-2">
              <MdKeyboardBackspace
                style={{ margin: -1, padding: -1 }}
                color="white"
              ></MdKeyboardBackspace>
            </span>
            Click here to go back
          </button>
        </div>
        <p>SI_project</p>
      </div>
    );
  }
}

export default NotFoundPage;
