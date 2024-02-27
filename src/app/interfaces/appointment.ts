export interface Appointment {
    appointmentPlayers: {
        playerId: number, moneyPaid?: number, attended: boolean
    }[],
    appointmentStartDate: string,
    appointmentStartTime: string,
    appointmentEndTime: string,
    id?: number,
}
