import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getAllInternships, updateInternship } from "../store/actions";
import { CSVLink } from "react-csv";
import { MdFileDownload, MdSearch, MdExpandMore } from "react-icons/md";
import SideNav_f from "../components/SideNav_f";

class Internships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [],
      count: null,
      csvData: [],
    };
  }

  componentDidMount() {
    this.props.getAllInternships().then(() => this.loadData(this.props.internships));
  }

  loadData(internships) {
    this.setState({ internships, count: internships.length });
    this.prepareCSVData(internships);
  }

  prepareCSVData(internships) {
    const csvData = internships.map(internship => {
      let date = new Date(internship.startDate);
      return {
        StudentName: internship.firstname + " " + internship.lastname,
        Workplace: internship.workplace,
        StartDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        Duration: internship.durationOfInternship,
        Stipend: internship.stipend,
        Status: internship.completionStatus,
      };
    });
    this.setState({ csvData });
  }

  handleStatusChange = (internshipId, newStatus) => {
    const updatedInternship = this.state.internships.find(i => i.id === internshipId);
    if (updatedInternship) {
      const updatedDetails = { ...updatedInternship, completionStatus: newStatus };
      this.props.updateInternship(updatedDetails).then(() => {
        this.loadData([...this.state.internships.map(i => i.id === internshipId ? updatedDetails : i)]);
      });
    }
  }

  renderRows() {
    return this.state.internships.map((internship, index) => {
      let date = new Date(internship.startDate);
      return (
        <tr key={index} className="application">
          <td>{internship.firstname + " " + internship.lastname}</td>
          <td>{internship.workplace}</td>
          <td>{date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()}</td>
          <td>{internship.durationOfInternship} mois</td>
          <td>{internship.stipend} dh/mois</td>
          <td>
            <span className={`text-${this.getStatusClass(internship.completionStatus)}`}>
              {internship.completionStatus}
            </span>
          </td>
          <td>
            <select
              value={internship.completionStatus}
              onChange={(e) => this.handleStatusChange(internship.id, e.target.value)}
              className="form-control">
              <option value="Pending">En attente</option>
              <option value="Approved">Approuvé</option>
              <option value="Rejected">Rejeté</option>
            </select>
          </td>
        </tr>
      );
    });
  }
  getStatusClass(status) {
    switch(status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'warning';
    }
  }
  filter(e) {
    var filter, cards, i;
    filter = e.target.value.toUpperCase();
    cards = document.getElementsByClassName("application");
    for (i = 0; i < cards.length; i++) {
      if (cards[i].innerText.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
  render() {
    return (
      <div>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <SideNav_f activeComponent="2" />
          </div>
          <div className="col-sm-10 of">
            <div className="container-fluid mt-2">
              <h4>Rapport de stage des étudiants</h4>
              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <strong>Total Applications: {this.state.count} </strong>
                </div>
                <div className="col-sm-5 offset-2">
                  <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                      >
                        <MdSearch />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="filter"
                      id="filter"
                      className="form-control"
                      placeholder="Filtrer les stages"
                      onChange={this.filter}
                      aria-describedby="filtersearch"
                    />
                  </div>
                </div>

              </div>
              <hr style={{ marginTop: -4 }} />
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>
                      Nom
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                    Lieu de travail{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                    Date de début{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                    Durée{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                    Rémunération{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                    Statut{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                      Modifier_le_Statut{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                  </tr>
                </thead>
                <tbody className="applicationstable">{this.renderRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (store) => ({
    internships: store.internships,
  }),
  {
    getAllInternships,
    updateInternship,
  }
)(Internships);
