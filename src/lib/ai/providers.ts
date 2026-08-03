import "server-only";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AiProviderName = "NVIDIA" | "OPENAI" | "ANTHROPIC";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ProviderAdapter {
  /** One-shot call — used for the admin "send test message" diagnostic. */
  chat(messages: ChatMessage[], system: string, options?: { signal?: AbortSignal }): Promise<string>;
  /** Token-by-token streaming — used by the student chat route. */
  chatStream(messages: ChatMessage[], system: string, options?: { signal?: AbortSignal }): AsyncIterable<string>;
}

interface OpenAiCompatibleConfig {
  apiKey: string;
  baseUrl?: string | null;
  model: string;
}

function createOpenAiCompatibleAdapter({ apiKey, baseUrl, model }: OpenAiCompatibleConfig): ProviderAdapter {
  const client = new OpenAI({ apiKey, baseURL: baseUrl ?? undefined });

  return {
    async chat(messages, system, options) {
      const response = await client.chat.completions.create(
        { model, messages: [{ role: "system", content: system }, ...messages] },
        { signal: options?.signal },
      );
      return response.choices[0]?.message?.content ?? "";
    },
    async *chatStream(messages, system, options) {
      const stream = await client.chat.completions.create(
        { model, messages: [{ role: "system", content: system }, ...messages], stream: true },
        { signal: options?.signal },
      );
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
    },
  };
}

interface AnthropicConfig {
  apiKey: string;
  model: string;
}

function createAnthropicAdapter({ apiKey, model }: AnthropicConfig): ProviderAdapter {
  const client = new Anthropic({ apiKey });
  const MAX_TOKENS = 1024;

  return {
    async chat(messages, system, options) {
      const stream = client.messages.stream(
        { model, system, max_tokens: MAX_TOKENS, messages },
        { signal: options?.signal },
      );
      return stream.finalText();
    },
    async *chatStream(messages, system, options) {
      const stream = client.messages.stream(
        { model, system, max_tokens: MAX_TOKENS, messages },
        { signal: options?.signal },
      );
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text;
        }
      }
    },
  };
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string | null;
  model: string;
}

export function getProviderAdapter(provider: AiProviderName, config: ProviderConfig): ProviderAdapter {
  switch (provider) {
    case "NVIDIA":
      return createOpenAiCompatibleAdapter({ ...config, baseUrl: config.baseUrl ?? "https://integrate.api.nvidia.com/v1" });
    case "OPENAI":
      return createOpenAiCompatibleAdapter(config);
    case "ANTHROPIC":
      return createAnthropicAdapter(config);
  }
}
