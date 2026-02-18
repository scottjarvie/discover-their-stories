import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new citation
export const create = mutation({
  args: {
    sourceId: v.id("sources"),
    page: v.optional(v.string()),
    confidence: v.union(
      v.literal("very_high"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low"),
      v.literal("very_low")
    ),
    extractedText: v.optional(v.string()),
    editedText: v.optional(v.string()),
    url: v.optional(v.string()),
    accessDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    conflictsWith: v.optional(v.array(v.id("citations"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const citationId = await ctx.db.insert("citations", {
      ...args,
      isEvidence: false,
      createdAt: now,
      updatedAt: now,
    });
    return citationId;
  },
});

// Get a citation by ID
export const get = query({
  args: { id: v.id("citations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get citations for a source
export const getForSource = query({
  args: {
    sourceId: v.id("sources"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("citations")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();
  },
});

// Get citations for a person, event, relationship, or place
export const getForTarget = query({
  args: {
    targetType: v.union(
      v.literal("person"),
      v.literal("event"),
      v.literal("relationship"),
      v.literal("place")
    ),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all citation links for this target
    const links = await ctx.db
      .query("citationLinks")
      .withIndex("by_target", (q) =>
        q.eq("targetType", args.targetType).eq("targetId", args.targetId)
      )
      .collect();

    // Get the full citation details for each
    const citations = await Promise.all(
      links.map(async (link) => {
        const citation = await ctx.db.get(link.citationId);
        if (!citation) return null;
        
        // Get the source details too
        const source = await ctx.db.get(citation.sourceId);
        
        return {
          ...citation,
          source,
          field: link.field,
          linkId: link._id,
        };
      })
    );

    return citations.filter((c) => c !== null);
  },
});

// List citations with optional filters
export const list = query({
  args: {
    confidence: v.optional(
      v.union(
        v.literal("very_high"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low"),
        v.literal("very_low")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const applyLimit = (rows: Doc<"citations">[]) =>
      args.limit ? rows.slice(0, args.limit) : rows;

    if (args.confidence !== undefined) {
      const results = await ctx.db
        .query("citations")
        .withIndex("by_confidence", (q) => q.eq("confidence", args.confidence!))
        .collect();
      return applyLimit(results);
    }

    const results = await ctx.db.query("citations").collect();
    return applyLimit(results);
  },
});

// Link a citation to a person, event, relationship, or place
export const linkToTarget = mutation({
  args: {
    citationId: v.id("citations"),
    targetType: v.union(
      v.literal("person"),
      v.literal("event"),
      v.literal("relationship"),
      v.literal("place")
    ),
    targetId: v.string(),
    field: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if link already exists
    const existing = await ctx.db
      .query("citationLinks")
      .withIndex("by_citation_and_target", (q) =>
        q
          .eq("citationId", args.citationId)
          .eq("targetType", args.targetType)
          .eq("targetId", args.targetId)
      )
      .first();

    if (existing) {
      // Update the field if it changed
      if (args.field !== undefined) {
        await ctx.db.patch(existing._id, {
          field: args.field,
        });
      }
      return existing._id;
    }

    // Create new link
    const linkId = await ctx.db.insert("citationLinks", {
      citationId: args.citationId,
      targetType: args.targetType,
      targetId: args.targetId,
      field: args.field,
      createdAt: Date.now(),
    });

    return linkId;
  },
});

// Unlink a citation from a target
export const unlinkFromTarget = mutation({
  args: {
    citationId: v.id("citations"),
    targetType: v.union(
      v.literal("person"),
      v.literal("event"),
      v.literal("relationship"),
      v.literal("place")
    ),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("citationLinks")
      .withIndex("by_citation_and_target", (q) =>
        q
          .eq("citationId", args.citationId)
          .eq("targetType", args.targetType)
          .eq("targetId", args.targetId)
      )
      .first();

    if (link) {
      await ctx.db.delete(link._id);
      return { success: true };
    }

    return { success: false, message: "Link not found" };
  },
});

// Update a citation
export const update = mutation({
  args: {
    id: v.id("citations"),
    sourceId: v.optional(v.id("sources")),
    page: v.optional(v.string()),
    confidence: v.optional(
      v.union(
        v.literal("very_high"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low"),
        v.literal("very_low")
      )
    ),
    extractedText: v.optional(v.string()),
    editedText: v.optional(v.string()),
    url: v.optional(v.string()),
    accessDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    conflictsWith: v.optional(v.array(v.id("citations"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

// Delete a citation
export const remove = mutation({
  args: { id: v.id("citations") },
  handler: async (ctx, args) => {
    // Delete all citation links first
    const links = await ctx.db
      .query("citationLinks")
      .withIndex("by_citation", (q) => q.eq("citationId", args.id))
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }

    // Delete the citation
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
