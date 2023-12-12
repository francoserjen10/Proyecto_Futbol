import { Component } from '@angular/core';
import { Jugador } from 'src/app/interfaces/Jugador';
import { Router } from '@angular/router';
import { JugadorService } from 'src/app/services/jugador.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-nuevo-jugador',
    templateUrl: './nuevo-jugador.component.html',
    styleUrls: ['./nuevo-jugador.component.css'],
})
export class NuevoJugadorComponent {
    //Funcion donde se van a guardar los archivos seleccionados del input de tipo file
    archivos: File[] = [];
    //Creamos atributo nuevoJugador de tipo Jugador(interface) con valores en "";
    nuevoJugador: Jugador = {
        urlImagen: '',
        nombre: '',
        apellido: '',
        fechaDeNacimiento: '',
        club: '',
    };
    //Ruta alternativa de las imagenes para que puedan verse 
    imagesPath = './assets/images/';

    //Inyectamos el servicio creado, el Router, DomSanitizier
    constructor(private jugadorService: JugadorService, private router: Router, private sanitizer: DomSanitizer) { }

    //Metodo donde llamamos al servicio y traemos el metodo agregarJugador() donde almacena los jugadores creados
    agregarJugadores() {
        //Se agrega el jugador creado
        this.jugadorService.createJugador(this.nuevoJugador).subscribe({
            next(player) {
                console.log('Jugador creado:', player);
                alert('Se creó el jugador exitosamente');
            },
            error(err) {
                console.error(err);
                alert('Ocurrió un error al intentar crear el jugador');
            },
        });
        //Al hacer click en el boton "Aceptar", vamos automaticamente al componente jugadores para poder verificar el jugador creado sin la necesidad de tener que navegar manualmente a travez del navbar
        this.router.navigate(['jugadores']);
    };

    // Metodo creado para reiniciar el formulario una vez completado el mismo
    reiniciarFormulario() {
        this.nuevoJugador = {
            urlImagen: '',
            nombre: '',
            apellido: '',
            fechaDeNacimiento: '',
            club: '',
        };
    };

    //Metodo que captura la imagen del input de tipo file
    capturarFile(event: any) {
        //Obtengo el archivo seleccionado por el usuario
        const archivoCapturado = event.target.files[0];
        //Lo guardo en archivos
        this.archivos.push(archivoCapturado);
        //Obtengo solamente el nombre del archivo para no tener fakePath en la url
        const nombreImagen = archivoCapturado.name;
        //Guardo el nombre de ese archivo en la url del jugador
        this.nuevoJugador.urlImagen = nombreImagen;
    };

    //Metodo donde se va a llamar cuando se aprete el boton de subir archivo del input de tipo file
    subirArchivo() {
        try {
            const formularioDeDatos = new FormData();
            this.archivos.forEach(archivo => {
                formularioDeDatos.append('files', archivo)
            });
            this.jugadorService.createImgJugador().subscribe(res => {
                console.log('Respuesta del servidor', res);
            })

        } catch (error) {
            console.log('ERROR', error);
        }
    };
}
