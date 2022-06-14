export const TipoDocumento_DNI = 'DNI'
export const Condicion_Persona_Juridica = 'j'
export const Condicion_Persona_Natural = 'n'

export class TipoDocumento {
  codigo: string = "";
  nombre: string = "";
  public toString = () => {
    return this.nombre
  }
}

export class Condicion {
  codigo: string = "";
  nombre: string = "";
}

export class Cargo {
  codigo: string = "";
  nombre: string = "";
}
