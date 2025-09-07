import { Vehiculo } from "./Vehiculo";
import { Electrico } from "./Interface_Electrico";

export class Auto extends Vehiculo implements Electrico {
  private color: string;
  private bateriaCargada: boolean = false;

  constructor(marca: string, modelo: string, color: string) {
    super(marca, modelo);
    this.color = color;
  }

  public override arrancar(): string {
    if (!this.bateriaCargada) {
      return `El auto ${this.marca} ${this.modelo} (${this.color}) no puede arrancar porque la batería está descargada.`;
    }
    return `El auto ${this.marca} ${this.modelo} (${this.color}) arranco.`;
  }

  public override detener(): string {
    return `El auto ${this.marca} ${this.modelo} se detuvo.`;
  }

  public cargarBateria(): string {
    this.bateriaCargada = true;
    return `El auto ${this.marca} ${this.modelo} cargo la bateria.`;
  }

}
