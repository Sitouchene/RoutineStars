-- Ajouter le champ genres au modèle Book
ALTER TABLE "books" ADD COLUMN "genres" TEXT[] DEFAULT '{}';
