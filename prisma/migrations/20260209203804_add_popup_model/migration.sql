-- CreateTable
CREATE TABLE "popups" (
    "id" TEXT NOT NULL,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT,
    "message_tr" TEXT NOT NULL,
    "message_en" TEXT,
    "type" TEXT NOT NULL DEFAULT 'modal',
    "link_url" TEXT,
    "link_text_tr" TEXT,
    "link_text_en" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popups_pkey" PRIMARY KEY ("id")
);
