import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, tokenValidationEntryPoint } from './server';
const URL = `http://${url}:${port}/${entryPoint}`;

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
		login: async (_, { credentials }) => {
			let pass = decrypt(credentials.password);
			credentials.password = pass;
			try {
				let res = await generalRequest(`${URL}`, 'POST', credentials)
				if (res) {
					if (res === 'LDAPException found') {// Toca mirar el codigo de status
						return res
					} else {
						// return res;
						return token
					}
				} else {
					return -1
				}
			} catch (err) {
				console.log(err)
			}
		}
	}
};

export default resolvers;
