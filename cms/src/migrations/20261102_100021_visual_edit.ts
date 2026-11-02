import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_layout_style" AS ENUM('standard', 'wide', 'image-left', 'cover');
  CREATE TYPE "public"."enum__posts_v_version_layout_style" AS ENUM('standard', 'wide', 'image-left', 'cover');
  CREATE TYPE "public"."enum_pages_blocks_hero_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cards_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('auto', '1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_steps_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_text_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_contact_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cta_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_theme_heading_font" AS ENUM('serif', 'sans');
  CREATE TYPE "public"."enum_theme_radius" AS ENUM('none', 'small', 'large');
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"navy" varchar,
  	"navy_deep" varchar,
  	"red" varchar,
  	"ink" varchar,
  	"muted" varchar,
  	"paper" varchar,
  	"heading_font" "enum_theme_heading_font" DEFAULT 'serif',
  	"radius" "enum_theme_radius" DEFAULT 'small',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts" ADD COLUMN "layout_style" "enum_posts_layout_style" DEFAULT 'standard';
  ALTER TABLE "_posts_v" ADD COLUMN "version_layout_style" "enum__posts_v_version_layout_style" DEFAULT 'standard';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_spacing" "enum_pages_blocks_hero_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "appearance_spacing" "enum_pages_blocks_cards_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "appearance_hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "columns" "enum_pages_blocks_cards_columns" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "appearance_spacing" "enum_pages_blocks_steps_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "appearance_hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "appearance_spacing" "enum_pages_blocks_text_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_text" ADD COLUMN "appearance_hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "appearance_spacing" "enum_pages_blocks_contact_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "appearance_hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_bg" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_text" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_spacing" "enum_pages_blocks_cta_appearance_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_hidden" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "theme" CASCADE;
  ALTER TABLE "posts" DROP COLUMN "layout_style";
  ALTER TABLE "_posts_v" DROP COLUMN "version_layout_style";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_hidden";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "appearance_hidden";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "appearance_hidden";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "appearance_hidden";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "appearance_hidden";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_bg";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_text";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_spacing";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_hidden";
  DROP TYPE "public"."enum_posts_layout_style";
  DROP TYPE "public"."enum__posts_v_version_layout_style";
  DROP TYPE "public"."enum_pages_blocks_hero_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_cards_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  DROP TYPE "public"."enum_pages_blocks_steps_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_text_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_contact_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_cta_appearance_spacing";
  DROP TYPE "public"."enum_theme_heading_font";
  DROP TYPE "public"."enum_theme_radius";`)
}
