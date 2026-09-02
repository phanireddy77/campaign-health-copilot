export interface Advertiser {
  id: number;
  name: string;
  industry: string | null;
  created_at: Date; // ISO 8601 format
  updated_at: Date; // ISO 8601 format
}

export interface Campaign {
    id: number;
    name: string;
    advertiser_id: number;
    start_date: Date; // ISO 8601 format
    end_date: Date; // ISO 8601 format
    daily_budget: string | null;
    goal_type: string | null;
    goal_value: string | null;
    created_at: Date; // ISO 8601 format
    updated_at: Date; // ISO 8601 format
}

export interface Line {
    id: number;
    name: string;
    campaign_id: number;
    status: string;
    daily_budget: string | null;
    goal_type: string | null;
    goal_value: string | null;
    start_date: Date; // ISO 8601 format
    end_date: Date; // ISO 8601 format
    created_at: Date; // ISO 8601 format
    updated_at: Date; // ISO 8601 format
}

export interface LineMetric {
    id: number;
    line_id: number;
    metric_date: Date; // ISO 8601 format
    impressions: number;
    clicks: number;
    conversions: number;
    spend: string;
    revenue: string;
    created_at: Date; // ISO 8601 format
}