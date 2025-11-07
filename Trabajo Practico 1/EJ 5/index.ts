import { Auto } from "./Auto";
import { Moto } from "./Moto";

const tesla = new Auto("Tesla", "Model 3", 2024);
const yamaha = new Moto("Yamaha", "FZ", 2023, 150);
const ford = new Auto("Ford", "Focus", 2018);

console.log("\n=== INFO ===");
console.log(tesla.obtenerInfo());
console.log(ford.obtenerInfo());
console.log(yamaha.obtenerInfo());

console.log("\n=== AUTO ===");
tesla.arrancar();
tesla.cargarBateria();
console.log("Nivel de bateria:", tesla.nivelBateria());
tesla.frenar();

console.log("\n=== MOTO ===");
yamaha.arrancar();
yamaha.hacerWeelie();
yamaha.frenar();