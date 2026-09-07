import { Line, LineMetric, LinePerformanceSummary } from '../types/domain';

function safeDevide(numarator: number, denominator: number): number | null {
    if (denominator === 0) {
        return null;
    }
    return numarator / denominator;
}

function dateOnlyToUtc(dt:string): Date {
    return new Date(dt);
}

function inclusiveDaysBetween(start: string, end: string): number {
    const startDate = dateOnlyToUtc(start);
    const endDate = dateOnlyToUtc(end);

    console.log(`start: ${start}: startDate: ${startDate}`);
    console.log(`end: ${end}: endDate: ${endDate}`);

    const diffInMilli = endDate.getTime() - startDate.getTime();
    console.log(`diffInMilli: ${diffInMilli}`);

    return (
        Math.floor(
        diffInMilli / (1000 * 60 * 60 * 24)
        ) + 1
    );
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function calculateLinePerformance(line: Line, metrics: LineMetric[]): LinePerformanceSummary {
    const spend = metrics.reduce((total, metric) => total + Number(metric.spend), 0);
    const impressions = metrics.reduce((total, metric) => total + Number(metric.impressions), 0);
    const clicks = metrics.reduce((total,metric) => total + Number(metric.clicks), 0);
    const conversions = metrics.reduce((total, metric) => total + metric.conversions, 0);
    const revenue = metrics.reduce((total, metric) => total + Number(metric.revenue), 0);

    const budget = Number(line.budget);
    const metricsLength = metrics.length;
    const latestMetric = metricsLength > 0 ? metrics[metricsLength - 1] : null;
    const asOfDate = latestMetric ?.metric_date ?? null;
    let elapsedFlightPercentage = 0;

    if (asOfDate) {
        const totalFlightDays = inclusiveDaysBetween(line.start_date, line.end_date);
        const elapsedFlightDays = inclusiveDaysBetween(line.start_date, asOfDate);
        console.log(`totalFlightDays: ${totalFlightDays}, elapsedFlightDays: ${elapsedFlightDays}`)
        elapsedFlightPercentage = clamp(elapsedFlightDays / totalFlightDays,0,1);
        console.log(`elapsedFlightPercentage: ${elapsedFlightPercentage}`);

    }
    const expectedSpend = budget * elapsedFlightPercentage;
        console.log(`expectedSpend: ${expectedSpend}`);

    return {
        asOfDate,
        impressions,
        clicks,
        conversions,
        spend,
        revenue,
        ctr: safeDevide(clicks, impressions),
        cpc: safeDevide(spend, clicks),
        cpa: safeDevide(spend, conversions),
        roas: safeDevide(revenue, spend),
        budget,
        budgetUtilization: safeDevide(spend, budget) ?? 0,
        expectedSpend,
        pacingRatio: safeDevide(spend, expectedSpend),
        elapsedFlightPercentage
    };
}