import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, entryPoint1 } from './server';
import { getUserInfo } from '../authorization/getUserInfo';

const URL = `http://${url}:${port}/${entryPoint}`;
const URL1 = `http://${url}:${port}/${entryPoint1}`;

const resolvers = {
	Query: {
		allExcursions: (_, { }, ctx) =>
			getRequest(`${URL}/get`, '')
		,
		excursionById: (_, { id }, ctx) =>
			getRequest(`${URL}/get_by_id/${id}`, ''),
		excursionByDuration: (_, { duration }, ctx) =>
			getRequest(`${URL}/get_filtered_by_duration/${duration}`, ''),
		excursionByLocation: (_, { location }, ctx) =>
			getRequest(`${URL}/get_filtered_by_location/${location}`, ''),
		excursionByPrice: (_, { price }, ctx) =>
			getRequest(`${URL}/get_filtered_by_price/${price}`, ''),

		// ----------- Package Queries ------------
		allPackages: (_, { }, ctx) =>
			getRequest(`${URL1}/get`, ''),
		packageById: (_, { id }, ctx) =>
			getRequest(`${URL1}/get_by_id/${id}`, ''),
		packageByPrice: (_, { price }, ctx) =>
			getRequest(`${URL1}/get_filtered_by_price/${price}`, '')
	},
	Mutation: {
		createExcursion: (_, { excursion }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/create`, 'POST', excursion);
				return user
			}).catch(err => err)
		,
		updateExcursion: (_, { id, excursion }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/edit/${id}`, 'PUT', excursion);
				return user
			}).catch(err => err)
		,
		deleteExcursion: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/delete/${id}`, 'DELETE');
				return user
			}).catch(err => err)
		,

		// ----------- Package Mutations ------------
		createPackage: (_, { pack }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL1}/create`, 'POST', pack);
				return user
			}).catch(err => err)
		,
		updatePackage: (_, { id, pack }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL1}/edit/${id}`, 'PUT', pack);
				return user
			}).catch(err => err)
		,
		deletePackage: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL1}/delete/${id}`, 'DELETE');
				return user
			}).catch(err => err)

	}
};

export default resolvers;
