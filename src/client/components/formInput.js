import React from 'react';
import OrigoSuggest from '@nrk/origo-suggest/jsx';
import { OrgImage } from '@nrk/origo/jsx';

function showCurrentTicket(ticket) {
  if (ticket.username) {
    const { _id, description, mediaCounter, createdAt, byline, rightsDescription, red } = ticket;
    const diff = new Date() - new Date(createdAt);
    const diffInMins = diff/1000/60; // Convert milliseconds to hours
  return (
    <div className="org-shadow-small" style={{backgroundColor: 'var(--org-color-background-3)'}}>
      <p className='org-grid'>
        <span className='org-2of12'><OrgImage/> {mediaCounter} bilder</span>
        <span className='org-10of12'><strong>Opprettet:</strong> {parseInt(diffInMins)} minutter siden <strong> Byline:</strong> {byline}<strong> Rettigheter:</strong> {rightsDescription}<br/>
  <strong>Beskrivelse:</strong> {description} {red && <strong>Rødmerket</strong>}</span>
        <span><strong>Id:</strong> {_id} </span>
      </p>
    </div>
  )
  }
  }


class FormInput extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        byline: '',
        rightsType: 'nrk',
        rightsDescription: '',
        name: '',
        red: false,
        username: '',
        valid: false,
        saving: false,
        message: '',
        userMessage: '',
        agentUri: '',
        databaseId: null,
        currentTicket: {},
      };
    }


    getLatestTicket = (username) => {
      fetch(`/api/ticketbyusername/${username}`  , {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        this.setState({currentTicket: data[0] || {} });
      });
    
    }
    _onSave = () => {
      this.setState({valid:false, saving:true, message: 'Lagrer ticket...'});
      fetch(`/api/tickets` , {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(this.state),
      })
      .then(response => response.json())
      .then(data => {
        this.setState({databaseId: data._id, valid:false, saving:false, message: 'Ticket er lagret!'});
      });
    }

    toggleRed = () => {
      this.setState({red: !this.state.red})
    }

    handleChange = (ev) => { 
      this.setState({ [ev.target.name]: ev.target.value }); 
    }

    handleSuggest = (event) => { 
      console.log('test', event.target.value);
      let name = event.target.value.officialName;
      let userName = event.target.value.userName;
      let agentUri = event.target.value.uri;
      this.setState({ name: name, agentUri: agentUri, byline: `${name} / NRK`, username: userName, valid: true});
      this.getLatestTicket(userName);
    }

  render() {
  return (
    <div>
      <header>
        <div className="org-bar org-bar--primary">
        <h2><OrgImage/> "Ticket"</h2>
        </div>
      </header>
        <div className="org-grid">
        <form>

              <label className="org-10of12">
                Fotograf
                <input className="org-input" type="text" placeholder="Søk på navn / ansattnr..."/>
                <OrigoSuggest query="size=10&source=lp&alive=true" onSuggestSelect={this.handleSuggest} type="agent" hidden></OrigoSuggest>
              </label>
              <label className="org-10of12">
                Beskrivelse (bør inneholde sted, medvirkende..)
                <textarea onChange={this.handleChange} name="description" type="text" className="org-input"/>
              </label>
              <label className="org-10of12">
                Kreditering (byline)
                <input onChange={this.handleChange} name="byline" className="org-input" type="text" defaultValue={this.state.byline}/>
              </label>
              <label className="org-10of12">
                <p>
                <input type="checkbox" style={{color: this.state.red ? 'var(--org-color-error)' : ''}} onClick={this.toggleRed} checked={this.state.red} className="org-switch"/> Rødmerking (varsler om ikke bruk)
                </p>
              </label>
              <span 
                style={{background:'green', color: 'white', borderRadius:'15px', fontSize:'1.5em'}}
              />
              <p>
              <label className="org-10of12">
                Rettighetsnotat (valgfritt)
                  <textarea onChange={this.handleChange} className="org-input" name="rightsDescription" type="text" defaultValue={this.state.rights}/>
              </label>
              </p>
              </form>
              <button 
                onClick={this._onSave}
                className="org-button org-button--primary org-12of12" 
                disabled={!this.state.valid && !this.state.saving}>
                  Opprett "ticket"
                </button>
              <div className="org-6of12">
                <p>{this.state.message}</p>
              </div>
                {this.state.currentTicket.createdAt && 
              <div>
              <label>Din nåværende ticket:</label>
              {showCurrentTicket(this.state.currentTicket)}
              </div>
              }
              </div>
              </div>
  );
}
}
;

export default FormInput;
