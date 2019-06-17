import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, entryPoint1 } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;
const URL1 = `http://${url}:${port}/${entryPoint1}`;

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

		// ----------- Package Queries ------------
		allPackages: (_) =>
			getRequest(`${URL1}/get`, ''),
		packageById: (_, { id }) =>
			getRequest(`${URL1}/get_by_id/${id}`, ''),
		packageByPrice: (_, { price }) =>
			getRequest(`${URL1}/get_filtered_by_price/${price}`, '')
	},
	Mutation: {
		createExcursion: (_, { excursion }) =>
			generalRequest(`${URL}/create`, 'POST', excursion),
		updateExcursion: (_, { id, excursion }) =>
			generalRequest(`${URL}/edit/${id}`, 'PUT', excursion),
		deleteExcursion: (_, { id }) =>
			generalRequest(`${URL}/delete/${id}`, 'DELETE'),

		// ----------- Package Mutations ------------
		createPackage: (_, { pack }) =>{
			//console.log("body: %j", req.body)
			return generalRequest(`${URL1}/create`, 'POST', pack)},
		updatePackage: (_, { id, pack }) =>
			generalRequest(`${URL1}/edit/${id}`, 'PUT', pack),
		deletePackage: (_, { id }) =>
			generalRequest(`${URL1}/delete/${id}`, 'DELETE')
	}
};

export default resolvers;
