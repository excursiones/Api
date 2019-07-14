import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';
import { getUserInfo } from '../authorization/getUserInfo';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    allCompanyPayments: (_, { }, ctx) =>
      getUserInfo(ctx).then(user => {
        if (user.type && (user.type[0] == "500"))
          return getRequest(`${URL}/company_payments`, '').then(response => response['Companies payments']);
        return user
      }).catch(err => err)
    ,
    allUserPayments: (_, { }, ctx) =>
      getRequest(`${URL}/user_payments`, '').then(response => response['Users payments'])
  },

  Mutation: {

    createCompanyPayment: function (_, { company_payment }, ctx) {
      var data = {}
      data.company_payment = company_payment
      return getUserInfo(ctx).then(user => {
        if (user.type && (user.type[0] == "500"))
          return generalRequest(`${URL}/company_payments/`, 'POST', data);
        return user
      }).catch(err => err)

    },
    createUserPayment: function (_, { user_payment }, ctx) {
      var data = {}
      data.user_payment = user_payment
      generalRequest(`${URL}/user_payments/`, 'POST', data)
    }
  }

};

export default resolvers;
