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
require('any-promise');

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
createPackage(pack: CreatePackageInput!): Package!
deletePackage(id: Int!): Package!
updatePackage(id: Int!, pack: EditPackageInput!): Package
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

const url = 'paymentsms.payments-ms';
const port = 8002;
const entryPoint = 'payments-api';

const url$1 = process.env.LOGIN_URL || "3.13.112.89";
const port$1 = process.env.LOGIN_PORT || 3000;
const tokenValidationEntryPoint = process.env.AUTHORIZATION_ENTRY || "/authorize";

const jwt = require('jsonwebtoken');

const TVEP_URL = `http://${url$1}:${port$1}/${tokenValidationEntryPoint}`;
const SKIP_AUTH = true; 

const getUserInfo = async (token) => {
    if(SKIP_AUTH) {
        return new Promise((resolve, reject$$1) => {
            resolve({
                type : [400]
            });
        });
    } else {
        return generalRequest(`${TVEP_URL}`, 'POST', { auth: token }, true).then(res => {
            if (res) {
                if (res.statusCode == 200) {
                    return jwt.decode(token.token, { json: true });
                } else {
                    return res;
                }
            } else {
                return -1;
            }
        }).catch(err => {
            console.error(err);
        });
    }
};

const URL$1 = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    allCompanyPayments: (_, { }, ctx) =>
      getUserInfo(ctx).then(user => {
        if (user.type && (user.type[0] == "500"))
          return getRequest(`${URL$1}/company_payments`, '').then(response => response['Companies payments']);
        return user
      }).catch(err => err)
    ,
    allUserPayments: (_, { }, ctx) =>
      getRequest(`${URL$1}/user_payments`, '').then(response => response['Users payments'])
  },

  Mutation: {

    createCompanyPayment: function (_, { company_payment }, ctx) {
      var data = {};
      data.company_payment = company_payment;
      return getUserInfo(ctx).then(user => {
        if (user.type && (user.type[0] == "500"))
          return generalRequest(`${URL$1}/company_payments/`, 'POST', data);
        return user
      }).catch(err => err)

    },
    createUserPayment: function (_, { user_payment }, ctx) {
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
    created_at: String
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

const url$2 = 'web.bookings-ms';
const port$2 = 3001;
const entryPoint$1 = 'reservations';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$1}`;

const resolvers$1 = {
	Query: {
		allReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}`, '');
				return user
			}).catch(err =>  console.log("ERROR1 :" + err)) 
		,
		allCancelledReservations: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}/cancelled`, '');
				return user
			}).catch(err => err)
		,
		allUserCancelledReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}/cancelled/${id}`, '');
				return user
			}).catch(err => err)
		,
		allUserPendingReservations: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}/pending/${id}`, '');
				return user
			}).catch(err => err)
		,
		cancelledReservationsByExcursion: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}/cancelled/excursion-package/${id}`, '');
				return user
			}).catch(err => err)
		,
		allReservationsByUser: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return getRequest(`${URL$2}/${id}`, '');
				return user
			}).catch(err => err)
		,
		// availableReservationsByUser: (_, {id}) =>
		// 	new Promise(function(resolve, reject) {
		// 		var response = [];
		// 		getRequest(`${URLExc}/excursions/get`).then(res => {
		// 			res.map(excursion => {
		// 				getRequest(`${URL}/${excursion.id}`)
		// 			})
		// 		})
		// 	})
	},
	Mutation: {
		cancelReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL$2}/cancel/${id}`, 'PATCH');
				return user
			}).catch(err => err)
		,
		createReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL$2}`, 'POST', reservation);
				return user
			}).catch(err => err)
		,
		deleteReservation: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL$2}/${id}`, 'DELETE');
				return user
			}).catch(err => err)
		,
		updateReservation: (_, { reservation }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] != "500"))
					return generalRequest(`${URL$2}/${id}`, 'PATCH', reservation);
				return user
			}).catch(err => err)
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

const url$3 = 'myapp2.packages-ms';
const port$3 = 8001;
const entryPoint$2 = 'excursions';
const entryPoint1 = 'packages';

const URL$3 = `http://${url$3}:${port$3}/${entryPoint$2}`;
const URL1 = `http://${url$3}:${port$3}/${entryPoint1}`;

