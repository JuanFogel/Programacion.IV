// Interfaz Animal
interface Animal {
    hacerSonido(): void;
    moverse(): void;
}

// Clase Perro que implementa la interfaz Animal
class Perro implements Animal {
    hacerSonido(): void {
        console.log("Guau!");
    }

    moverse(): void {
        console.log("El perro corre");
    }
}

// Ejemplo de uso
const miPerro = new Perro();
miPerro.hacerSonido(); // Imprime: "Guau!"
miPerro.moverse();     // Imprime: "El perro corre"
