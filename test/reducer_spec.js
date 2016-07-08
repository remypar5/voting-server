import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('the reducer', function() {

	it('handles the SET_ENTRIES action', function() {
		const state = Map();
		const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Trainspotting']
		}));
	});

	it('has an initial state', function() {
		const action = { type: 'SET_ENTRIES', entries: ['Trainspotting'] };
		const nextState = reducer(undefined, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Trainspotting']
		}));
	});

	it('handles the NEXT action', function() {
		const state = fromJS({
			entries: ['Trainspotting', '28 Days Later']
		});
		const action = { type: 'NEXT' };
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Trainspotting', '28 Days Later']
			},
			entries: []
		}));
	});

	it('handles the VOTE action', function() {
		const state = fromJS({
			vote: {
				pair: ['Trainspotting', 'Sunshine']
			},
			entries: []
		});
		const action = { type: 'VOTE', entry: 'Trainspotting' };
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Trainspotting', 'Sunshine'],
				tally: { 'Trainspotting': 1 }
			},
			entries: []
		}));
	});

	it('can be used with reduce', function() {
		const actions = [
			{ type: 'SET_ENTRIES', entries: ['Trainspotting', 'Sunshine'] },
			{ type: 'NEXT' },
			{ type: 'VOTE', entry: 'Trainspotting' },
			{ type: 'VOTE', entry: 'Sunshine' },
			{ type: 'VOTE', entry: 'Trainspotting' },
			{ type: 'NEXT' }
		];
		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			winner: 'Trainspotting'
		}));
	});
});
