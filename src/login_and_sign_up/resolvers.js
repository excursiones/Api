import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, signUpEntryPoint } from './server';
var jwt = require('jsonwebtoken')
const URL = `http://${url}:${port}/${entryPoint}`;
const signUpURL = `http://${url}:${port}/${signUpEntryPoint}`;

const crypto = require('crypto'),
	algorithm = 'aes-256-ctr',
	password = 'd6F3Efeq';

function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password)
	var dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
}
const resolvers = {
	Query: {
	},
	Mutation: {
		sign_in: async (_, { signInCredentials }) => {
			try {
				let res = await generalRequest(`${URL}`, 'POST', signInCredentials)
				if (res) {
					console.log(res);

					return res;
				} else {
					return -1
				}
			} catch (err) {
				console.log(err)
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

export default resolvers;
