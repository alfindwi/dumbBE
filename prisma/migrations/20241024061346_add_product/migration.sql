-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "product_name" TEXT NOT NULL,
    "product_desc" TEXT,
    "price" TEXT,
    "stok" TEXT,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);
