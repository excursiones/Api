import { generalRequest, getRequest } from '../utilities';
import { getUserInfo } from '../authorization/getUserInfo';

const URL = `http://34.67.150.50:8080`;

const resolvers = {
	Query: {
		allReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500")) {
					return getRequest(`http://34.67.150.50:8080/reservations`, '');
				}
				return user
			}).catch(err =>  console.log("ERROR1 :" + err)) 
		,
		allCancelledReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/reservations/cancelled`, '');
				return user
			}).catch(err => err)
		,
		allUserCancelledReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/reservations/cancelled/${id}`, '');
				return user
			}).catch(err => err)
		,
		allUserPendingReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/reservations/pending/${id}`, '');
				return user
			}).catch(err => err)
		,
		cancelledReservationsByExcursion: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/reservations/cancelled/excursion-package/${id}`, '');
				return user
			}).catch(err => err)
		,
		allReservationsByUser: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/reservations/${id}`, '');
				return user
			}).catch(err => err)
		,
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
		cancelReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/reservations/cancel/${id}`, 'PATCH');
				return user
			}).catch(err => err)
		,
		createReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/reservations`, 'POST', reservation);
				return user
			}).catch(err => err)
		,
		deleteReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/reservations/${id}`, 'DELETE');
				return user
			}).catch(err => err)
		,
		updateReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/reservations/${id}`, 'PATCH', reservation);
				return user
			}).catch(err => err)
	}
};

export default resolvers;
