import React from 'react';
import connect from 'react-redux/es/connect/connect';

import { anecdoteCreation, voting } from '../reducers/anecdoteReducer';
import { removeNotification, setNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';

class AnecdoteList extends React.Component {
	vote = async (anecdote) => {
		const votedAnecdote = await anecdoteService.update( anecdote.id, { ...anecdote, votes: anecdote.votes + 1 });
		this.props.voting(votedAnecdote.id);

		this.props.setNotification(`voted for '${votedAnecdote.content}'`);
		setTimeout(() => {
			this.props.removeNotification();
		}, 5000);
	};

	render() {
		return (
			<div>
				<h2>Anecdotes</h2>
				{this.props.anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
					<div key={anecdote.id}>
						<div>
							{anecdote.content}
						</div>
						<div>
							has {anecdote.votes}
							<button onClick={() =>
								this.vote(anecdote)
							}>
								vote
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const anecdotesToShow = (anecdotes, filter) => {
	if (filter === '') {
		return anecdotes;
	}

	return anecdotes.filter(anecdote => {
		return anecdote.content.toLowerCase().includes(filter.toLowerCase());
	});
};

const mapStateToProps = (state) => {
	return {
		anecdotes: anecdotesToShow(state.anecdotes, state.filter)
	};
};

const mapDispatchToProps = {
	anecdoteCreation,
	voting,
	setNotification,
	removeNotification
};

const ConnectedAnecdoteList = connect(
	mapStateToProps,
	mapDispatchToProps
)(AnecdoteList);

export default ConnectedAnecdoteList;