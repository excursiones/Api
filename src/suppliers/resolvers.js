import { generalRequest, getRequest, formatErr } from '../utilities';
import { url, port, entryPoint, entryPoint2 } from './server';
import { getUserInfo, unauthorizedError } from '../authorization/getUserInfo';


const URL = `http://${url}:${port}/${entryPoint}`;
const URL2 = `http://${url}:${port}/${entryPoint2}`;

const resolvers = {
	Query: {
		allSuppliers: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return getRequest(URL, '');
				return user
			}).catch(err => err)
		,
		supplierById: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/${id}`, 'GET');
				return user
			}).catch(err => err)
		,
		supplierAccount: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/${id}/account`, 'GET');
				return user
			}).catch(err => err)
		,
		allAccounts: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return getRequest(URL2, '');
				return user
			}).catch(err => err)
		,
		totalDebts: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return getRequest(`${URL2}/totales`, '');
				return user
			}).catch(err => err)
		,
		accountById: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL2}/${id}`, 'GET');
				return user
			}).catch(err => err)
	},
	Mutation: {
		createSupplier: (_, { supplier }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}`, 'POST', supplier);
				return user
			}).catch(err => err)
		,
		updateSupplier: (_, { id, supplier }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/${id}`, 'PUT', supplier);
				return user
			}).catch(err => err)
		,
		deleteSupplier: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL}/${id}`, 'DELETE');
				return user
			}).catch(err => err)
		,
		createAccount: (_, { account }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL2}`, 'POST', account);
				return user
			}).catch(err => err)
		,
		updateAccount: (_, { id, account }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL2}/${id}`, 'PUT', account);
				return user
			}).catch(err => err)
		,
		deleteAccount: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL2}/${id}`, 'DELETE');
				return user
			}).catch(err => err)
	}
};

export default resolvers;
