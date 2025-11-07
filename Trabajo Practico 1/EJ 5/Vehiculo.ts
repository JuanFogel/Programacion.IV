export abstract class Vehiculo {
  constructor(
    public marca: string,
    public modelo: string,
    public anio: number
  ) {}

  abstract arrancar(): void;
  abstract frenar(): void;

  obtenerInfo(): string {
    return `${this.marca} ${this.modelo} (${this.anio})`;
  }
}