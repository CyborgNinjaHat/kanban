ALTER TABLE "cards" ALTER COLUMN "description" SET DATA TYPE varchar(255) USING "description"::varchar(255);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "description" DROP DEFAULT;