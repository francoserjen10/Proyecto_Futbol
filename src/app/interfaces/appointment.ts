export interface Appointment {
    appointmentPlayers: [{
        moneyPaid?: number, playerId: number, attended: boolean
    }]
    appointmentStartDate: string,
    appointmentStartTime: string,
    appointmentEndTime: string,
    id?: number,
}

















