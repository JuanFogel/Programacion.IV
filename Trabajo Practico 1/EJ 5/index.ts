import { Auto } from "./Auto";
import { Moto } from "./Moto";
import { Vehiculo } from "./Vehiculo";

const miAuto = new Auto("Ford", "Focus", "Blanco");
console.log(miAuto.cargarBateria());
console.log(miAuto.arrancar());
console.log(miAuto.detener());

const miMoto = new Moto("Honda", "CRF", 250);
console.log(miMoto.arrancar());
console.log(miMoto.detener());

const miVehiculoElectrico: Vehiculo = new Auto("Ford", "Mustang E", "Azul");

if (miVehiculoElectrico instanceof Auto) {
  console.log(miVehiculoElectrico.cargarBateria());
  console.log(miVehiculoElectrico.arrancar());
  console.log(miVehiculoElectrico.detener());
}
