import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, entryPoint2 } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;
const URL2 = `http://${url}:${port}/${entryPoint2}`;

const resolvers = {
	Query: {
		allSuppliers: (_) =>
			getRequest(URL, ''),
		supplierById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
		supplierAccount: (_, { id }) =>
			generalRequest(`${URL}/${id}/account`, 'GET'),
		allAccounts: (_) =>
			getRequest(URL2, ''),
		totalDebts: (_) =>
			getRequest(`${URL2}/totales`, 'GET'),
		accountById: (_, { id }) =>
			generalRequest(`${URL2}/${id}`, 'GET')
	},
	Mutation: {
		createSupplier: (_, { supplier }) =>
			generalRequest(`${URL}`, 'POST', supplier),
		updateSupplier: (_, { id, supplier }) =>
			generalRequest(`${URL}/${id}`, 'PUT', supplier),
		deleteSupplier: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE'),
		createAccount: (_, { account }) =>
			generalRequest(`${URL2}`, 'POST', account),
		updateAccount: (_, { id, account }) =>
			generalRequest(`${URL2}/${id}`, 'PUT', account),
		deleteAccount: (_, { id }) =>
			generalRequest(`${URL2}/${id}`, 'DELETE')
	}
};

export default resolvers;
