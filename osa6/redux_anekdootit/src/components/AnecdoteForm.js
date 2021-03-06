import React from 'react';
import { connect } from 'react-redux';

import { createNew } from '../reducers/anecdoteReducer';
import { notify } from '../reducers/notificationReducer';

class AnecdoteForm extends React.Component {
	createAnecdote = async (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		e.target.anecdote.value = '';
		this.props.createNew(content);

		this.props.notify(`created '${content}'`, 5000);
	};

	render() {
		return (
			<div>
				<h2>create new</h2>
				<form onSubmit={this.createAnecdote}>
					<div><input name='anecdote'/></div>
					<button>create</button>
				</form>
			</div>
		);
	}
}

const mapDispatchToProps = {
	createNew,
	notify
};

const ConnectedAnecdoteForm = connect(
	null,
	mapDispatchToProps
)(AnecdoteForm);

export default ConnectedAnecdoteForm;