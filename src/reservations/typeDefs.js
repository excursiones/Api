export const reservationsTypeDef = `
type Reservation {    
    id: Int
    id_user: String
    id_excursion: String
    id_type: String
    cancelled: Boolean 
    created_at: String
}
input ReservationInput {    
    id_user: String
    id_excursion: String
    id_type: String
    cancelled: Boolean     
}`;

export const reservationsQueries = `
    allReservations: [Reservation]
    reservationsByUserId(User_id: String!): [Reservation]
`;

export const reservationsMutations = `
    createReservation(reservation: ReservationInput!): Reservation
    deleteReservation(id: Int!): Int
    updateReservation(id: Int!, reservation: ReservationInput!): Reservation
`;
