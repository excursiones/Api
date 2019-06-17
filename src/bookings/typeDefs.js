export const bookingsTypeDef = `
type Booking {
    id: Int
    id_user: Int!
    id_excursion: Int!
    id_type: Int!
    cancelled: Boolean
}
input BookingInput {
    id: Int
    id_user: Int!
    id_excursion: Int!
    id_type: Int!
    cancelled: Boolean
} `;

export const bookingsQueries = `
    allReservations: [Booking]!
    allCancelledReservations: [Booking]!
    allUserCancelledReservations(id: Int!): [Booking]!
    allReservationsByUser(id: Int!): [Booking]!
    excursionByDuration(duration: Int!): [Booking]!
    cancelledReservationsByExcursion(id: Int!): [Booking]!
`;

export const bookingsMutations = `
    cancelReservation(id: Int!): Boolean
    createReservation(reservation: BookingInput!): Boolean
    deleteReservation(id: Int!): Boolean
    updateReservation(reservation: BookingInput!): Boolean
`;
