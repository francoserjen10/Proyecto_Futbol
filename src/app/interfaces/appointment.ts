import { Jugador } from "./Jugador";

export interface Appointment  {
    appointmentPlayers: Jugador[],
    appointmentStartDate: string,
    appointmentStartTime: string,
    appointmentEndTime: string,
    id?: number,
} 