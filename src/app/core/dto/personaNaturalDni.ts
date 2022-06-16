export class PersonaNaturalDni {
  nombres: string = ""
  apellidos: string = ""
  nombrePadre: string[] = []
  nombreMadre: string[] = []
}

export class RequestValidateData{

  dni !: number;
  nombrePadre !: string;
  nombreMadre !: string;
  fechaNacimiento !:Date;
  codigoVerifi !: string;
}


export class ResponseValidateData{
  status !: boolean;
  mensaje !: string;
}
