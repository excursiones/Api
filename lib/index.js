'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const excursionsTypeDef = `
type Excursion {
    id: Int!
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
    state: Int!
}
input ExcursionCreationInput {
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
}
input ExcursionEditionInput {
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
    state: Int!
}`;


const excursionsQueries = `
allExcursions: [Excursion]
excursionById(id: Int!): Excursion!
excursionByDuration(duration: Int!): [Excursion]!
excursionByLocation(location: String!): [Excursion]!
excursionByPrice(price: Int!): [Excursion]!
`;

const excursionsMutations = `
createExcursion(excursion: ExcursionCreationInput!): Excursion!
deleteExcursion(id: Int!): Excursion!
updateExcursion(id: Int!, excursion: ExcursionEditionInput!): Excursion!
`;


// ----------------------------- Packages-----------------------------

const packagesTypeDef = `
type Package{
    id_packages: Int
    name: String!
    price: Int!
    id_excursions: Int
    state: Int!
}

input CreatePackageInput {
    name: String!
    price: Int!
    excursions: [Int]
}

input EditPackageInput {
    name: String!
    price: Int!
    state: Int!
}`;

const PackagesQueries = `
allPackages: [Package]!
packageById(id: Int!): Package!
packageByPrice(price: Int!): [Package]!
`;

const packagesMutations = `
createPackage(_package: CreatePackageInput!): Package!
deletePackage(id: Int!): Package!
updatePackage(id: Int!, _package: EditPackageInput!): Package
`;

const suppliersTypeDef = `
type Supplier {   
    id: Int
    Codigo: Int
    Nit: Int
    Razon: String
    Telefono: String
    Correo: String
    Ubicacion: String
}
input SupplierInput {
    Codigo: Int
    Nit: Int
    Razon: String
    Telefono: String
    Correo: String
    Ubicacion: String
}`;

const suppliersQueries = `
    allSuppliers: [Supplier]
    supplierById(id: Int!): Supplier
    supplierAccount(id: Int!): Account
    
`;

const suppliersMutations = `
    createSupplier(supplier: SupplierInput!): Supplier!
    deleteSupplier(id: Int!): Int!
    updateSupplier(id: Int!, supplier: SupplierInput!): Supplier!
`;
const accountsTypeDef = `
type Account {    
    id: Int!
    Cuentas_por_pagar: Int!
    Cuentas_pagadas: Int!
    Intereses_por_pagar: Int!
    supplier_id: Int!
}
type DebtTotal {    
    Cuentas_por_pagar: Int    
    Intereses_por_pagar: Int    
}
input AccountInput {
    Cuentas_por_pagar: Int
    Cuentas_pagadas: Int
    Intereses_por_pagar: Int
    supplier_id: Int
}`;

const accountsQueries = `
    allAccounts: [Account]
    accountById(id: Int!): Account
    totalDebts: DebtTotal
`;

const accountsMutations = `
    createAccount(account: AccountInput!): Account!
    deleteAccount(id: Int!): Int
    updateAccount(id: Int!, account: AccountInput!): Account!
`;

const reservationsTypeDef = `
type Reservation {    
    id: Int
    id_user: String
    id_excursion: String
    id_type: String
    cancelled: Boolean 
    created_at: String
}
input ReservationInput {    
    id_user: String
    id_excursion: String
    id_type: String
    cancelled: Boolean     
}`;

const reservationsQueries = `
    allReservations: [Reservation]
    reservationsByUserId(User_id: String!): [Reservation]
    
`;

const reservationsMutations = `
    createReservation(reservation: ReservationInput!): Reservation
    deleteReservation(id: Int!): Int
    updateReservation(id: Int!, reservation: ReservationInput!): Reservation
`;

const url = '54.190.208.244';
const port = 8000;
const entryPoint = 'excursions';
const entryPoint1 = 'packages';

const URL = `http://${url}:${port}/${entryPoint}`;
const URL1 = `http://${url}:${port}/${entryPoint1}`;

