import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getFacultyProfile,
  resetPassword,
  removeSuccess,
} from "../store/actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import SideNav_f from "../components/SideNav_f";
class FacultyChangePassword extends Component {
  state = {
    newpassword: "",
    confirmPassword: "",
    message: "",
    isLoading: true,
    showMessage: false,
    errMessage: "",
    data: {
      _id: null,
      name: {
        firstname: "s",
        lastname: "s",
      },
      department: "s",
      designation: "s",
      emailId: "srush@gmail.com",
      username: "srush",
    },
  };
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleconfirmPassword = this.handleconfirmPassword.bind(this);
  }
  async componentDidMount() {
    const { getFacultyProfile } = this.props;
    getFacultyProfile()
      .then(this.setState({ isLoading: false }))
      .then(() => this.loadData(this.props.faculty));
  }
  componentWillUnmount() {
    const { removeSuccess } = this.props;
    removeSuccess();
  }
  loadData(user) {
    this.setState({ data: user });
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.newpassword === this.state.confirmPassword) {
      const { resetPassword } = this.props;
      var formData = new FormData(event.target);
      const updatedata = {};     
      updatedata["oldpassword"] =
        formData.get("oldpassword") || this.state.data.password;
      updatedata["newpassword"] = formData.get("newpassword");
      updatedata["newpasswordC"] = formData.get("newpasswordC");
      resetPassword(this.state.data._id, updatedata).then();
    }
  }

  handleconfirmPassword(e) {
    this.setState({ [e.target.name]: e.target.value });   

    if (this.state.newpassword !== e.target.value) {
      this.setState({ message: "Passwords do not match!" });
    } else {
      this.setState({ message: "" });
    }
    this.setState({ confirmPassword: e.target.value });
  }
  render() {    
    return (
      <div>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <SideNav_f activeComponent="8" />
          </div>
          <div className="col-sm-10">
            <div className="container-fluid mt-2">
              {this.state.errMessage && (
                <div className="alert alert-danger">
                  {this.state.errMessage}
                </div>
              )}
              <h4>Changer le mot de passe</h4>
              <hr />
              {
                <form id="form" onSubmit={this.handleSubmit}>
                  <div className="container-fluid">
                    <div className="form-row my-2">
                      <div className="col-sm-6">
                        L'Ancien Mot de passe:
                        <input
                          required
                          type="password"
                          name="oldpassword"
                          id="oldpassword"
                          className="form-control"
                          placeholder="Entrer le mot de passe"
                        />
                      </div>
                      <div className="col-sm-6 mt-4">
                        <ErrorMessage />
                        <SuccessMessage />
                      </div>
                    </div>
                    <div className="form-row my-2">
                      <div className="col-sm-6">
                         Le Nouveau Mot de passe :
                        <input
                          required
                          type="password"
                          name="newpassword"
                          id="newpassword"
                          onChange={this.handleChange}
                          placeholder="entrer un nouveau mot de passe"
                          className="form-control"
                        />
                      </div>
                      <div className="col-sm-6">
                        Confirmer Le Nouveau Mot de passe:
                        <span className="float-right">
                          <small className="text-danger">
                            {this.state.message}
                          </small>
                        </span>
                        <input
                          required
                          type="password"
                          name="newpasswordC"
                          id="newpasswordC"
                          onChange={this.handleconfirmPassword}
                          placeholder="Confirmer Le nouveau mot de passe:"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-right">
                    <button
                      type="submit"
                      id="submitButton"
                      className="btn btn-secondary"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              }
              <ToastContainer />
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
  {
    getFacultyProfile,
    resetPassword,
    removeSuccess,
  }
)(FacultyChangePassword);
