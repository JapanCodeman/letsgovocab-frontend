import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import GreenButton from '../helpers/greenButton';
import LoadingPage from '../helpers/loadingPage';
import PageTitler from '../helpers/pageTitler';


export default class ModifyCards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      cards: []
    }

    // this.getCards = this.getCards.bind(this)
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token")
    const decoded = jwtDecode(token)
    const email = decoded.sub.email

    axios
    .get(`https://letsgovocab-backend.herokuapp.com/sets-by-instructor/${email}`)
    .then(response =>
      this.setState({
      isLoading: false,
      cards: [...response.data]
      })
    )
    .catch(error => {
      "Error in retrieving cards", error
    })
  }

  render () {
    return (
      <div className='modify-cards'>
        { this.state.isLoading === true ? <LoadingPage /> : null }
        <PageTitler className='modify-cards__page-titler' title="Modify Cards" />
        <div className="modify-cards__your-sets">Your sets</div>
        <div className='modify-cards__set-wrapper'>
          {this.state.cards.map(set => <GreenButton className="modify-cards__set-entry" to={`/instructor/modify/${set}`} key={set} text={set}>{set}</GreenButton>)}
        </div>
      </div>
    );
  }
}