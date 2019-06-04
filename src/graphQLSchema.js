import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	excursionsMutations,
	excursionsQueries,
	excursionsTypeDef
} from './excursions/typeDefs';

import {
	transactionsMutations,
	transactionsQueries,
	transactionsTypeDef
} from './transactions/typeDefs';


import transactionsResolvers from './transactions/resolvers';
import{
	bookingsMutations,
	bookingsQueries,
	bookingsTypeDef
} from './bookings/typeDefs';

import bookingsResolvers from './bookings/resolvers';
import{	
	suppliersMutations,
	suppliersQueries,
	suppliersTypeDef,
	accountsQueries,
	accountsTypeDef,
	accountsMutations
} from './suppliers/typeDefs';

import excursionsResolvers from './excursions/resolvers';
import suppliersResolvers from './suppliers/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		excursionsTypeDef,
		transactionsTypeDef,
		bookingsTypeDef,
		suppliersTypeDef,
		accountsTypeDef
	],
	[
		excursionsQueries,
		transactionsQueries,
		bookingsQueries,
		suppliersQueries,
		accountsQueries
	],
	[
		excursionsMutations,
		transactionsMutations,
		bookingsMutations,
		suppliersMutations,
		accountsMutations
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
		suppliersResolvers
	)
});
