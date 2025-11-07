import { Vehiculo } from "./Vehiculo";
import { Electrico } from "./Interface_Electrico";

export class Auto extends Vehiculo implements Electrico {
  private bateria: number = 100;

  constructor(marca: string, modelo: string, anio: number) {
    super(marca, modelo, anio);
  }

  arrancar(): void {
    console.log(`${this.marca} ${this.modelo} arranco.`);
  }

  frenar(): void {
    console.log(`${this.marca} ${this.modelo} se detuvo.`);
  }

  cargarBateria(): void {
    this.bateria = 100;
    console.log("Bateria cargada completamente.");
  }

  nivelBateria(): number {
    return this.bateria;
  }
}