const resolvers$2 = {
	Query: {
		allExcursions: (_, { }, ctx) =>
			getRequest(`${URL$3}/get`, '')
		,
		excursionById: (_, { id }, ctx) =>
			getRequest(`${URL$3}/get_by_id/${id}`, ''),
		excursionByDuration: (_, { duration }, ctx) =>
			getRequest(`${URL$3}/get_filtered_by_duration/${duration}`, ''),
		excursionByLocation: (_, { location }, ctx) =>
			getRequest(`${URL$3}/get_filtered_by_location/${location}`, ''),
		excursionByPrice: (_, { price }, ctx) =>
			getRequest(`${URL$3}/get_filtered_by_price/${price}`, ''),

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
					return generalRequest(`${URL$3}/create`, 'POST', excursion);
				return user
			}).catch(err => err)
		,
		updateExcursion: (_, { id, excursion }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$3}/edit/${id}`, 'PUT', excursion);
				return user
			}).catch(err => err)
		,
		deleteExcursion: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$3}/delete/${id}`, 'DELETE');
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

const url$4 = 'web.suppliers-ms';
const port$4 = 3000;
const entryPoint$3 = 'suppliers';
const entryPoint2 = 'accounts';

const URL$4 = `http://${url$4}:${port$4}/${entryPoint$3}`;
const URL2 = `http://${url$4}:${port$4}/${entryPoint2}`;

const resolvers$3 = {
	Query: {
		allSuppliers: (_, { }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return getRequest(URL$4, '');
				return user
			}).catch(err => err)
		,
		supplierById: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$4}/${id}`, 'GET');
				return user
			}).catch(err => err)
		,
		supplierAccount: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$4}/${id}/account`, 'GET');
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
					return generalRequest(`${URL$4}`, 'POST', supplier);
				return user
			}).catch(err => err)
		,
		updateSupplier: (_, { id, supplier }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$4}/${id}`, 'PUT', supplier);
				return user
			}).catch(err => err)
		,
		deleteSupplier: (_, { id }, ctx) =>
			getUserInfo(ctx).then(user => {
				if (user.type && (user.type[0] == "500"))
					return generalRequest(`${URL$4}/${id}`, 'DELETE');
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

const url$6 = process.env.LOGIN_URL || "3.13.112.89";
const port$6 = process.env.LOGIN_PORT || 3000;
const entryPoint$5 = process.env.LOGIN_ENTRY || "/sign_in";
const signUpEntryPoint = process.env.SIGN_UP_ENTRY || "/sign_up";

var jwt$1 = require('jsonwebtoken');
const URL$6 = `http://${url$6}:${port$6}/${entryPoint$5}`;
const signUpURL = `http://${url$6}:${port$6}/${signUpEntryPoint}`;

const crypto = require('crypto');

const resolvers$6 = {
	Query: {
	},
	Mutation: {
		sign_in: async (_, { signInCredentials }) => {
			try {
				let res = await generalRequest(`${URL$6}`, 'POST', signInCredentials);
				if (res) {
					console.log(res);

					return res;
				} else {
					return -1
				}
			} catch (err) {
				console.log(err);
			}
		},
		sign_up: async (_, { signUpCredentials }) => {

			try {
				let res = await generalRequest(`${signUpURL}`, 'POST', signUpCredentials);
				return res
			} catch (error) {
				console.error(error);

			}
		}
	}
};

const SignInAndSignUpTypeDef = `
type Token {
    token: String!
}

input SignInAuth {
    email: String!
    password: String!
}

input SignUpAuth {
    email: String!
    password: String!
    name: String!
}

input SignInCredentials {
    auth: SignInAuth!
}

input SignUpCredentials {
    auth: SignUpAuth!
}`;

const SignInAndSignUpQueries = `
`;

const SignInAndSignUpMutations = `
    sign_in(signInCredentials: SignInCredentials!): Token
    sign_up(signUpCredentials: SignUpCredentials!): String
`;

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		excursionsTypeDef,
		transactionsTypeDef,
		bookingsTypeDef,
		packagesTypeDef,
		suppliersTypeDef,
		accountsTypeDef,
		reservationsTypeDef,
		SignInAndSignUpTypeDef
	],
	[
		excursionsQueries,
		transactionsQueries,
		bookingsQueries,
		PackagesQueries,
		suppliersQueries,
		accountsQueries,
		reservationsQueries,
		SignInAndSignUpQueries
	],
	[
		excursionsMutations,
		transactionsMutations,
		bookingsMutations,
		packagesMutations,
		suppliersMutations,
		accountsMutations,
		reservationsMutations,
		SignInAndSignUpMutations
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
		resolvers$3,
		resolvers$6
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
			ctx.state.token = token["input"].split(" ")[1];
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
