import { describe, it, expect } from "vitest";
import { TradePackSchema } from "../schema";
import { getPackByTrade, detectPacks } from "../loadPacks";
import rawPack from "../groundworks-gas.json";

describe("gas pack", () => {
  it("passes Zod validation", () => {
    expect(() => TradePackSchema.parse(rawPack)).not.toThrow();
  });

  it("getPackByTrade returns gas pack by id", () => {
    expect(getPackByTrade("groundworks-gas")).toBeDefined();
  });

  it("gas-escape hazard has correct pre/post scores", () => {
    const pack = getPackByTrade("groundworks-gas")!;
    const h = pack.hazards.find((h) => h.id === "gas-escape")!;
    expect(h.risk_score_pre).toBe(15);
    expect(h.risk_score_post).toBe(5);
  });

  it("detectPacks finds gas for MDPE activity", () => {
    const packs = detectPacks("MDPE gas main service connection", []);
    expect(packs.some((p) => p.id === "groundworks-gas")).toBe(true);
  });
});
