import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allReservations: (_) =>
			getRequest(URL, ''),
		reservationsByUserId: (_, { User_id }) =>
			generalRequest(`${URL}/reservations/${User_id}`, 'GET'),
			},
	Mutation: {
		createReservation: (_, { reservation }) =>
			generalRequest(`${URL}`, 'POST', reservation),
		updateReservation: (_, { id, reservation }) =>
			generalRequest(`${URL}/${id}`, 'PUT', reservation),
		deleteReservation: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
