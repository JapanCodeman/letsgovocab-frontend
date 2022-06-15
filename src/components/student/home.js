import axios from 'axios';
import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';

import PageTitler from '../helpers/pageTitler';
import GreenButton from '../helpers/greenButton';
import LoadingPage from '../helpers/loadingPage';

export default class Home extends Component {
  constructor(props) {
    super(props)

     this.state = {
       user: [],
       isLoading: true
     }
  }

  async componentDidMount() {
    var token = window.sessionStorage.getItem("token")
    const decoded = jwtDecode(token) 
    const userEmail = decoded.sub.email
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        "Authorization" : `Bearer ${token}`
        }
      }
    await axios.patch(`https://letsgovocab-backend.herokuapp.com/update-user-by-email/${userEmail}`, { logged_in: "true" }, config)
    .catch(error => {
      console.log("Patch log status error", error)
    })
    await axios.get(`https://letsgovocab-backend.herokuapp.com/user-email/${userEmail}`, config)
    .then (user => {
      this.setState({
        ...user.data}
    )  
    })
    .catch(error => {
      console.log("Error in getting user object", error);
    })
    await axios
    .get(`https://letsgovocab-backend.herokuapp.com/get-new-cards/${this.state.user.course}`)
    .then(response => {
      axios.patch(`https://letsgovocab-backend.herokuapp.com/update-user-by-email/${userEmail}`, { full_card_collection : response.data }, config)
      .catch(error => {
        console.log("Error updating full card collection", error)
      })
    })
    .catch(error => {
      console.log("Error getting new cards by course", error)
    })
    this.setState({
      isLoading: false
    })
  }


  render () {
    {this.state.isLoading === true && this.state.first !== null ? <LoadingPage /> : <Home />}
    return (
        <div className="student-home">
          <PageTitler className="page-titler" title="Home" />
          <PageTitler className="page-titler" title={`Welcome back, ${this.state.first}`} />
        <div className="student-home__agenda">Would you like to study all cards or by set?</div>
        <div className="student-home-button-wrapper">
            <GreenButton className="student-home-button-wrapper__green-button-study" to="/study" text="Study" />
            <GreenButton className="student-home-button-wrapper__green-button-view-sets" to="/view-sets" text="Study by Set" />
        </div>
      
        <div className="explanations-wrapper">
          <div className="explanations-wrapper__study">In study mode, you will study all the words you have been assigned. It is best to study throughout the day in small batches. It is recommended that you use this mode everyday!</div>
          <div className="explanations-wrapper__view-sets">In this mode, you choose a particular set of cards you want to study. This allows you to focus on particular sets of words you have been struggling with.</div>
        </div>
      </div>
    );
  }
}
  