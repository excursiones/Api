export const reservationsTypeDef = `
type Reservation {    
    Id: Int!
    User_id: String!
    Excursion_id: String!
    Type_id: String!
    Cancelled: Boolean! 
    Created_at: String!
}
input ReservationInput {    
    User_id: String!
    Excursion_id: String!
    Type_id: String!
    Cancelled: Boolean!     
}`;

export const reservationsQueries = `
    allReservations: [Reservation]!
    reservationsByUserId(User_id: String!): [Reservation]!
    
`;

export const reservationsMutations = `
    createReservation(reservation: ReservationInput!): Reservation!
    deleteReservation(id: Int!): Int!
    updateReservation(id: Int!, reservation: ReservationInput!): Reservation!
`;
