export class requestGlobal{
    correoElectronico !: string;
    numeroCelular!: string;
    telefono!: string;
    domicilioFisico!: string;
    nombres!: string;
    apePaterno !: string;
    apeMaterno !: string;
    tipoDocumento!: string;
    numeroDocumento!: string;
    razonSocial!: string;
    file!: File;

    TipoPersona !: string;
    paginaWeb !: string;
    representante : RequestRepresentante = new RequestRepresentante();
    departamento!: string;
    provincia!: string;
    distrito!: string;
}


export class RequestPersonaNatural{
    tipoDocumento!: string;
    numeroDocumento!: string;
    apePaterno !: string;
    apeMaterno !: string;
    nombres!: string;
    nombrePadre!: string;
    nombreMadre!: string;
    fechaNacimento!: Date;
    digitoVerificacion!: string;
    correoElectronico!: string;
    numeroCelular!: string;
    // departamento!: string;
    // provincia!: string;
    // distrito!: string;
    domicilioFisico!: string;
}



export class RequestPersonaJuridica{
    tipoDocumento!: string;
    numeroDocumento!: string;
    razonSocial!: string;
    correoElectronico!: string;
    telefono!: string;
    // departamento!: string;
    // provincia!: string;
    // distrito!: string;
    direccion!: string;
    paginaWeb!: string;
}

export class RequestRepresentante{
    tipoDocumentoAdjunto!: string;
    tipoDocumentoAdjuntoNombre!: string;
   // documentoArchivo: ['', Validators.required],
    tipoDocumento!: string;
    numeroDocumento!: string;
    nombreCompleto !: string;
    correoElectronico!: string;
    numeroCelular!: string;
    domicilioFisico!: string;
    cargo!: string;
    cargoNombre!: string;
    file!: File;
    // departamento !: string;
    // provincia !: string;
    // distrito !: string;
    ubigeo !: string;
}

export class RequestTerminos{
    terminosCondiciones!: boolean;
    politicasDatos!: boolean;
}