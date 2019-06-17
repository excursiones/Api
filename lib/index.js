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
    id: Int
    name: String!
    price: Int
    location: String
    description: String!
    photo_path: String
    duration: Int
    state: Int
}
input ExcursionCreationInput {
    name: String
    price: Int
    location: String
    description: String
    photo_path: String
    duration: Int
}
input ExcursionEditionInput {
    name: String
    price: Int
    location: String
    description: String
    photo_path: String
    duration: Int
    state: Int
}`;

const excursionsQueries = `
    allExcursions: [Excursion]
    excursionById(id: Int!): Excursion
    excursionByDuration(duration: Int!): [Excursion]
    excursionByLocation(location: String!): [Excursion]
    excursionByPrice(price: Int!): [Excursion]
`;

const excursionsMutations = `
    createExcursion(excursion: ExcursionCreationInput!): Excursion
    deleteExcursion(id: Int!): Int
    updateExcursion(id: Int!, excursion: ExcursionEditionInput!): Excursion
`;

const transactionsTypeDef = `
type CompanyPayment {
    id: Int!
    company_id: Int!
    price: Int!
    date: String!
    origin_account: String!
    destination_account: String!
}
input CompanyPaymentInput {
    company_id: Int!
    price: Int!
    origin_account: String!
    destination_account: String!
}
input Refund {
    id: Int!
    transaction_id: Int!
    date: String!
}
type UserPayment {
    id: Int!
    user_id: Int!
    price: Int!
    date: String!
    origin_account: String!
    destination_account: String!
}
input UserPaymentInput {
    user_id: Int!
    price: Int!
    origin_account: String!
    destination_account: String!
}
`;

const transactionsQueries = `
    allCompanyPayments: [CompanyPayment]
    allUserPayments: [UserPayment]
    allUserRefunds: [UserPayment]
`;

const transactionsMutations = `
    createCompanyPayment(company_payment: CompanyPaymentInput!): CompanyPayment
    createUserPayment(user_payment: UserPaymentInput!): UserPayment
`;

const url = '52.35.72.33';
const port = 8000;
const entryPoint = 'payments-api';

const URL$1 = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    allCompanyPayments: (_) =>
      getRequest(`${URL$1}/company_payments`, '').then(response => response['Companies payments']),
    allUserPayments: (_) =>
      getRequest(`${URL$1}/user_payments`, '').then(response => response['Users payments'])
    },
  
  Mutation: {
    createCompanyPayment: function(_, { company_payment }){
      var data = {}; 
      data.company_payment = company_payment;
      generalRequest(`${URL$1}/company_payments/`, 'POST', data);

    },
    createUserPayment: function (_, { user_payment }) {
      var data = {};
      data.user_payment = user_payment;
      generalRequest(`${URL$1}/user_payments/`, 'POST', data);
    }
  }
  
};

const bookingsTypeDef = `
type Booking {
    id: Int
    id_user: Int!
    id_excursion: Int!
    id_type: Int!
    cancelled: Boolean
}
input BookingInput {
    id: Int
    id_user: Int!
    id_excursion: Int!
    id_type: Int!
    cancelled: Boolean
} `;

const bookingsQueries = `
    allReservations: [Booking]!
    allCancelledReservations: [Booking]!
    allUserCancelledReservations(id: Int!): [Booking]!
    allReservationsByUser(id: Int!): [Booking]!
    excursionByDuration(duration: Int!): [Booking]!
    cancelledReservationsByExcursion(id: Int!): [Booking]!
    allUserPendingReservations(id: Int!): [Booking]!
`;

const bookingsMutations = `
    cancelReservation(id: Int!): Boolean
    createReservation(reservation: BookingInput!): Boolean
    deleteReservation(id: Int!): Boolean
    updateReservation(reservation: BookingInput!): Boolean
`;

const URL$2 = `http://34.218.39.87:3000`;

const resolvers$1 = {
	Query: {
		allReservations: (_) =>
			getRequest(`${URL$2}/reservations`, ''),
		allCancelledReservations: (_) =>
			getRequest(`${URL$2}/reservations/cancelled`, ''),
		allUserCancelledReservations: (_, {id}) =>
			getRequest(`${URL$2}/reservations/cancelled/${id}`, ''),
		allUserPendingReservations: (_, {id}) =>
			getRequest(`${URL$2}/reservations/pending/${id}`, ''),
		cancelledReservationsByExcursion: (_, {id}) =>
			getRequest(`${URL$2}/reservations/cancelled/excursion-package/${id}`, ''),
		allReservationsByUser: (_, {id}) => 
			getRequest(`${URL$2}/reservations/${id}`, ''),
		// availableReservationsByUser: (_, {id}) =>
		// 	new Promise(function(resolve, reject) {
		// 		var response = [];
		// 		getRequest(`${URLExc}/excursions/get`).then(res => {
		// 			res.map(excursion => {
		// 				getRequest(`${URL}/reservations/${excursion.id}`)
		// 			})
		// 		})
		// 	})
	},
	Mutation: {
		cancelReservation: (_, {id}) =>
			generalRequest(`${URL$2}/reservations/cancel/${id}`, 'PATCH'),
		createReservation: (_, { reservation }) =>
			{
				// console.log(reservation)
				return generalRequest(`${URL$2}/reservations`, 'POST', reservation)
			},
		deleteReservation: (_, { id }) =>
			generalRequest(`${URL$2}/reservations/${id}`, 'DELETE'),
		updateReservation: (_, { reservation }) =>
			generalRequest(`${URL$2}/reservations/${id}`, 'PATCH', reservation)
	}
};

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
    createSupplier(supplier: SupplierInput!): Supplier
    deleteSupplier(id: Int!): Int
    updateSupplier(id: Int!, suppiler: SupplierInput!): Supplier
