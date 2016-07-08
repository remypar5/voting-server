import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('the application function', function() {

	describe('setEntries', function() {

		it('adds the entries to the state', function() {
			const state = Map();
			const entries = List.of('Trainspotting', 'Sunshine');
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', 'Sunshine')
			}));
		});

		it('converts to immutable', function() {
			const state = Map();
			const entries = ['Trainspotting', 'Sunshine'];
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', 'Sunshine')
			}));
		});
	});

	describe('next', function() {

		it('takes the next two entries under vote', function() {
			const state = Map({
				entries: List.of('Trainspotting', 'Sunshine', '28 Days Later')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', 'Sunshine')
				}),
				entries: List.of('28 Days Later')
			}));
		});

		it('puts winner of current vote back to entries', function() {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', 'Sunshine'),
					tally: Map({
						'Trainspotting': 4,
						'Sunshine': 2
					})
				}),
				entries: List.of('28 Days Later', 'Millions', '127 Hours')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('28 Days Later', 'Millions'),
				}),
				entries: List.of('127 Hours', 'Trainspotting')
			}));
		});

		it('puts both from tied vote back to entries', function() {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', 'Sunshine'),
					tally: Map({
						'Trainspotting': 3,
						'Sunshine': 3
					})
				}),
				entries: List.of('28 Days Later', 'Millions', '127 Hours')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('28 Days Later', 'Millions'),
				}),
				entries: List.of('127 Hours', 'Trainspotting', 'Sunshine')
			}));
		});

		it('marks the winner when there is just one entry left', function() {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', 'Sunshine'),
					tally: Map({
						'Trainspotting': 4,
						'Sunshine': 2
					})
				}),
				entries: List()
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}));
		});
	});

	describe('vote', function() {

		it('creates a tally for the voted entry', function() {
			const state = Map({
				pair: List.of('Trainspotting', 'Sunshine')
			});
			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', 'Sunshine'),
				tally: Map({
					'Trainspotting': 1
				})
			}));
		});

		it('adds to existing tally for the voted entry', function() {
			const state = Map({
				pair: List.of('Trainspotting', 'Sunshine'),
				tally: Map({
					'Trainspotting': 3,
					'Sunshine': 2
				})
			});
			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', 'Sunshine'),
				tally: Map({
					'Trainspotting': 4,
					'Sunshine': 2
				})
			}));
		});
	});
});
