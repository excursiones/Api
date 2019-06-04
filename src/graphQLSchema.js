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


import excursionsResolvers from './excursions/resolvers';
import transactionsResolvers from './transactions/resolvers';
import{
	bookingsMutations,
	bookingsQueries,
	bookingsTypeDef
} from './bookings/typeDefs';

import excursionsResolvers from './excursions/resolvers';
import bookingsResolvers from './bookings/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		excursionsTypeDef,
		transactionsTypeDef,
		bookingsTypeDef
	],
	[
		excursionsQueries,
		transactionsQueries,
		bookingsQueries
	],
	[
		excursionsMutations,
		transactionsMutations,
		bookingsMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		excursionsResolvers,
		transactionsResolvers,
		bookingsResolvers
	)
});
