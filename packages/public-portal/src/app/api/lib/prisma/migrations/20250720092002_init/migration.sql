-- CreateEnum
CREATE TYPE "tefillin_status" AS ENUM ('with_scribe', 'with_checker', 'in_transit', 'at_center', 'at_location', 'assigned', 'distributed');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'location_rabbi', 'inventory_manager', 'soldier', 'viewer', 'manager');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'pending');

-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('photo', 'video');

-- CreateEnum
CREATE TYPE "soldierstatus" AS ENUM ('registered', 'approved', 'paid', 'scheduled', 'received','rejected');

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR(255),
    "city" VARCHAR(255),
    "street" VARCHAR(255),
    "house_number" VARCHAR(50),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "rabbi_id" UUID,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "calendarid" VARCHAR(255),
    "isactive" BOOLEAN DEFAULT true,
    "address_id" INTEGER,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soldier_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "soldier_id" UUID,
    "previous_status" TEXT,
    "new_status" TEXT NOT NULL,
    "notes" TEXT,
    "changed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "soldier_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soldiers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mothers_name" TEXT,
    "dominant_hand" TEXT NOT NULL,
    "form_filler_name" TEXT,
    "form_filler_phone" TEXT,
    "form_filler_relationship" TEXT,
    "location_id" UUID,
    "tefillin_id" UUID,
    "last_contact_date" TIMESTAMPTZ(6),
    "next_contact_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_status" "soldierstatus",

    CONSTRAINT "soldiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tefillin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "barcode" VARCHAR(255) NOT NULL,
    "status" "tefillin_status" NOT NULL,
    "checkername" VARCHAR(255),
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "donorid" VARCHAR(255),
    "donorname" VARCHAR(255),
    "inmemoryof" VARCHAR(255),
    "locationId" UUID,
    "parchmentimageurls" JSON,
    "productiondate" DATE,
    "scribename" VARCHAR(255),
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tefillin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "role" "user_role" NOT NULL,
    "status" "user_status" DEFAULT 'active',
    "profile_image_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "google_id" TEXT,
    "last_login" TIMESTAMP(6),
    "token" TEXT,
    "google_refresh_token" TEXT,
    "location_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "donor_name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "dedication" TEXT,
    "payment_status" TEXT DEFAULT 'pending',
    "payment_id" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "donation_id" UUID,
    "donation_type" TEXT NOT NULL,
    "product_id" UUID,
    "quantity" INTEGER,
    "amount" DECIMAL(10,2),
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributions_photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tefillin_id" UUID NOT NULL,
    "soldier_id" UUID NOT NULL,
    "location_id" UUID,
    "date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "drive_url" TEXT NOT NULL,
    "description" TEXT,
    "type" "media_type" NOT NULL,
    "is_publishable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "distributions_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from_role" "user_role" NOT NULL,
    "to_role" "user_role" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid()
);

-- CreateTable
CREATE TABLE "tefillin_photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tefillin_id" UUID NOT NULL,
    "file_id" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "tefillin_status" "tefillin_status" NOT NULL DEFAULT 'with_scribe',

    CONSTRAINT "tefillin_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_locations_name" ON "locations"("name");

-- CreateIndex
CREATE INDEX "idx_locations_rabbi_id" ON "locations"("rabbi_id");

-- CreateIndex
CREATE UNIQUE INDEX "soldiers_email_key" ON "soldiers"("email");

-- CreateIndex
CREATE INDEX "idx_barcode" ON "tefillin"("barcode");

-- CreateIndex
CREATE INDEX "idx_status" ON "tefillin"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_token_key" ON "users"("token");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "fk_locations_rabbi" FOREIGN KEY ("rabbi_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "soldier_status_history" ADD CONSTRAINT "soldier_status_history_soldier_id_fkey" FOREIGN KEY ("soldier_id") REFERENCES "soldiers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "soldiers" ADD CONSTRAINT "soldiers_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "soldiers" ADD CONSTRAINT "soldiers_tefillin_id_fkey" FOREIGN KEY ("tefillin_id") REFERENCES "tefillin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tefillin" ADD CONSTRAINT "fk_location" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donation_items" ADD CONSTRAINT "donation_items_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donation_items" ADD CONSTRAINT "donation_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributions_photos" ADD CONSTRAINT "fk_location" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributions_photos" ADD CONSTRAINT "fk_soldier" FOREIGN KEY ("soldier_id") REFERENCES "soldiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributions_photos" ADD CONSTRAINT "fk_tefillin" FOREIGN KEY ("tefillin_id") REFERENCES "tefillin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tefillin_photos" ADD CONSTRAINT "fk_tefillin" FOREIGN KEY ("tefillin_id") REFERENCES "tefillin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
