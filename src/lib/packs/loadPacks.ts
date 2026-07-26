import { TradePackSchema, type TradePack } from "./schema";
import gasPack from "./groundworks-gas.json";

const ALL_PACKS: TradePack[] = ([gasPack] as unknown[]).map((raw) => {
  const result = TradePackSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Trade pack validation failed for pack: ${result.error.message}`);
  }
  return result.data;
});

export function getPackByTrade(trade: string): TradePack | undefined {
  return ALL_PACKS.find(
    (p) => p.id === trade || p.trade_name.toLowerCase() === trade.toLowerCase()
  );
}

export function detectPacks(activityText: string, selectedTrades: string[]): TradePack[] {
  const haystack = `${activityText} ${selectedTrades.join(" ")}`.toLowerCase();
  return ALL_PACKS.filter((p) =>
    p.trigger_keywords.some((kw) => haystack.includes(kw.toLowerCase()))
  );
}