const resolvers = {
	Query: {
		allExcursions: (_, { }, ctx) => {

			return getRequest(`${URL}/get`, '')
		},
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
			getRequest(`${URL2}/get_filtered_by_price/${price}`, '')
	},
	Mutation: {
		createExcursion: (_, { excursion }) =>
			generalRequest(`${URL}/create`, 'POST', excursion),
		updateExcursion: (_, { id, excursion }) =>
			generalRequest(`${URL}/edit/${id}`, 'PUT', excursion),
		deleteExcursion: (_, { id }) =>
			generalRequest(`${URL}/delete/${id}`, 'DELETE'),

		// ----------- Package Mutations ------------
		createPackage: (_, { _package }) =>
			generalRequest(`${URL1}/create`, 'POST', _package),
		updatePackage: (_, { id, _package }) =>
			generalRequest(`${URL1}/edit/${id}`, 'PUT', _package),
		deletePackage: (_, { id }) =>
			generalRequest(`${URL1}/delete/${id}`, 'DELETE')
	}
};

const url$1 = '18.236.1.65';
const port$1 = 3000;
const entryPoint$1 = 'suppliers';
const entryPoint2 = 'accounts';

const url$2 = process.env.LOGIN_URL;
const port$2 = process.env.LOGIN_PORT;
const tokenValidationEntryPoint = process.env.TOKEN_VALIDATION_ENTRY_POINT;

const jwt = require('jsonwebtoken');
const TVEP_URL = `http://${url$2}:${port$2}/${tokenValidationEntryPoint}`;

const getUserInfo = async (_, token) => {
    try {
        let validated = await generalRequest(`${TVEP_URL}`, 'GET', token);
        console.log(validated);
        if (validated) {
            if (validated == 200) {
                payload = jwt.decode(token, { json: true });
                return payload;
            }
            else
                return validated;
        } else {
            return -1;
        }
    } catch (error) {

    }
};

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;
const URL2$1 = `http://${url$1}:${port$1}/${entryPoint2}`;

const resolvers$1 = {
	Query: {
		allSuppliers: (_, { }, ctx) => {
			const user = getUserInfo(ctx.token);
			console.log(user);
			return getRequest(URL$1, '');

		},
		supplierById: (_, { id }) =>
			generalRequest(`${URL$1}/${id}`, 'GET'),
		supplierAccount: (_, { id }) =>
			generalRequest(`${URL$1}/${id}/account`, 'GET'),
		allAccounts: (_) =>
			getRequest(URL2$1, ''),
		totalDebts: (_) =>
			getRequest(`${URL2$1}/totales`, 'GET'),
		accountById: (_, { id }) =>
			generalRequest(`${URL2$1}/${id}`, 'GET')
	},
	Mutation: {
		createSupplier: (_, { supplier }) =>
			generalRequest(`${URL$1}`, 'POST', supplier),
		updateSupplier: (_, { id, supplier }) =>
			generalRequest(`${URL$1}/${id}`, 'PUT', supplier),
		deleteSupplier: (_, { id }) =>
			generalRequest(`${URL$1}/${id}`, 'DELETE'),
		createAccount: (_, { account }) =>
			generalRequest(`${URL2$1}`, 'POST', account),
		updateAccount: (_, { id, account }) =>
			generalRequest(`${URL2$1}/${id}`, 'PUT', account),
		deleteAccount: (_, { id }) =>
			generalRequest(`${URL2$1}/${id}`, 'DELETE')
	}
};

const url$3 = '34.218.39.87';
const port$3 = 3000;
const entryPoint$2 = 'reservations';

const URL$2 = `http://${url$3}:${port$3}/${entryPoint$2}`;

const resolvers$2 = {
	Query: {
		allReservations: (_) =>
			getRequest(URL$2, ''),
		reservationsByUserId: (_, { User_id }) =>
			generalRequest(`${URL$2}/${User_id}`, 'GET'),
			},
	Mutation: {
		createReservation: (_, { reservation }) =>
			generalRequest(`${URL$2}`, 'POST', reservation),
		updateReservation: (_, { id, reservation }) =>
			generalRequest(`${URL$2}/${id}`, 'PUT', reservation),
		deleteReservation: (_, { id }) =>
			generalRequest(`${URL$2}/${id}`, 'DELETE')
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		excursionsTypeDef,
		packagesTypeDef,
		suppliersTypeDef,
		accountsTypeDef,
		reservationsTypeDef
	],
	[
		excursionsQueries,
		PackagesQueries,
		suppliersQueries,
		accountsQueries,
		reservationsQueries
	],
	[
		excursionsMutations,
		packagesMutations,
		suppliersMutations,
		accountsMutations,
		reservationsMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers,
		resolvers$1,
		resolvers$2
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
