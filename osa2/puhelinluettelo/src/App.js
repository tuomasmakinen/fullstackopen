import React from 'react';

import AddPerson from './components/AddPerson.js';
import FilterPersons from './components/FilterPersons.js';
import PersonsTable from './components/PersonsTable.js';
import Notification from './components/Notification';
import personService from './services/persons.js';

export default class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
			searchName: '',
			notificationMessage: null
        };
    }

    componentDidMount() {
        personService
            .getAll()
            .then( response => {
                this.setState( { persons: response } );
            } );
    }

    addPerson = ( event ) => {
        event.preventDefault();

        if( this.state.newName.length <= 0 || this.state.newNumber.length <= 0 ) {
            alert( "Nimi ja numero eivät saa olla tyhjiä!" );
            return;
        }

        const personObject = {
            name: this.state.newName,
            number: this.state.newNumber
        };

        if( this.state.persons.filter( person => person.name === personObject.name ).length > 0 ) {
            if( window.confirm( `${ personObject.name } on jo luettelossa, korvataanko vanha numero uudella?` ) ) {
				let id = this.state.persons.find( person => person.name === personObject.name ).id;
                personObject.id = id;
                personService
                    .modify( personObject )
                    .then( modifiedPerson => {
                        this.setState( {
                            persons: this.state.persons.map( person =>
                                person.id === modifiedPerson.id
                                    ? Object.assign( {}, person, { number: modifiedPerson.number } )
                                    : person
                            ),
                            newName: "",
                            newNumber: "",
							notificationMessage: `Muokattiin ${ modifiedPerson.name }`
						} );
						setTimeout( () => {
							this.setState( { notificationMessage: null } );
						}, 2500 );
					} )
					.catch( error => {
						this.setState( {
							notificationMessage: `${ personObject.name } oli jo poistettu, lisätään uutena`,
							persons: this.state.persons.filter( person => person.id !== id )
						} );
						personService
							.create( personObject )
							.then( newPerson => {
								this.setState( {
									persons: this.state.persons.concat( newPerson ),
									newName: '',
									newNumber: ''
								} );
							} )
						setTimeout( () => {
							this.setState( { notificationMessage: null } );
						}, 2500 );
					} );
            }

            return;
        }

        personService
            .create( personObject )
            .then( newPerson => {
                this.setState( {
                    persons: this.state.persons.concat( newPerson ),
                    newName: '',
					newNumber: '',
					notificationMessage: `Lisättiin ${ newPerson.name }`
				} );
				setTimeout( () => {
					this.setState( { notificationMessage: null } )
				}, 2500 );
            } )

    }

    handleNameChange = ( event ) => {
        this.setState({ newName: event.target.value });
    };

    handeNumberChange = ( event ) => {
        this.setState({ newNumber: event.target.value });
    };

    handleSearchNameChange = ( event ) => {
        this.setState({ searchName: event.target.value });
    };

    onDeleteClick = ( id ) => {
        return () => {
            let name = this.state.persons.find( person => person.id === id ).name
            if( window.confirm( `Poistetaanko ${ name }?` ) ) {
                personService
                    .remove( id )
                    .then( status => {
						this.setState( {
							persons: this.state.persons.filter( person => person.id !== id ),
							notificationMessage: `Poistettiin ${ name }`
						} );
						setTimeout( () => {
							this.setState( { notificationMessage: null } )
						}, 2500 );
					} );
            }
        }
    };

    render() {
        const namesToShow =
            this.state.searchName.length < 0 ?
                this.state.persons :
                this.state.persons.filter( person =>
                    person.name.toLowerCase().includes( this.state.searchName.toLowerCase() )
                );

        return (
            <div>
                <h2>Puhelinluettelo</h2>
				<Notification message={ this.state.notificationMessage } />
                <AddPerson  onSubmit={ this.addPerson }
                            stateObject={ this.state }
                            onNameChange={ this.handleNameChange }
                            onNumberChange={ this.handeNumberChange } />

                <h2>Numerot</h2>
                <FilterPersons  stateObject={ this.state }
                                onSearchNameChange={ this.handleSearchNameChange } />

                <br/>
                <PersonsTable   phoneBook={ namesToShow } 
                                onDeleteClick={ this.onDeleteClick } />
                
            </div>
        );
    }
}