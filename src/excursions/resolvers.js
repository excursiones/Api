import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allExcursions: (_) =>
			getRequest(`${URL}/get`, ''),
		excursionById: (_, { id }) =>
			getRequest(`${URL}/get_by_id/${id}`, ''),
		excursionByDuration: (_, { duration }) =>
			getRequest(`${URL}/get_filtered_by_duration/${duration}`, ''),
		excursionByLocation: (_, { location }) =>
			getRequest(`${URL}/get_filtered_by_location/${location}`, ''),
		excursionByPrice: (_, { price }) =>
			getRequest(`${URL}/get_filtered_by_price/${price}`, ''),
	},
	Mutation: {
		createExcursion: (_, { excursion }) =>
			generalRequest(`${URL}/create`, 'POST', excursion),
		updateExcursion: (_, { id, excursion }) =>
			generalRequest(`${URL}/edit/${id}`, 'PUT', excursion),
		deleteExcursion: (_, { id }) =>
			generalRequest(`${URL}/delete/${id}`, 'DELETE')
	}
};

export default resolvers;
