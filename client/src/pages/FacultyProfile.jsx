import React, { Component } from "react";
import Sidenav_f from "../components/SideNav_f";
import { getFacultyProfile } from "../store/actions/faculty";
import { updateFaculty } from "../store/actions/faculty";
import { connect } from "react-redux";
class FacultyProfile extends Component {
  state = {
    isLoading: true,
    data: {
      name: {
        firstname: "firstname",
        lastname: "lastname",
      },
      currentClass: {
        year: "2015",
        div: "2",
      },
      
      emailId: "example@gmail.com",
      username:'username123',
      department:'GL',
      designation: "Coordinator",
    },
  };
  async componentDidMount() {
    const { getFacultyProfile } = this.props;
    
    getFacultyProfile()
      .then(console.log(this.props))
      .then(this.setState({ isLoading: false }))
      .then(() => this.loadData(this.props.faculty));
      return <div>Loading...</div>;  
  }
  loadData(user) {
    if (user.designation !== undefined) this.setState({ data: user });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { updateFaculty } = this.props;
    var formData = new FormData(event.target);
    const updatedata = {};
    updatedata["name"] ={
      firstname: formData.get("firstname") || this.state.data.name.firstname,
      lastname: formData.get("lastname") || this.state.data.name.lastname,
    };
    updatedata["currentClass"] ={
      year: formData.get("year") || this.state.data.currentClass.year,
     div: formData.get("div") || this.state.data.currentClass.div,
    };
    updatedata["department"] =
      formData.get("department") || this.state.data.department;
    updatedata["designation"] =
      formData.get("designation") || this.state.data.designation;
    updatedata["username"] =
      formData.get("username") || this.state.data.username;
    updatedata["emailId"] = formData.get("emailId") || this.state.data.emailId;

    updateFaculty(updatedata);
    window.location.reload(false);
  }
  editform() {
    var form = document.getElementById("form");
    var elements = form.elements;
    for (var i = 0, len = elements.length - 3; i < len; ++i) {
      elements[i].readOnly = !elements[i].readOnly;
    }
    elements[elements.length - 4].disabled =
      !elements[elements.length - 4].disabled;

    var updateButton = document.getElementById("updateBtn");
    updateButton.disabled = !updateButton.disabled;

    var editButton = document.getElementById("editButton");
    editButton.classList.toggle("btn-danger");
    editButton.innerHTML = editButton.innerHTML === "Edit" ? "Cancel" : "Edit";
  }
  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    } else if (this.state.error) {
      return <div>Error loading profile. Please try again later.</div>;
    }
    
    
    return (
      <div>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <Sidenav_f activeComponent="1" />
          </div>
          <div className="col-sm-10 of">
            <div className="container-fluid">
              <h4 className="mt-2">My Profile</h4>
              <hr />
              {
                <form id="form" onSubmit={this.handleSubmit}>
                  Fill in the details:
                  <hr />
                  <div className="container-fluid">
                    <div className="form-row my-2">
                      <div className="col-sm-6">
                        Prénom:
                        <input
                          readOnly
                          type="text"
                          name="firstname"
                          id="firstname"
                          className="form-control"
                          placeholder={this.state.data.name.firstname}
                        />
                      </div>
                      <div className="col-sm-6">
                        Nom:
                        <input
                          readOnly
                          type="text"
                          name="lastname"
                          id="lastname"
                          placeholder={this.state.data.name.lastname}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-row my-2">
                      <div className="col-sm-6">
                        Date Embauche:
                        <input
                          readOnly
                          type="number"
                          className="form-control"
                          id="year"
                          name="year"
                          placeholder={this.state.data.currentClass.year}
                        />
                      </div>
                      <div className="col-sm-6">
                         Division:
                        <div className="input-group">
                          <input
                            readOnly
                            type="number"
                            name="div"
                            id="div"
                            placeholder={this.state.data.currentClass.div}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row my-2">
                      <div className="col-sm-6">
                        emailId:
                        <div className="input-group">
                          <input
                            readOnly
                            type="text"
                            name="emailId"
                            id="emailId"
                            placeholder={this.state.data.emailId}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        Departement:
                        <input
                          readOnly
                          type="text"
                          name="department"
                          id="department"
                          placeholder={this.state.data.department}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-row my-2">
                      <div className="col-sm-6">
                        Username:
                        <input
                          readOnly
                          type="text"
                          name="username"
                          id="username"
                          placeholder={this.state.data.username}
                          className="form-control"
                        />
                      </div>
                      <div className="col-sm-6">
                        Designation:
                        <select
                          disabled
                          id="designation"
                          name="designation"
                          className="form-control"
                        >
                          
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-right">
                    <button
                      type="button"
                      id="editButton"
                      className="btn btn-secondary"
                      onClick={this.editform}
                    >
                      Edit
                    </button>
                    <button className="btn border-dark mx-2" type="reset">
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      id="updateBtn"
                      disabled
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (store) => ({
    auth: store.auth,
    faculty: store.get_Faculty_Profile,
  }),
  { getFacultyProfile, updateFaculty }
)(FacultyProfile);
