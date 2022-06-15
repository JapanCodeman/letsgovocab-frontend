import React, { Component } from 'react';
import PageTitler from '../helpers/pageTitler';
import CreateCard from './createCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import DialogBox from '../modals/dialogBoxModal';

export default class CreateCards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: "",
      set_name: "",
      course: "1-1",
      cards: [],
      dialogBoxOpen: false
    }

    this.handleAddCardToSet = this.handleAddCardToSet.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClearState = this.handleClearState.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleSetName = this.handleSetName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token")
    const decoded = jwtDecode(token)
    const email = decoded.sub.email
    this.setState({
      user: email
    })
  }

  handleAddCardToSet(card) {
    if (this.state.cards.indexOf(card) != -1) {
      window.alert("You have already created that card")
    } else {
    this.setState(prevState => ({
      created_by: this.state.user,
      set_name: this.state.set_name,
      cards: [...prevState.cards, card]
    }))
  }}

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClearState() {
    this.setState({
      set_name: "",
      course: "1-1",
      cards: []
    })
  }

  handleModalClose() {
    this.setState({
      dialogBoxOpen: false
    })
  }

  handleModalOpen() {
    this.setState({
      dialogBoxOpen: true
    })
  }

  handleSetName(event) {
    this.setState({
      cards: {set_name: event.target.value}
    })
  }

  handleSubmit() {
    console.log(this.state)
  }

  handleUploadCards(cards) {
    axios
    .post('https://letsgovocab-frontend.herokuapp.com/create-cards', [...cards])
    .then(response => {
      if (response.status === 200) {
        this.handleModalOpen()
      }
      else alert("There was an error")})
    }


  render () {
    return (
      <div className='create-cards-wrapper'>
        {this.state.dialogBoxOpen === true ? <DialogBox text={`Your cards for class ${this.state.course} have been published to the database under the setname ${this.state.set_name}. Click the green button press escape to return to the previous screen.`} modalIsOpen={this.state.dialogBoxOpen} handleModalClose={this.handleModalClose} /> : null }
        <PageTitler className="create-cards-title" title="Create Cards" />
        <div className='create-cards'>
          <div className='create-cards__instruction-label'>Fill out the card and press enter to submit it to the database</div>
          <label className='create-cards__course-label' htmlFor='create-cards__course'>What course is this set for?</label>
          <select className='create-cards__course' value={this.state.course} name='course' onChange={this.handleChange}>Create Cards
            <option name={this.state.course} value="1-1" >TEIE 1-1</option>
            <option name={this.state.course} value="2-1" >TEIE 2-1</option>
            <option name={this.state.course} value="2-2" >TEIE 2-2</option>
            <option name={this.state.course} value="3-1" >TEIE 3-1</option>
          </select>
          <label className='create-cards__set-name-label' htmlFor='create-cards__set-name'>Set Name</label>
          {this.state.set_name ? null : <div className='create-cards__set-name-required'>Set Name Required</div>}
          <input className='create-cards__set-name-input' name='set_name' onChange={this.handleChange} value={this.state.set_name} />
        </div>
        
        {this.state.set_name ? <CreateCard className="create-cards__card" handleAddCardToSet={this.handleAddCardToSet} user={this.state.user} setName={this.state.set_name} course={this.state.course}/> : null}

        <div className='create-cards__card-and-created'>
          <div className='create-cards__clear-list'>Click to clear list <FontAwesomeIcon icon="fa-solid fa-trash-can" onClick={this.handleClearState}/></div>
          <div className="create-cards__created-cards-list">Cards created this session</div>
          <div className="create-cards__upload-cards" onClick={() => this.handleUploadCards(this.state.cards)}>Click to upload cards to database <FontAwesomeIcon icon="fa-solid fa-upload"/></div>
          {this.state.cards.map((card) => <div className="create-cards__card-entry" key={card.word + card.meaning}>{card.word} = {card.meaning}</div>)}
        </div> 
      </div>
    );
  }
}