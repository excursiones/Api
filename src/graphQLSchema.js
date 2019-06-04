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
		suppliersTypeDef,
		accountsTypeDef
	],
	[
		excursionsQueries, 
		suppliersQueries,
		accountsQueries
	],
	[
		excursionsMutations, 
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
		suppliersResolvers
	)
});
