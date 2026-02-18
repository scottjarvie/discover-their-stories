import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

const placeTypeValidator = v.union(
  v.literal("country"),
  v.literal("state"),
  v.literal("county"),
  v.literal("city"),
  v.literal("town"),
  v.literal("village"),
  v.literal("parish"),
  v.literal("address"),
  v.literal("other")
);

// Create or update a place using the FamilySearch place id (or full name) as the key
export const upsert = mutation({
  args: {
    familySearchId: v.optional(v.string()),
    name: v.string(),
    fullName: v.string(),
    type: v.optional(placeTypeValidator),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let existing: Doc<"places"> | null = null;

    if (args.familySearchId) {
      existing = await ctx.db
        .query("places")
        .withIndex("by_fsId", (q) => q.eq("familySearchId", args.familySearchId))
        .first();
    }

    if (!existing) {
      const matches = await ctx.db
        .query("places")
        .withIndex("by_name", (q) => q.eq("name", args.name))
        .collect();
      existing = matches.find((p) => p.fullName === args.fullName) || null;
    }

    const update = {
      name: args.name,
      fullName: args.fullName,
      type: args.type || "other",
      latitude: args.latitude,
      longitude: args.longitude,
      familySearchId: args.familySearchId,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, update);
      return { placeId: existing._id, updated: true };
    }

    const placeId = await ctx.db.insert("places", {
      ...update,
      createdAt: now,
    });
    return { placeId, updated: false };
  },
});

export const getByFsId = query({
  args: { fsId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_fsId", (q) => q.eq("familySearchId", args.fsId))
      .first();
  },
});

export const list = query({
  args: {
    type: v.optional(placeTypeValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const applyLimit = (rows: Doc<"places">[]) =>
      args.limit ? rows.slice(0, args.limit) : rows;

    if (args.type) {
      const results = await ctx.db
        .query("places")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
      return applyLimit(results);
    }

    const results = await ctx.db.query("places").collect();
    return applyLimit(results);
  },
});
