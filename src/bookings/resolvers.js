import { generalRequest, getRequest } from '../utilities';
import URLExc from '../excursions/server';

const URL = `http://34.218.39.87:3000`;

const resolvers = {
	Query: {
		allReservations: (_) =>
			getRequest(`${URL}/reservations`, ''),
		allCancelledReservations: (_) =>
			getRequest(`${URL}/reservations/cancelled`, ''),
		allUserCancelledReservations: (_, {id}) =>
			getRequest(`${URL}/reservations/cancelled/${id}`, ''),
		cancelledReservationsByExcursion: (_, {id}) =>
			getRequest(`${URL}/reservations/cancelled/excursion-package/${id}`, ''),
		// availableReservationsByUser: (_, {id}) =>
		// 	new Promise(function(resolve, reject) {
		// 		var response = [];
		// 		getRequest(`${URLExc}/excursions/get`).then(res => {
		// 			res.map(excursion => {
		// 				getRequest(`${URL}/reservations/${excursion.id}`)
		// 			})
		// 		})
		// 	})
	},
	Mutation: {
		cancelReservation: (_, {id}) =>
			generalRequest(`${URL}/reservations/cancel/${id}`, 'PATCH'),
		createReservation: (_, { reservation }) =>
			generalRequest(`${URL}/reservations`, 'POST', reservation),
		deleteReservation: (_, { id }) =>
			generalRequest(`${URL}/reservations/${id}`, 'DELETE'),
		updateReservation: (_, { reservation }) =>
			generalRequest(`${URL}/reservations/${id}`, 'PATCH', reservation)
	}
};

export default resolvers;
