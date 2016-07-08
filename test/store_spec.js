import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('store', function() {

	it('is a Redux store confugured with the correct reducer', function() {
		const store = makeStore();
		expect(store.getState()).to.equal(Map());

		store.dispatch({
			type: 'SET_ENTRIES',
			entries: ['Trainspotting', 'Sunshine']
		});

		expect(store.getState()).to.equal(fromJS({
			entries: ['Trainspotting', 'Sunshine']
		}));
	});

});
