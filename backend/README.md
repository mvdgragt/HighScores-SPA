# highscores

### Beskrivning
I denna obligatoriska inlämningsuppgift visar du att du besitter kunskap om hur man använder en relationsdatabas för att hantera data för en webbapplikation.

### Begränsningar
* Express ska användas.
* Datalagring
* PostgreSQL ska användas.
* ORM får INTE användas.
* I det fall det finns relationer mellan tabeller, ska foreign key användas.
* Samtliga tabeller ska ha primärnyckel.
* Filen .\data\highscore.sql ska finnas och innehålla all nödvändig DDL för att  sätta upp tabeller applikationen använder.

### Kom igång
#### Följ instruktionerna nedan för att komma igång.
1. Generera inledande projektfiler:
   npx express-generator --view=ejs --git highscore


#### Följ instruktionerna som visas när generatorn är klar.

2. Installera och ställ in nodemon (valfritt):
   npm install -D nodemon


#### Glöm inte uppdatera package.json (script).

3. Skapa .\data\highscore.sql - lägg DDL-satser du tar fram för att skapa tabeller här.
