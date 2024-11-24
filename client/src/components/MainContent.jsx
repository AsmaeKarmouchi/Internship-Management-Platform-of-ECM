import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getStudentInternships } from "../store/actions";
import { MdAccessTime, MdLocationCity, MdMailOutline, MdSearch, MdWork, MdPerson, MdSchool, MdAttachMoney } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa";

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [], // Initialize with an empty array
    };
  }

  componentDidMount() {
    const { getStudentInternships } = this.props;
    getStudentInternships().then(() => this.loadData(this.props.internships));
  }

  loadData(internships) {
    this.setState({ internships: internships });
  }

  filter(e) {
    var filter, cards, cardContent, i;
    filter = e.target.value.toUpperCase();
    cards = document.getElementsByClassName("outer-card");
    for (i = 0; i < cards.length; i++) {
      cardContent = cards[i].querySelector(".individual-card");
      if (cardContent && cardContent.innerText.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }

  render() {
    return (
      <Fragment>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="filtersearch">
              <MdSearch style={{ padding: -2, margin: -2 }} />{"  "} Search
            </span>
          </div>
          <input
            type="text"
            name="filter"
            id="filter"
            className="form-control"
            placeholder="Filter Internships"
            onChange={this.filter}
            aria-describedby="filtrer search "
          />
        </div>
        <hr />

        <div id="accordion">
          {this.state.internships.map((internship, index) => (
            <div key={internship.id} className="card mb-3">
              <div className="card-header bg-dark text-white" data-toggle="collapse" data-target={"#collapse" + internship.id}>
                <MdWork /> <strong>{internship.workplace}</strong> - {internship.internshipType}
                <span className="float-right">
                  <MdAccessTime /> {new Date(internship.startDate).toLocaleDateString()}
                </span>
              </div>

              <div id={"collapse" + internship.id} className="collapse" data-parent="#accordion">
                <div className="card-body">
                  <h5 className="card-title">
                    <MdPerson /> {internship.firstname} {internship.lastname} - <MdSchool /> {internship.year}/{internship.div}
                  </h5>
                  <p className="card-text">
                    <MdMailOutline /> {internship.emailId}
                    <br />
                    <MdLocationCity /> Entreprise: {internship.workplace}
                    <br />
                    <MdAttachMoney /> Rémunération: {internship.stipend ? ` ${internship.stipend} Dh/mois` : "Not provided"}
                    <br />
                    <FaRegFilePdf /> Fichier: {internship.files} {internship.files && internship.files.length > 0 ? 'Available' : 'None'}
                  </p>
                  {/* Additional details */}
                  <p><strong>Commentaire:</strong> {internship.comments || "Pas de commentaire additionnel"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default connect(
  (store) => ({
    auth: store.auth,
    internships: store.internships,
  }),
  { getStudentInternships }
)(MainContent);