`;
const accountsTypeDef = `
type Account {    
    Cuentas_por_pagar: Int
    Cuentas_pagadas: Int
    Intereses_por_pagar: Int
    supplier_id: Int
}
type DebtTotal {    
    Total_ctas_por_pagar: Int    
    Total_Int_por_pagar: Int    
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
    createAccount(account: AccountInput!): Account
    deleteAccount(account: Int!): Int
    updateAccount(account: Int!, account: AccountInput!): Account
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

const URL$3 = `http://54.190.208.244:8000`;

const resolvers$2 = {
	Query: {
		allExcursions: (_) =>
			getRequest(`${URL$3}/excursions/get`, ''),
		excursionById: (_, { id }) =>
			getRequest(`${URL$3}/excursions/get_by_id/${id}`, ''),
		excursionByDuration: (_, { duration }) =>
			getRequest(`${URL$3}/excursions/get_filtered_by_duration/${duration}`, ''),
		excursionByLocation: (_, { location }) =>
			getRequest(`${URL$3}/excursions/get_filtered_by_location/${location}`, ''),
		excursionByPrice: (_, { price }) =>
			getRequest(`${URL$3}/excursions/get_filtered_by_price/${price}`, ''),
	},
	Mutation: {
		createExcursion: (_, { excursion }) =>
			generalRequest(`${URL$3}/excursions/create`, 'POST', excursion),
		updateExcursion: (_, { id, excursion }) =>
			generalRequest(`${URL$3}/excursions/edit/${id}`, 'PUT', excursion),
		deleteExcursion: (_, { id }) =>
			generalRequest(`${URL$3}/excursions/delete/${id}`, 'DELETE')
	}
};

const url$1 = '18.236.1.65';
const port$1 = 3000;
const entryPoint$1 = 'suppliers';
const entryPoint2 = 'accounts';

const URL$4 = `http://${url$1}:${port$1}/${entryPoint$1}`;
const URL2 = `http://${url$1}:${port$1}/${entryPoint2}`;

const resolvers$3 = {
	Query: {
		allSuppliers: (_) =>
			getRequest(URL$4, ''),
		supplierById: (_, { id }) =>
			generalRequest(`${URL$4}/${id}`, 'GET'),
		supplierAccount: (_, { id }) =>
			generalRequest(`${URL$4}/${id}/account`, 'GET'), 
		allAccounts: (_) =>
			getRequest(URL2, ''),
		totalDebts: (_) =>
			getRequest(`${URL2}/totales`, ''),
		accountById: (_, { id }) =>
			generalRequest(`${URL2}/${id}`, 'GET')
	},
	Mutation: {
		createSupplier: (_, { supplier }) =>
			generalRequest(`${URL$4}`, 'POST', supplier),
		updateSupplier: (_, { id, supplier }) =>
			generalRequest(`${URL$4}/${id}`, 'PUT', supplier),
		deleteSupplier: (_, { id }) =>
			generalRequest(`${URL$4}/${id}`, 'DELETE'),
		createAccount: (_, { account }) =>
			generalRequest(`${URL2}`, 'POST', account),
		updateAccount: (_, { id, account }) =>
			generalRequest(`${URL2}/${id}`, 'PUT', account),
		deleteAccount: (_, { id }) =>
			generalRequest(`${URL2}/${id}`, 'DELETE') 
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		excursionsTypeDef,
		transactionsTypeDef,
		bookingsTypeDef,
		suppliersTypeDef,
		accountsTypeDef,
		reservationsTypeDef
	],
	[
		excursionsQueries,
		transactionsQueries,
		bookingsQueries,
		suppliersQueries,
		accountsQueries,
		reservationsQueries
	],
	[
		excursionsMutations,
		transactionsMutations,
		bookingsMutations,
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
		resolvers$2,
		resolvers,
		resolvers$1,
		resolvers$3
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;
const URL = process.env.public_url || "Nothing";

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
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${URL}`));
