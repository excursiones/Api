import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	excursionsMutations,
	excursionsQueries,
	excursionsTypeDef,
	packagesTypeDef,
	PackagesQueries,
	packagesMutations
} from './excursions_and_packages/typeDefs';

import {
	transactionsMutations,
	transactionsQueries,
	transactionsTypeDef
} from './transactions/typeDefs';


import transactionsResolvers from './transactions/resolvers';
import {
	bookingsMutations,
	bookingsQueries,
	bookingsTypeDef
} from './bookings/typeDefs';

import bookingsResolvers from './bookings/resolvers';
import {
	suppliersMutations,
	suppliersQueries,
	suppliersTypeDef,
	accountsQueries,
	accountsTypeDef,
	accountsMutations
} from './suppliers/typeDefs';

import {
	reservationsMutations,
	reservationsQueries,
	reservationsTypeDef
} from './reservations/typeDefs';

import excursionsResolvers from './excursions_and_packages/resolvers';
import suppliersResolvers from './suppliers/resolvers';
import reservationsResolvers from './reservations/resolvers';
import loginResolvers from './login_and_sign_up/resolvers'
import notificationsResolvers from './notifications/resolvers'
import {
	SignInAndSignUpTypeDef,
	SignInAndSignUpQueries,
	SignInAndSignUpMutations
} from './login_and_sign_up/typeDefs';
import {
	notificactionsTypeDefs,
	notificationsQueries,
	notificationsMutations
} from './notifications/typeDefs';

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
		SignInAndSignUpTypeDef,
		notificactionsTypeDefs
	],
	[
		excursionsQueries,
		transactionsQueries,
		bookingsQueries,
		PackagesQueries,
		suppliersQueries,
		accountsQueries,
		reservationsQueries,
		SignInAndSignUpQueries,
		notificationsQueries
	],
	[
		excursionsMutations,
		transactionsMutations,
		bookingsMutations,
		packagesMutations,
		suppliersMutations,
		accountsMutations,
		reservationsMutations,
		SignInAndSignUpMutations,
		notificationsMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		excursionsResolvers,
		transactionsResolvers,
		bookingsResolvers,
		suppliersResolvers,
		loginResolvers,
		notificationsResolvers
	)
});
