import { describe, it, expect } from "vitest";
import {
  OUTPUT_TYPES,
  OUTPUT_TYPE_LABELS,
  CONTENT_MODES,
  REVIEW_STATUSES,
  TREND_AREAS,
  NAV_ITEMS,
} from "@/lib/utils/constants";

describe("Constants", () => {
  it("should have labels for all output types", () => {
    for (const type of OUTPUT_TYPES) {
      expect(OUTPUT_TYPE_LABELS[type]).toBeDefined();
      expect(OUTPUT_TYPE_LABELS[type].length).toBeGreaterThan(0);
    }
  });

  it("should have expected output types", () => {
    expect(OUTPUT_TYPES).toContain("green_screen_script");
    expect(OUTPUT_TYPES).toContain("talking_head_script");
    expect(OUTPUT_TYPES).toContain("facebook_post");
  });

  it("should have content modes", () => {
    expect(CONTENT_MODES.length).toBeGreaterThan(0);
    expect(CONTENT_MODES).toContain("educational");
    expect(CONTENT_MODES).toContain("contrarian");
  });

  it("should have review statuses", () => {
    expect(REVIEW_STATUSES).toContain("draft");
    expect(REVIEW_STATUSES).toContain("ready_to_record");
  });

  it("should have trend areas", () => {
    expect(TREND_AREAS).toContain("ai");
    expect(TREND_AREAS).toContain("coaching");
    expect(TREND_AREAS.length).toBe(7);
  });

  it("should have nav items with valid hrefs", () => {
    for (const item of NAV_ITEMS) {
      expect(item.href).toMatch(/^\//);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });
});
