const myArray = [
  { MARQUE: "Nike" },
  { TAILLE: "44" },
  { ETAT: "Comme Neuf" },
  { COULEUR: "Blue" },
  { EMPLACEMENT: "Paris" },
];
console.log(myArray[0]);

myArray.splice(2, 1, { key_test: "value_test" });

console.log(myArray);
const fruits = ["Banana", "Orange", "Apple", "Mango"];

fruits.splice(2, 0, "Lemon", "Kiwi");
console.log(fruits);

const fruits2 = ["Banana", "Orange", "Apple", "Mango", "Kiwi"];
fruits2.splice(2, 2);
console.log(fruits2);
