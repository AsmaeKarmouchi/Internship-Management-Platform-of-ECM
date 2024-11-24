import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  MdNotifications,
  MdViewList,
  MdPermIdentity,
  MdDns,
  MdSettings,
  MdDoneAll,
  MdEqualizer,
  MdAssignment,
} from "react-icons/md";
import { connect } from "react-redux";
import { logout } from "../store/actions";
import { RiLogoutBoxLine } from "react-icons/ri";
import logoEcole from "../assets/images/ENSIAS.png"; 

class Sidenav_f extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    const { logout } = this.props;
    logout();
    window.location.href = "/";
  }
  render() {
    const activeNow = this.props.activeComponent; //get the sidenav component number that is currently active/visible
    return (
      <div className="sidenav">
        {/* Modifications */}
        <img src={logoEcole} style={{ maxWidth: '65px', maxHeight: '45px', marginLeft:'2.8cm' ,marginBottom:'-10px'}} alt="Logo de l'école" />
        <h4 className="text-light text-center mt-2" >ECM_Stages</h4>
        <p className="mt-4">Menu</p>
        <ul id="ul">
          <Link to="/facultyprofile">
            <li id="li" className={activeNow === "1" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdPermIdentity style={{ margin: -1, padding: -1 }} />
              </span>
              Profile
            </li>
          </Link>
          <Link to="/internships">
            <li id="li" className={activeNow === "2" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdViewList style={{ margin: -1, padding: -1 }} />
              </span>
              Applications reçues
            </li>
          </Link>
          <Link to="/approvedinternships">
            <li id="li" className={activeNow === "3" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdDoneAll style={{ margin: -1, padding: -1 }} />
              </span>
              Applications approuvées
            </li>
          </Link>
          <Link to="/createnotice">
            <li id="li" className={activeNow === "4" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdDns style={{ margin: -1, padding: -1 }} />
              </span>
              Envoyer des notifications
            </li>
          </Link>
          <Link to="/facultyNotices">
            <li id="li" className={activeNow === "5" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdNotifications style={{ margin: -1, padding: -1 }} />
              </span>
              Notifications
            </li>
          </Link>
          <Link to="/stats">
            <li id="li" className={activeNow === "6" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdEqualizer style={{ margin: -1, padding: -1 }} />
              </span>
              Stats
            </li>
          </Link>
          <Link to="/report">
            <li id="li" className={activeNow === "7" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdAssignment style={{ margin: -1, padding: -1 }} />
              </span>
              Rapport
            </li>
          </Link>
          <Link to="/facultysetting">
            <li id="li" className={activeNow === "8" ? "sidenav-active" : ""}>
              <span className="mx-2">
                <MdSettings style={{ margin: -1, padding: -1 }} />
              </span>
              Changer le mot de passe
            </li>
          </Link>
          <li id="li" className="nav-item">
            <span className="mx-2">
              <RiLogoutBoxLine style={{ margin: -1, padding: -1 }} />
            </span>
            <a onClick={this.handleLogout}>se déconnecter</a>
          </li>
        </ul>
        
      </div>
    );
  }
}

export default connect((store) => ({ auth: store.auth }), { logout })(
  Sidenav_f
);
