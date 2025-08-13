import {
  users,
  teams,
  teamMembers,
  scrims,
  reviews,
  type User,
  type UpsertUser,
  type Team,
  type InsertTeam,
  type TeamMember,
  type Scrim,
  type InsertScrim,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, inArray, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Team operations
  createTeam(userId: string, team: InsertTeam): Promise<Team>;
  getTeam(id: string): Promise<Team | undefined>;
  getUserTeams(userId: string): Promise<Team[]>;
  updateTeamStats(teamId: string, stats: Partial<Team>): Promise<void>;
  
  // Scrim operations
  createScrim(teamId: string, scrim: InsertScrim): Promise<Scrim>;
  getScrim(id: string): Promise<Scrim | undefined>;
  getAvailableScrims(filters?: ScrimFilters): Promise<Scrim[]>;
  bookScrim(scrimId: string, opponentTeamId: string): Promise<void>;
  updateScrimStatus(scrimId: string, status: string): Promise<void>;
  
  // Review operations
  createReview(reviewerId: string, review: InsertReview & { revieweeTeamId: string; scrimId?: string }): Promise<Review>;
  getTeamReviews(teamId: string): Promise<Review[]>;
}

export interface ScrimFilters {
  date?: string;
  time?: string;
  format?: string;
  maps?: string[];
  servers?: string[];
  region?: string;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Team operations
  async createTeam(userId: string, teamData: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values({
        ...teamData,
        ownerId: userId,
      })
      .returning();

    // Add the creator as a team member
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: userId,
      role: "owner",
    });

    return team;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const userTeams = await db
      .select({
        team: teams,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId));
    
    return userTeams.map(ut => ut.team);
  }

  async updateTeamStats(teamId: string, stats: Partial<Team>): Promise<void> {
    await db
      .update(teams)
      .set({
        ...stats,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, teamId));
  }

  // Scrim operations
  async createScrim(teamId: string, scrimData: InsertScrim): Promise<Scrim> {
    const [scrim] = await db
      .insert(scrims)
      .values({
        ...scrimData,
        hostTeamId: teamId,
      })
      .returning();
    return scrim;
  }

  async getScrim(id: string): Promise<Scrim | undefined> {
    const [scrim] = await db.select().from(scrims).where(eq(scrims.id, id));
    return scrim;
  }

  async getAvailableScrims(filters?: ScrimFilters): Promise<Scrim[]> {
    let query = db
      .select({
        scrim: scrims,
        hostTeam: teams,
      })
      .from(scrims)
      .innerJoin(teams, eq(scrims.hostTeamId, teams.id))
      .where(eq(scrims.status, "open"));

    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      query = query.where(
        and(
          gte(scrims.scheduledAt, startOfDay),
          lte(scrims.scheduledAt, endOfDay)
        )
      );
    }

    if (filters?.servers && filters.servers.length > 0) {
      query = query.where(
        sql`${scrims.servers} && ${filters.servers}`
      );
    }

    if (filters?.format) {
      query = query.where(eq(scrims.format, filters.format));
    }

    const results = await query.orderBy(asc(scrims.scheduledAt));
    
    return results.map(result => ({
      ...result.scrim,
      hostTeam: result.hostTeam,
    })) as any;
  }

  async bookScrim(scrimId: string, opponentTeamId: string): Promise<void> {
    await db
      .update(scrims)
      .set({
        opponentTeamId,
        status: "booked",
        updatedAt: new Date(),
      })
      .where(eq(scrims.id, scrimId));
  }

  async updateScrimStatus(scrimId: string, status: string): Promise<void> {
    await db
      .update(scrims)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(scrims.id, scrimId));
  }

  // Review operations
  async createReview(
    reviewerId: string, 
    reviewData: InsertReview & { revieweeTeamId: string; scrimId?: string }
  ): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({
        ...reviewData,
        reviewerId,
      })
      .returning();
    return review;
  }

  async getTeamReviews(teamId: string): Promise<Review[]> {
    const teamReviews = await db
      .select({
        review: reviews,
        reviewer: users,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeTeamId, teamId))
      .orderBy(desc(reviews.createdAt));
    
    return teamReviews.map(tr => ({
      ...tr.review,
      reviewer: tr.reviewer,
    })) as any;
  }
}

export const storage = new DatabaseStorage();
