import React, { Component } from "react";
import { createNotice } from "../store/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class NoticeForm extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    let data = {};
    for (var [key, value] of formData.entries()) {
      data[key] = value;
    }
    const { createNotice } = this.props;
    createNotice(data).then(() => {
      this.props.history.push("/facultyNotices");
    });
  }
  render() {
    return (
      <>
        <h4 className="mt-2">Nouvelle opportunité de stage : </h4>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="form-row my-2">
            <div className="col-sm-12">
              Sujet:
              <input
                type="text"
                name="subject"
                id="subject"
                placeholder="Titre..."
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="form-row my-2">
            <div className="col-sm-12">
              Description:
              <textarea
                name="description"
                id="description"
                rows="3"
                placeholder="Entrez la description pour le stage..."
                className="form-control"
                required
              ></textarea>
            </div>
          </div>
          <div className="form-row my-2">
            <div className="col-sm-4">
            Lieu de travail:
              <input
                type="text"
                name="workplace"
                id="workplace"
                placeholder="Google"
                className="form-control"
              />
            </div>
            <div className="col-sm-4">
              Location:
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Travail à domicile"
                className="form-control"
              />
            </div>
            <div className="col-sm-4">
              Designation:
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="Software Developer"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row my-2">
            <div className="col-sm-12">
            Prérequis/Exigences :
              <input
                type="text"
                name="requirements"
                id="requirements"
                placeholder="Python, Tensorflow, ..."
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row my-2">
            <div className="col-sm-4">
              Domaine:
              <input
                type="text"
                name="domain"
                id="domain"
                placeholder="Machine Learning"
                className="form-control"
              />
            </div>
            <div className="col-sm-3">
              Durée:
              <div className="input-group">
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  placeholder="1"
                  className="form-control"
                />
                <div className="input-group-append">
                  <span className="input-group-text">mois</span>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              Rémunération:
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroupPrependRs">
                    DH.{" "}
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  id="stipend"
                  name="stipend"
                  placeholder="10000"
                  aria-describedby="inputGroupPrependRs"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">mois</span>
                </div>
              </div>
            </div>

            <div className="col-sm-2">
              Positions:
              <input
                type="number"
                name="positions"
                id="positions"
                placeholder="3"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row my-2"></div>
          <div className="form-row my-2">
            <div className="col-sm-4">
              Email:
              <input
                type="email"
                name="emailId"
                id="emailId"
                placeholder="exemple@gmail.com"
                className="form-control"
              />
            </div>
            <div className="col-sm-4">
              Contact:
              <input
                type="tel"
                name="contact"
                id="contact"
                placeholder="+212600000000"
                className="form-control"
              />
            </div>
            <div className="col-sm-4">
              Lien:
              <input
                type="url"
                name="link"
                id="link"
                placeholder="https://exemple.com/exempledeForm"
                className="form-control"
              />
            </div>
          </div>
          <hr />
          <div className="text-right">
            <button className="btn border-dark mx-2" type="reset">
            Réinitialiser
            </button>
            <button type="submit" className="btn btn-dark">
            Soumettre
            </button>
          </div>
        </form>
      </>
    );
  }
}
export default withRouter(
  connect(
    (store) => ({
      auth: store.auth,
      notices: store.notices,
    }),
    { createNotice }
  )(NoticeForm)
);
