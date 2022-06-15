import axios from 'axios';
import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';

import DialogBox from '../modals/dialogBoxModal.js';
import GreenButton from '../helpers/greenButton.js';
import PageTitler from '../helpers/pageTitler.js';
import LoadingPage from '../helpers/loadingPage.js';

export default class ViewSets extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dialogBoxOpen: true,
      sets: [],
      isLoading: true
    }

    this.handleModalClose = this.handleModalClose.bind(this)
    this.selectedStudySet = this.selectedStudySet.bind(this)
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
    await axios.get(`https://letsgovocab-frontend.herokuapp.com/user-email/${userEmail}`, config)
    .then (user => {
      this.setState({...user.data}
    )  
    })
    .catch(error => {
      console.log("Error in getting user object", error);
    })

    await axios
    .get(`https://letsgovocab-frontend.herokuapp.com/cards-by-course/${this.state.course}`)
    .then (response => {
      this.setState({
        sets : [...response.data],
        isLoading: false
      })
    })
    .catch(error => {
      console.log("Error in getting cards by course", error)
    })
  }

  handleModalClose() {
    this.setState({
      dialogBoxOpen: false
    })
  }

  selectedStudySet(studySet) {
    window.sessionStorage.setItem("studySet", studySet)
  }

  render () {
    return (
      <div className='view-sets-wrapper'>
        {this.state.isLoading === true ? <LoadingPage /> : null}
        <DialogBox text="In this mode, you will only study a certain set of cards based on their category. You will see fewer cards this way and can focus your efforts on a specific set." modalIsOpen={this.state.dialogBoxOpen} handleModalClose={this.handleModalClose}/>
        <PageTitler className="page-titler" title={"View Sets"}/>
        <div className='setnames-wrapper'>
          {this.state.sets ? this.state.sets.map(set => <GreenButton className="modify-cards__set-entry" to={`/study-set/${set}`} key={set} text={set} onClick={() => this.selectedStudySet(set)}>{set}</GreenButton>) : null}
        </div>
      </div>
    );
  }
}