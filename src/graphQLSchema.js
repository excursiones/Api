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
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		excursionsResolvers,
		suppliersResolvers,
		reservationsResolvers
	)
});
