import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getApprovedInternships } from "../store/actions";
import { MdSearch } from "react-icons/md";
import SideNav_f from "../components/SideNav_f";

class ApprovedInternships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [],
      searchTerm: '',
    };
  }

  componentDidMount() {
    this.props.getApprovedInternships().then(() => {
      this.loadData(this.props.internships);
    });
  }

  loadData(internships) {
    this.setState({ internships });
  }

  handleSearch = (event) => {
    this.setState({ searchTerm: event.target.value.toUpperCase() });
  }

  renderInternships() {
    return this.state.internships
      .filter(internship => 
        internship.firstname.toUpperCase().includes(this.state.searchTerm) ||
        internship.lastname.toUpperCase().includes(this.state.searchTerm) ||
        internship.workplace.toUpperCase().includes(this.state.searchTerm))
      .map((internship, index) => (
        <tr key={index}>
          <td>{internship.firstname} {internship.lastname}</td>
          <td>{internship.workplace}</td>
          <td>{new Date(internship.startDate).toLocaleDateString()}</td>
          <td>{internship.durationOfInternship}</td>
          <td>{internship.stipend}</td>
          <td style={{ color: internship.completionStatus === "Approved" ? "#68FF2B" : "inherit" }}>
            {internship.completionStatus}
          </td>
        </tr>
      ));
  }

  render() {
    return (
      <Fragment>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <SideNav_f activeComponent="3" />
          </div>
          <div className="col-sm-10 of">
            <div className="container-fluid">
              <h2 className="mt-4">Stages approuvés</h2>
              <p className="text-muted mb-4"> liste de tous les stages approuvés pour nos étudiants.</p>
              
              <div className="input-group mb-4">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="filtersearch"><MdSearch /></span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par nom ou lieu de travail"
                  onChange={this.handleSearch}
                  aria-describedby="filtersearch"
                />
              </div>

              <table className="table table-striped">
                <thead>
                  <tr>
                  <th>Nom</th>
                  <th>Lieu de travail</th>
                  <th>Date de début</th>
                  <th>Durée</th>
                  <th>Stipend</th>
                  <th>Statut</th>

                  </tr>
                </thead>
                <tbody>
                  {this.renderInternships()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  (store) => ({
    internships: store.internships,
  }),
  { getApprovedInternships }
)(ApprovedInternships);
