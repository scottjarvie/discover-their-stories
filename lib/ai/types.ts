/**
 * AI Types
 * 
 * Purpose: Type definitions for AI integration
 * 
 * Key Elements:
 * - OpenRouter configuration
 * - Model definitions
 * - Processing options
 * 
 * Dependencies: None
 * 
 * Last Updated: Initial setup
 */

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  costPer1kTokens: number;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    contextLength: 200000,
    costPer1kTokens: 0.003,
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextLength: 128000,
    costPer1kTokens: 0.005,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextLength: 128000,
    costPer1kTokens: 0.00015,
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextLength: 1000000,
    costPer1kTokens: 0.0001,
  },
];

export interface ProcessingOptions {
  stage: "normalize" | "cluster" | "synthesize";
  model: string;
  redact: boolean;
}

export interface AIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
