/*
  Warnings:

  - A unique constraint covering the columns `[category_id,name]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_category_id_name_key" ON "services"("category_id", "name");
