import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';

import GreenButton from '../helpers/greenButton';
import LoadingPage from '../helpers/loadingPage';
import StudyCard from '../helpers/studyCard';
import DialogBox from '../modals/dialogBoxModal';

export default class StudySet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardIds: [],
      card_number: 0,
      cards: [],
      set: [],
      isLoading: true
    }

    this.handleLoadCard = this.handleLoadCard.bind(this)
    this.handleLoadNextCard = this.handleLoadNextCard.bind(this)
  }

  async componentDidMount() {
    const studySet = window.sessionStorage.getItem("studySet")
    const token = window.sessionStorage.getItem("token")
    const decoded = jwtDecode(token)
    const email = decoded.sub.email
    await axios
    .get(`https://letsgovocab-frontend.herokuapp.com/student-email/${email}`)
    .then(response => {
      this.setState({
        ...response.data
      })
    })
    .catch(error => {
      console.log("Error in retrieving user info on component mount", error)
    })

    await axios
    .get(`https://letsgovocab-frontend.herokuapp.com/card-public-id-by-setname/${studySet}`)
    .then(response => {
      this.setState({
        set: [...response.data],
        isLoading: false
      })
    })
    this.handleLoadNextCard()
  }

  handleLoadCard() {
    axios
    .get(`https://letsgovocab-frontend.herokuapp.com/get-card-by-id/${this.state.set[this.state.card_number]}`)
    .then(response => 
      this.setState({cards : [response.data]}))
    .catch(error => ("There was an error loading the card", error))
    this.setState({
      card_number : card_number + 1
    })
  }

  handleLoadNextCard() {
    let num = this.state.card_number + 1
    if (num >= this.state.set.length) {
      num = 0
    }
    this.setState({
      card_number: num
  })
    axios
    .get(`https://letsgovocab-frontend.herokuapp.com/get-card-by-id/${this.state.set[this.state.card_number]}`)
    .then(response => 
      this.setState({cards : [response.data]}))
  }

  render () {
    return (
      <div className='study-page'>
        {this.state.isLoading === true ? <LoadingPage /> : null}
        {this.state.set.length === 0 ? <div className='study-page__no-cards'>You don't have any card sets yet, please check back later</div> : this.state.cards.map(card => <StudyCard className="study-card" key={card.public_id} word={card.word} meaning={card.meaning} />)}
        <div className='study-page__button-wrapper'>
          <button className='study-page__next' onClick={this.handleLoadNextCard}>Next</button>
          <GreenButton className='study-page__quit-button' to='/home' text="Quit" onClick={this.handleModalClose} />
        </div>
      </div>
    );
  }
}