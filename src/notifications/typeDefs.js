export const notificactionsTypeDefs = `
    type notificationType {
        id:Int!
        fecha: String!
        activa: Int!
        motivo: String!
        id_usuario: Int!
        id_excursion: Int!
    }

    input createNotificationInput {
        fecha: String!
        activa: Int!
        motivo: String!
        id_usuario: Int
        id_excursion: Int!
    }
`

export const notificationsMutations = `
createNotification(notification: createNotificationInput!): String
`

export const notificationsQueries = `
getUserNotifications(user_id: Int!): [notificationType]!
`