import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoadingPage from '../helpers/loadingPage';
import PageTitler from '../helpers/pageTitler';
import UserProfile from '../helpers/userProfile';
import DialogBox from '../modals/dialogBoxModal';




export default class AdministratorHome extends Component {
  constructor(props) {
    super(props)
  
      this.state = {
        admin:{},
        searchParams: "1-1",
        users: [],
        changesMade: false,
        firstSearch: true,
        isLoading: false
      }
    this.handleChange = this.handleChange.bind(this)
    this.getUsers = this.getUsers.bind(this)
  }

  componentDidMount(){
    var token = window.sessionStorage.getItem("token")
    const decoded = jwtDecode(token) 
    const adminEmail = decoded.sub.email
    axios.patch(`https://letsgovocab-frontend.herokuapp.com/update-user-by-email/${adminEmail}`, { logged_in:"true" }, { headers: {"Authorization" : `Bearer ${token}`}})
    .catch(error => {
      console.log("Patch log status error", error)
    })
    axios.get(`https://letsgovocab-frontend.herokuapp.com/user-by-email/${adminEmail}`, { headers: {"Authorization" : `Bearer ${token}`}})
    .then (Admin => {
      this.setState({
        admin : Admin.data
      })
    })
    .catch(error => {
      console.log("Error in getting admin object", error);
    })
  }
  handleChange(event) {
    this.setState({
    [event.target.name]: event.target.value
    });
  }

  getUsers() {
    this.setState({
      isLoading: true
    })
    if (this.state.searchParams === "Instructors") {
      axios
      .get('https://letsgovocab-frontend.herokuapp.com/instructors')
      .then(response => {
        this.setState({
          users: [...response.data],
          firstSearch: false,
          isLoading: false
        })
      })
      .catch(error => {
        console.log("Error in getting data from instructor query", error)
      })
    } else if (this.state.searchParams === "Administrators") {
      this.setState({
        isLoading: true
      })
      axios
      .get('https://letsgovocab-frontend.herokuapp.com/administrators')
      .then(response => {
        this.setState({
          users: [...response.data],
          firstSearch: false,
          isLoading: false
        })
      })
      .catch(error => {
        console.log("There was an error in the administrator query", error)
      })
    } else {
      this.setState({
        isLoading: true
      })
    axios
    .get(`https://letsgovocab-frontend.herokuapp.com/users-by-course/${this.state.searchParams}`)
    .then(response => {
      this.setState({
        users: [...response.data],
        firstSearch: false,
        isLoading: false
      })
    })
    .catch(error => {
      "Error in new getUsers function", error})
  }
}

  render () {
    return (
      <div className="admin-home-wrapper">
      {this.state.first === "" ? <LoadingPage /> : null }
      <div className='admin-home__welcome-message'>Welcome back, {this.state.admin.first}!</div>
        <div className='admin-home__page-name'>Home</div>
        <div className='page-titler-and-selector'>
          <PageTitler className='page-titler-and-selector__page-titler' title={"User Status"}/>   
          <div className='wrapper'>
            <div className='selector-wrapper'>   
              <label className='page-titler-and-selector__selector-label' htmlFor='searchParams'>Select Users</label>
                <select className='page-titler-and-selector__search-params' name="searchParams" value={this.state.searchParams} onChange={this.handleChange}>
                  <option value="1-1">Junior High TEIE 1-1</option>
                  <option value="2-1">Junior High TEIE 2-1</option>
                  <option value="2-2">Junior High TEIE 2-2</option>
                  <option value="3-1">Junior High TEIE 3-1</option>
                  <option value="Instructors">Instructors</option>
                  <option value="Administrators">Administrators</option>
                </select>
              <button className='page-titler-and-selector__search-button' onClick={this.getUsers}>Search</button>
                <div className='save-changes-wrapper'>
                  <FontAwesomeIcon className='save-changes-button' icon="pen-square" />
                <p className='save-changes-button__description'>Save Changes</p>
              </div>
            </div>
          </div>
        </div>

        <div className='user-status__results'>
          {this.state.changesMade === true ? <DialogBox text="Changes saved, please search again to confirm changes." to='/admin/home' /> : null}
          {this.state.isLoading === true ? <LoadingPage /> : null}
          {this.state.users.length === 0 && this.state.firstSearch === false ? <div className='user-not-found'>User Not Found</div> : this.state.users.map(user => <UserProfile className="user-status__user-profile-component" key={user["_id"]} updateData={this.handleChange} id={user._id} first={user.first} last={user.last} email={user.email} logged_in={user.logged_in} role={user.role} course={user.course}/>)}
        </div>
      </div>
    );
  }
}
