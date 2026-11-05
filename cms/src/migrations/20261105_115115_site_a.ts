import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_doc_status" AS ENUM('sap-hieu-luc', 'da-hieu-luc', 'du-thao');
  CREATE TYPE "public"."enum_posts_doc_field" AS ENUM('doanh-nghiep', 'dau-tu', 'thue', 'lao-dong', 'dat-dai', 'cong-nghe');
  CREATE TYPE "public"."enum__posts_v_version_doc_status" AS ENUM('sap-hieu-luc', 'da-hieu-luc', 'du-thao');
  CREATE TYPE "public"."enum__posts_v_version_doc_field" AS ENUM('doanh-nghiep', 'dau-tu', 'thue', 'lao-dong', 'dat-dai', 'cong-nghe');
  CREATE TYPE "public"."enum_pages_blocks_hero_ask_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_intro_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_services_items_icon" AS ENUM('shield', 'board', 'doc', 'chart', 'deal', 'chip');
  CREATE TYPE "public"."enum_pages_blocks_services_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_special_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_projects_teaser_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_projects_list_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_step_cards_items_accent" AS ENUM('navy', 'red', 'green');
  CREATE TYPE "public"."enum_pages_blocks_step_cards_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_step_list_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_items_icon" AS ENUM('shield', 'board', 'doc', 'chart', 'deal', 'chip');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_items_accent" AS ENUM('navy', 'red', 'green');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_news_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_service_detail_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_service_detail_icon" AS ENUM('shield', 'board', 'doc', 'chart', 'deal', 'chip');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_appearance_spacing" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_projects_field" AS ENUM('blockchain', 'ai', 'fintech', 'ecommerce', 'real-estate', 'other');
  CREATE TYPE "public"."enum_projects_role" AS ENUM('dau-tu', 'ho-tro', 'tu-van');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_posts_topic" ADD VALUE 'm-a';
  ALTER TYPE "public"."enum_posts_topic" ADD VALUE 'startup';
  ALTER TYPE "public"."enum_posts_topic" ADD VALUE 'blockchain';
  ALTER TYPE "public"."enum_posts_topic" ADD VALUE 'ai';
  ALTER TYPE "public"."enum__posts_v_version_topic" ADD VALUE 'm-a';
  ALTER TYPE "public"."enum__posts_v_version_topic" ADD VALUE 'startup';
  ALTER TYPE "public"."enum__posts_v_version_topic" ADD VALUE 'blockchain';
  ALTER TYPE "public"."enum__posts_v_version_topic" ADD VALUE 'ai';
  CREATE TABLE "pages_blocks_hero_ask_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_ask" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_hero_ask_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"headline" varchar NOT NULL,
  	"sub" varchar,
  	"primary_label" varchar,
  	"primary_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"image_id" integer,
  	"ask_eyebrow" varchar,
  	"ask_title" varchar,
  	"disclaimer" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_page_hero_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"title" varchar NOT NULL,
  	"lead" varchar,
  	"primary_label" varchar,
  	"primary_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_intro_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_services_items_icon" DEFAULT 'shield',
  	"title" varchar,
  	"text" varchar,
  	"bullets" varchar,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_services_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"more_label" varchar,
  	"more_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_special_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_special" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_special_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_projects_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_projects_teaser_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"count" numeric DEFAULT 3,
  	"more_label" varchar,
  	"more_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_projects_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_projects_list_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"show_featured" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_step_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"accent" "enum_pages_blocks_step_cards_items_accent" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_step_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_step_cards_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_step_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_step_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_step_list_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_cards_items_icon" DEFAULT 'shield',
  	"title" varchar,
  	"text" varchar,
  	"accent" "enum_pages_blocks_feature_cards_items_accent" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_feature_cards_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"more_label" varchar,
  	"more_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_news_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"count" numeric DEFAULT 3,
  	"topics_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_service_detail_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"icon" "enum_pages_blocks_service_detail_icon" DEFAULT 'shield',
  	"title" varchar,
  	"text" varchar,
  	"situation" varchar,
  	"items" varchar,
  	"deliverables" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_faq_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_bg" varchar,
  	"appearance_text" varchar,
  	"appearance_spacing" "enum_pages_blocks_cta_band_appearance_spacing" DEFAULT 'normal',
  	"appearance_hidden" boolean DEFAULT false,
  	"title" varchar,
  	"lead" varchar,
  	"dark" boolean DEFAULT false,
  	"primary_label" varchar,
  	"primary_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"cover_id" integer,
  	"field" "enum_projects_field" DEFAULT 'other',
  	"role" "enum_projects_role" DEFAULT 'tu-van',
  	"url" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"status" "enum_projects_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"field_label" varchar,
  	"summary" varchar,
  	"stage" varchar,
  	"support" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts" ADD COLUMN "doc_status" "enum_posts_doc_status";
  ALTER TABLE "posts" ADD COLUMN "doc_field" "enum_posts_doc_field";
  ALTER TABLE "posts" ADD COLUMN "doc_number" varchar;
  ALTER TABLE "posts" ADD COLUMN "issued_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "effective_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "source_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_doc_status" "enum__posts_v_version_doc_status";
  ALTER TABLE "_posts_v" ADD COLUMN "version_doc_field" "enum__posts_v_version_doc_field";
  ALTER TABLE "_posts_v" ADD COLUMN "version_doc_number" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_issued_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_effective_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_source_url" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "pages_blocks_hero_ask_suggestions" ADD CONSTRAINT "pages_blocks_hero_ask_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_ask"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_ask" ADD CONSTRAINT "pages_blocks_hero_ask_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_ask" ADD CONSTRAINT "pages_blocks_hero_ask_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_items" ADD CONSTRAINT "pages_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_special_items" ADD CONSTRAINT "pages_blocks_special_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_special"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_special" ADD CONSTRAINT "pages_blocks_special_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_projects_teaser" ADD CONSTRAINT "pages_blocks_projects_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_projects_list" ADD CONSTRAINT "pages_blocks_projects_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_cards_items" ADD CONSTRAINT "pages_blocks_step_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_step_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_cards" ADD CONSTRAINT "pages_blocks_step_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_list_items" ADD CONSTRAINT "pages_blocks_step_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_step_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_list" ADD CONSTRAINT "pages_blocks_step_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_items" ADD CONSTRAINT "pages_blocks_feature_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news" ADD CONSTRAINT "pages_blocks_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_detail" ADD CONSTRAINT "pages_blocks_service_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_ask_suggestions_order_idx" ON "pages_blocks_hero_ask_suggestions" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_ask_suggestions_parent_id_idx" ON "pages_blocks_hero_ask_suggestions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_ask_suggestions_locale_idx" ON "pages_blocks_hero_ask_suggestions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_ask_order_idx" ON "pages_blocks_hero_ask" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_ask_parent_id_idx" ON "pages_blocks_hero_ask" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_ask_path_idx" ON "pages_blocks_hero_ask" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_ask_locale_idx" ON "pages_blocks_hero_ask" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_ask_image_idx" ON "pages_blocks_hero_ask" USING btree ("image_id");
  CREATE INDEX "pages_blocks_page_hero_order_idx" ON "pages_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_parent_id_idx" ON "pages_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_path_idx" ON "pages_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_hero_locale_idx" ON "pages_blocks_page_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_intro_order_idx" ON "pages_blocks_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_parent_id_idx" ON "pages_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_path_idx" ON "pages_blocks_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_intro_locale_idx" ON "pages_blocks_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_items_order_idx" ON "pages_blocks_services_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_items_parent_id_idx" ON "pages_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_items_locale_idx" ON "pages_blocks_services_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_locale_idx" ON "pages_blocks_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_special_items_order_idx" ON "pages_blocks_special_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_special_items_parent_id_idx" ON "pages_blocks_special_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_special_items_locale_idx" ON "pages_blocks_special_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_special_order_idx" ON "pages_blocks_special" USING btree ("_order");
  CREATE INDEX "pages_blocks_special_parent_id_idx" ON "pages_blocks_special" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_special_path_idx" ON "pages_blocks_special" USING btree ("_path");
  CREATE INDEX "pages_blocks_special_locale_idx" ON "pages_blocks_special" USING btree ("_locale");
  CREATE INDEX "pages_blocks_projects_teaser_order_idx" ON "pages_blocks_projects_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_projects_teaser_parent_id_idx" ON "pages_blocks_projects_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_projects_teaser_path_idx" ON "pages_blocks_projects_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_projects_teaser_locale_idx" ON "pages_blocks_projects_teaser" USING btree ("_locale");
  CREATE INDEX "pages_blocks_projects_list_order_idx" ON "pages_blocks_projects_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_projects_list_parent_id_idx" ON "pages_blocks_projects_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_projects_list_path_idx" ON "pages_blocks_projects_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_projects_list_locale_idx" ON "pages_blocks_projects_list" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_cards_items_order_idx" ON "pages_blocks_step_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_cards_items_parent_id_idx" ON "pages_blocks_step_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_cards_items_locale_idx" ON "pages_blocks_step_cards_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_cards_order_idx" ON "pages_blocks_step_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_cards_parent_id_idx" ON "pages_blocks_step_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_cards_path_idx" ON "pages_blocks_step_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_step_cards_locale_idx" ON "pages_blocks_step_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_list_items_order_idx" ON "pages_blocks_step_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_list_items_parent_id_idx" ON "pages_blocks_step_list_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_list_items_locale_idx" ON "pages_blocks_step_list_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_list_order_idx" ON "pages_blocks_step_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_list_parent_id_idx" ON "pages_blocks_step_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_list_path_idx" ON "pages_blocks_step_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_step_list_locale_idx" ON "pages_blocks_step_list" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_cards_items_order_idx" ON "pages_blocks_feature_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_items_parent_id_idx" ON "pages_blocks_feature_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_items_locale_idx" ON "pages_blocks_feature_cards_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_cards_order_idx" ON "pages_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_parent_id_idx" ON "pages_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_path_idx" ON "pages_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_cards_locale_idx" ON "pages_blocks_feature_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_news_order_idx" ON "pages_blocks_news" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_parent_id_idx" ON "pages_blocks_news" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_path_idx" ON "pages_blocks_news" USING btree ("_path");
  CREATE INDEX "pages_blocks_news_locale_idx" ON "pages_blocks_news" USING btree ("_locale");
  CREATE INDEX "pages_blocks_service_detail_order_idx" ON "pages_blocks_service_detail" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_detail_parent_id_idx" ON "pages_blocks_service_detail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_detail_path_idx" ON "pages_blocks_service_detail" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_detail_locale_idx" ON "pages_blocks_service_detail" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_locale_idx" ON "pages_blocks_cta_band" USING btree ("_locale");
  CREATE INDEX "projects_logo_idx" ON "projects" USING btree ("logo_id");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_ask_suggestions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_ask" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_special_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_special" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_projects_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_projects_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_step_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_step_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_step_list_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_step_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_detail" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_band" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_ask_suggestions" CASCADE;
  DROP TABLE "pages_blocks_hero_ask" CASCADE;
  DROP TABLE "pages_blocks_page_hero" CASCADE;
  DROP TABLE "pages_blocks_intro" CASCADE;
  DROP TABLE "pages_blocks_services_items" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_special_items" CASCADE;
  DROP TABLE "pages_blocks_special" CASCADE;
  DROP TABLE "pages_blocks_projects_teaser" CASCADE;
  DROP TABLE "pages_blocks_projects_list" CASCADE;
  DROP TABLE "pages_blocks_step_cards_items" CASCADE;
  DROP TABLE "pages_blocks_step_cards" CASCADE;
  DROP TABLE "pages_blocks_step_list_items" CASCADE;
  DROP TABLE "pages_blocks_step_list" CASCADE;
  DROP TABLE "pages_blocks_feature_cards_items" CASCADE;
  DROP TABLE "pages_blocks_feature_cards" CASCADE;
  DROP TABLE "pages_blocks_news" CASCADE;
  DROP TABLE "pages_blocks_service_detail" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "posts" ALTER COLUMN "topic" SET DATA TYPE text;
  DROP TYPE "public"."enum_posts_topic";
  CREATE TYPE "public"."enum_posts_topic" AS ENUM('dau-tu', 'thue', 'quan-tri-dn', 'rui-ro', 'giay-phep', 'lao-dong', 'hop-dong', 'tuan-thu');
  ALTER TABLE "posts" ALTER COLUMN "topic" SET DATA TYPE "public"."enum_posts_topic" USING "topic"::"public"."enum_posts_topic";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_topic" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_version_topic";
  CREATE TYPE "public"."enum__posts_v_version_topic" AS ENUM('dau-tu', 'thue', 'quan-tri-dn', 'rui-ro', 'giay-phep', 'lao-dong', 'hop-dong', 'tuan-thu');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_topic" SET DATA TYPE "public"."enum__posts_v_version_topic" USING "version_topic"::"public"."enum__posts_v_version_topic";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "posts" DROP COLUMN "doc_status";
  ALTER TABLE "posts" DROP COLUMN "doc_field";
  ALTER TABLE "posts" DROP COLUMN "doc_number";
  ALTER TABLE "posts" DROP COLUMN "issued_at";
  ALTER TABLE "posts" DROP COLUMN "effective_at";
  ALTER TABLE "posts" DROP COLUMN "source_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_doc_status";
  ALTER TABLE "_posts_v" DROP COLUMN "version_doc_field";
  ALTER TABLE "_posts_v" DROP COLUMN "version_doc_number";
  ALTER TABLE "_posts_v" DROP COLUMN "version_issued_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_effective_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_source_url";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "eyebrow";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_posts_doc_status";
  DROP TYPE "public"."enum_posts_doc_field";
  DROP TYPE "public"."enum__posts_v_version_doc_status";
  DROP TYPE "public"."enum__posts_v_version_doc_field";
  DROP TYPE "public"."enum_pages_blocks_hero_ask_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_page_hero_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_intro_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_services_items_icon";
  DROP TYPE "public"."enum_pages_blocks_services_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_special_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_projects_teaser_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_projects_list_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_step_cards_items_accent";
  DROP TYPE "public"."enum_pages_blocks_step_cards_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_step_list_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_items_accent";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_news_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_service_detail_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_service_detail_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_spacing";
  DROP TYPE "public"."enum_pages_blocks_cta_band_appearance_spacing";
  DROP TYPE "public"."enum_projects_field";
  DROP TYPE "public"."enum_projects_role";
  DROP TYPE "public"."enum_projects_status";`)
}
