import { generalRequest, getRequest } from '../utilities';

const URL = `http://54.190.208.244:8000`;

const resolvers = {
	Query: {
		allExcursions: (_) =>
			getRequest(`${URL}/excursions/get`, ''),
		excursionById: (_, { id }) =>
			getRequest(`${URL}/excursions/get_by_id/${id}`, ''),
		excursionByDuration: (_, { duration }) =>
			getRequest(`${URL}/excursions/get_filtered_by_duration`, duration),
		excursionByLocation: (_, { location }) =>
			getRequest(`${URL}/excursions/get_filtered_by_location`, location),
		excursionByPrice: (_, { price }) =>
			getRequest(`${URL}/excursions/get_filtered_by_price`, price),
	},
	Mutation: {
		createExcursion: (_, { excursion }) =>
			generalRequest(`${URL}/excursions/create`, 'POST', excursion),
		updateExcursion: (_, { id, excursion }) =>
			generalRequest(`${URL}/excursions/edit/${id}`, 'PUT', excursion),
		deleteExcursion: (_, { id }) =>
			generalRequest(`${URL}/excursions/delete/${id}`, 'DELETE')
	}
};

export default resolvers;
