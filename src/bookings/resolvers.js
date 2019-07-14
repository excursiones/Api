import { generalRequest, getRequest } from '../utilities';
import { getUserInfo } from '../authorization/getUserInfo';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}`, '');
				return user
			}).catch(err => err)
		,
		allCancelledReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/cancelled`, '');
				return user
			}).catch(err => err)
		,
		allUserCancelledReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/cancelled/${id}`, '');
				return user
			}).catch(err => err)
		,
		allUserPendingReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/pending/${id}`, '');
				return user
			}).catch(err => err)
		,
		cancelledReservationsByExcursion: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/cancelled/excursion-package/${id}`, '');
				return user
			}).catch(err => err)
		,
		allReservationsByUser: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL}/${id}`, '');
				return user
			}).catch(err => err)
		,
		// availableReservationsByUser: (_, {id}) =>
		// 	new Promise(function(resolve, reject) {
		// 		var response = [];
		// 		getRequest(`${URLExc}/excursions/get`).then(res => {
		// 			res.map(excursion => {
		// 				getRequest(`${URL}/${excursion.id}`)
		// 			})
		// 		})
		// 	})
	},
	Mutation: {
		cancelReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/cancel/${id}`, 'PATCH');
				return user
			}).catch(err => err)
		,
		createReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}`, 'POST', reservation);
				return user
			}).catch(err => err)
		,
		deleteReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/${id}`, 'DELETE');
				return user
			}).catch(err => err)
		,
		updateReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/${id}`, 'PATCH', reservation);
				return user
			}).catch(err => err)
	}
};

export default resolvers;
