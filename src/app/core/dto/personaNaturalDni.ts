export class PersonaNaturalDni {
  nombres: string = ""
  apellidos: string = ""
  apellidoPaterno: string = ""
  apellidoMaterno: string = ""
  nombrePadre: string[] = []
  nombreMadre: string[] = []
}

// export class RequestValidateData{

//   tipoDocumento!: string;
//   nroDocumento!: string;
//   nombrePadre !: string;
//   nombreMadre !: string;
//   fechaNacimiento !:Date;
//   codigoVerifi !: string;
//   correo!: string;
// }

export class RequestValidateData{
  tipoDocumento !: string ;
  dni !: number;
  nroDocumento !: number;
  nombrePadre !: string;
  nombreMadre !: string;
  fechaNacimiento !:Date;
  codigoVerifi !: string;
  correo!: string;
}




export class ResponseValidateData{
  status !: boolean;
  mensaje !: string;
}


export class ObtenerDatosPersonaDniDto {
  dni!: string;
  recaptcha !: string;
}