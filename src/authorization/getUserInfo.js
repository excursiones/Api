import { generalRequest, getRequest } from '../utilities';
import { tokenValidationEntryPoint, port, url } from "./server";
const jwt = require('jsonwebtoken');

const TVEP_URL = `http://${url}:${port}/${tokenValidationEntryPoint}`;

const SKIP_AUTH = true; 

export const getUserInfo = async (token) => {
    if(SKIP_AUTH) {
        return new Promise((resolve, reject) => {
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
}

export const unauthorizedError = (code) => {
    throw new ApolloError("Forbidden", code);
};
