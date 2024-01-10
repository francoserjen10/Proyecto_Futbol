import { PlayerPayment } from "./player-payment";

export interface Jugador {
    id?: number,
    urlImagen: any,
    nombre: string,
    apellido: string,
    fechaDeNacimiento: string,
    club: string,
    payments?: PlayerPayment[],
    pay?: boolean,
}
