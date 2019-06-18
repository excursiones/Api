import { generalRequest, getRequest } from '../utilities';
const jwt = require('jsonwebtoken');
import { tokenValidationEntryPoint, port, url } from "./server";



const TVEP_URL = `http://${url}:${port}/${tokenValidationEntryPoint}`;

const getUserInfo = async (_, token) => {
    try {
        let validated = await generalRequest(`${TVEP_URL}`, 'GET', token)
        console.log(validated);
        if (validated) {
            if (validated == 200) {
                payload = jwt.decode(token, { json: true });
                return payload;
            }
            else
                return validated;
        } else {
            return -1;
        }
    } catch (error) {

    }
}


export default getUserInfo;