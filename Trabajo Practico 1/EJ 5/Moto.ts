import { Vehiculo } from "./Vehiculo";

export class Moto extends Vehiculo {
  private cilindrada: number;
  constructor(
    marca: string,
    modelo: string,
    anio: number,
    cilindrada: number
  ) {
    super(marca, modelo, anio);
    if (cilindrada <=50) {
      throw new Error("La cilindrada debe ser mayor a 50.");
    }
    this.cilindrada = cilindrada;
  }

  arrancar(): void {
    console.log(`${this.marca} ${this.modelo} encendida.`);
  }

  frenar(): void {
    console.log(`${this.marca} ${this.modelo} se detuvo.`);
  }

  hacerWeelie(): void {
    console.log("La moto está haciendo weelie");
  }
}