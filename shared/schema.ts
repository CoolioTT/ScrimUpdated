import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teams table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  logoUrl: varchar("logo_url"),
  region: varchar("region").notNull(),
  tier: varchar("tier"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  gamesPlayed: integer("games_played").default(0),
  responseRate: integer("response_rate").default(100),
  cancellationRate: integer("cancellation_rate").default(0),
  ownerId: varchar("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Scrims table
export const scrims = pgTable("scrims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostTeamId: varchar("host_team_id").references(() => teams.id).notNull(),
  opponentTeamId: varchar("opponent_team_id").references(() => teams.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  endTime: timestamp("end_time"),
  format: varchar("format").notNull(), // "1 Game", "Bo3", "Bo5", etc.
  maps: text("maps").array(),
  servers: text("servers").array().notNull(), // ["HK", "SG", "JP", "SYD", "MB"]
  status: varchar("status").default("open"), // "open", "booked", "completed", "cancelled"
  gameMode: varchar("game_mode").default("Competitive"),
  minRank: varchar("min_rank"),
  maxRank: varchar("max_rank"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewerId: varchar("reviewer_id").references(() => users.id).notNull(),
  revieweeTeamId: varchar("reviewee_team_id").references(() => teams.id).notNull(),
  scrimId: varchar("scrim_id").references(() => scrims.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isPositive: boolean("is_positive").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
  reviews: many(reviews),
}));

export const teamsRelations = relations(teams, ({ many, one }) => ({
  owner: one(users, { fields: [teams.ownerId], references: [users.id] }),
  members: many(teamMembers),
  hostedScrims: many(scrims, { relationName: "hostTeam" }),
  opponentScrims: many(scrims, { relationName: "opponentTeam" }),
  reviews: many(reviews),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const scrimsRelations = relations(scrims, ({ one }) => ({
  hostTeam: one(teams, { 
    fields: [scrims.hostTeamId], 
    references: [teams.id],
    relationName: "hostTeam"
  }),
  opponentTeam: one(teams, { 
    fields: [scrims.opponentTeamId], 
    references: [teams.id],
    relationName: "opponentTeam"
  }),
  reviews: one(reviews, { fields: [scrims.id], references: [reviews.scrimId] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, { fields: [reviews.reviewerId], references: [users.id] }),
  revieweeTeam: one(teams, { fields: [reviews.revieweeTeamId], references: [teams.id] }),
  scrim: one(scrims, { fields: [reviews.scrimId], references: [scrims.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  logoUrl: true,
  region: true,
  tier: true,
});

export const insertScrimSchema = createInsertSchema(scrims).pick({
  scheduledAt: true,
  endTime: true,
  format: true,
  maps: true,
  servers: true,
  gameMode: true,
  minRank: true,
  maxRank: true,
  description: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  rating: true,
  comment: true,
  isPositive: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Scrim = typeof scrims.$inferSelect;
export type InsertScrim = z.infer<typeof insertScrimSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
