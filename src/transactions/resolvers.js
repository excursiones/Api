import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    allCompanyPayments: (_) =>
      getRequest(`${URL}/company_payments`, '').then(response => response['Companies payments']),
    allUserPayments: (_) =>
      getRequest(`${URL}/user_payments`, '').then(response => response['Users payments'])
    },
  
  Mutation: {
    createCompanyPayment: function(_, { company_payment }){
      var data = {} 
      data.company_payment = company_payment
      generalRequest(`${URL}/company_payments/`, 'POST', data)

    },
    createUserPayment: function (_, { user_payment }) {
      var data = {}
      data.user_payment = user_payment
      generalRequest(`${URL}/user_payments/`, 'POST', data)
    }
  }
  
};

export default resolvers;
