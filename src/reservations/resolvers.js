import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';
import { getUserInfo } from '../authorization/getUserInfo';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				console.log("ALL RESERVATIONS2");
				if (user.type && (user.type[0] != "500"))
					return getRequest(URL, '');
				return user
			}).catch(err => console.log("ERROR2 :" + err)) 
		,
		reservationsByUserId: (_, { User_id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/${User_id}`, 'GET');
				return user
			}).catch(err => err)
		,
	},
	Mutation: {
		createReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}`, 'POST', reservation);
				return user
			}).catch(err => err)
		,
		updateReservation: (_, { id, reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/${id}`, 'PUT', reservation);
				return user
			}).catch(err => err)
		,
		deleteReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL}/${id}`, 'DELETE');
				return user
			}).catch(err => err)
	}
};

export default resolvers;
