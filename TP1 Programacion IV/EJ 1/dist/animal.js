// Clase Perro que implementa la interfaz Animal
var Perro = /** @class */ (function () {
    function Perro() {
    }
    Perro.prototype.hacerSonido = function () {
        console.log("Guau!");
    };
    Perro.prototype.moverse = function () {
        console.log("El perro corre");
    };
    return Perro;
}());
// Ejemplo de uso
var miPerro = new Perro();
miPerro.hacerSonido(); // Imprime: "Guau!"
miPerro.moverse(); // Imprime: "El perro corre"
