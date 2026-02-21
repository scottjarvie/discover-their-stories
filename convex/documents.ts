import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const documentTypeValidator = v.union(v.literal("PS"), v.literal("CST"));

const stripMarkdown = (markdown: string) => {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[.*?\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const upsertDocument = mutation({
  args: {
    personId: v.string(),
    type: documentTypeValidator,
    title: v.string(),
    contentMarkdown: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const contentText = stripMarkdown(args.contentMarkdown);
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_personId_type", (q) =>
        q.eq("personId", args.personId).eq("type", args.type)
      )
      .first();

    const update = {
      title: args.title,
      contentMarkdown: args.contentMarkdown,
      contentText,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, update);
      return { documentId: existing._id, updated: true };
    }

    const documentId = await ctx.db.insert("documents", {
      personId: args.personId,
      type: args.type,
      ...update,
      createdAt: now,
    });

    return { documentId, updated: false };
  },
});

export const getDocumentsByPerson = query({
  args: { personId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("documents")
      .withIndex("by_personId", (q) => q.eq("personId", args.personId))
      .collect();

    return results.sort((a, b) => a.type.localeCompare(b.type));
  },
});

export const getDocument = query({
  args: {
    personId: v.string(),
    type: documentTypeValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_personId_type", (q) =>
        q.eq("personId", args.personId).eq("type", args.type)
      )
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});
