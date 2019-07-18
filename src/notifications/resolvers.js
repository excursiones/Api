import { generalRequest, getRequest } from '../utilities';
import { getUserInfo } from '../authorization/getUserInfo';
import { url, port, entryPoint } from "./server";

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
    Query: {
        getUserNotifications: (_, { user_id }, ctx) =>
            generalRequest(`${URL}/usuario/${user_id}`, 'GET')

    },

    Mutation: {
        createNotification: (_, { notification }, ctx) =>
            generalRequest(`${URL}`, 'POST', notification)
                .then(res => {
                    console.log(res)
                    return res.insertId
                }
                ).catch(err => console.log(err))
    }
}

export default resolvers;