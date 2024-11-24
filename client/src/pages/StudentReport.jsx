import React, { Component } from "react";
import { getAllInternships } from "../store/actions";
import Admin_Sidenav from "../components/Admin_Sidenav";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import { MdFileDownload, MdSearch, MdExpandMore } from "react-icons/md";
import SideNav_f from "../components/SideNav_f";
class StudentReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [],
      count: null,
      csvData: [],
    };
  }
  async componentDidMount() {
    const { getAllInternships } = this.props;
    getAllInternships().then(() => this.loadData(this.props.internships));
  }

  //converts data to csv format as per the required format ref :- https://www.npmjs.com/package/react-csv
  loadData(internships) {
    this.setState({ internships: internships });
    this.setState({ count: internships.length });
    internships.forEach((internship) => {
      let csv = {};
      let date = new Date(internship.startDate);
      csv["StudentName"] = internship.firstname + " " + internship.lastname;
      csv["Workplace"] = internship.workplace;
      csv["StartDate"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      csv["Duration"] = internship.durationOfInternship;
      csv["Stipend"] = internship.stipend;
      csv["Status"] = internship.completionStatus;
      this.setState({ csvData: this.state.csvData.concat(csv) });
    });
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
          <td> {internship.stipend} dh/mois</td>
          <td>
            <span className={`text-${this.getStatusClass(internship.completionStatus)}`}>
              {internship.completionStatus}
            </span>
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
            <Admin_Sidenav activeComponent="7" />
          </div>
          <div className="col-sm-10 of">
            <div className="container-fluid mt-2">
              <h4>Rapport des Stages des étudiants</h4>
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
                      placeholder="Filtrer Stages"
                      onChange={this.filter}
                      aria-describedby="filtersearch"
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <CSVLink
                    data={this.state.csvData}
                    filename={"ApplicationsReport.csv"}
                    className="btn btn-primary btn-sm float-right"
                  >
                    <MdFileDownload style={{ margin: -2, padding: -2 }} />{" "}
                    Download Report
                  </CSVLink>
                </div>
              </div>
              <hr style={{ marginTop: -4 }} />
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>
                      Nom et prénom{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                      Entreprise{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                      Date Début{" "}
                      <MdExpandMore style={{ margin: -1, padding: -1 }} />
                    </th>
                    <th>
                      Durée Stage{" "} 
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
  }
)(StudentReport);
