
export interface Advertiser {
    id: number,
    name: string,
    industry: string | null,
    created_at: Date; // ISO 8601 format
    updated_at: Date; // ISO 8601 format
}

export interface Campaign {
  id: number;
  advertiser_id: number;
  name: string;
  status: string;
  budget: string;
  start_date: string;
  end_date: string;
}

export interface Line {
  id: number;
  campaign_id: number;
  name: string;
  status: string;
  budget: string;
  daily_budget: string | null;
  goal_type: string | null;
  goal_value: string | null;
  start_date: string;
  end_date: string;
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