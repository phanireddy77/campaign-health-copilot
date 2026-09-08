function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function generateMetrics(profile, dayIndex) {
  let impressions;
  let clicks;
  let conversions;
  let spend;
  let revenue;

  switch (profile) {
    case "UNDER_PACING":
      impressions = 22000 + dayIndex * 100;
      clicks = Math.round(impressions * 0.006);
      conversions = Math.round(clicks * 0.04);
      spend = 300 + dayIndex * 2;
      revenue = conversions * 55;
      break;

    case "LOW_CTR":
      impressions = 70000 + dayIndex * 200;
      clicks = Math.round(impressions * 0.0018);
      conversions = Math.round(clicks * 0.04);
      spend = 850 + dayIndex * 3;
      revenue = conversions * 55;
      break;

    case "NO_CONVERSIONS":
      impressions = 55000 + dayIndex * 150;
      clicks = Math.round(impressions * 0.006);
      conversions = 0;
      spend = 750 + dayIndex * 3;
      revenue = 0;
      break;

    case "HIGH_CPA":
      impressions = 65000 + dayIndex * 150;
      clicks = Math.round(impressions * 0.006);
      conversions = 5;
      spend = 1000 + dayIndex * 4;
      revenue = conversions * 55;
      break;

    case "HEALTHY":
    default:
      impressions = 65000 + dayIndex * 200;
      clicks = Math.round(impressions * 0.008);
      conversions = Math.round(clicks * 0.05);
      spend = 900 + dayIndex * 5;
      revenue = conversions * 55;
      break;
  }

  return {
    impressions,
    clicks,
    conversions,
    spend,
    revenue,
  };
}

exports.seed = async function (knex) {
  // Delete child tables first because of foreign-key relationships.
  await knex("line_metrics").del();
  await knex("lines").del();
  await knex("campaigns").del();
  await knex("advertisers").del();

  const advertisers = await knex("advertisers")
    .insert([
      {
        name: "Northstar Athletic",
        industry: "Sports & Apparel",
      },
      {
        name: "Horizon Auto",
        industry: "Automotive",
      },
      {
        name: "BrightHome",
        industry: "Home & Retail",
      },
    ])
    .returning(["id", "name"]);

  const advertiserByName = Object.fromEntries(
    advertisers.map((advertiser) => [
      advertiser.name,
      advertiser.id,
    ])
  );

  const campaigns = await knex("campaigns")
    .insert([
      {
        advertiser_id: advertiserByName["Northstar Athletic"],
        name: "Summer Running",
        status: "ACTIVE",
        budget: 120000,
        start_date: "2026-08-01",
        end_date: "2026-09-30",
      },
      {
        advertiser_id: advertiserByName["Northstar Athletic"],
        name: "Back to School",
        status: "ACTIVE",
        budget: 90000,
        start_date: "2026-08-01",
        end_date: "2026-09-15",
      },
      {
        advertiser_id: advertiserByName["Northstar Athletic"],
        name: "Brand Awareness",
        status: "ACTIVE",
        budget: 150000,
        start_date: "2026-08-01",
        end_date: "2026-10-31",
      },

      {
        advertiser_id: advertiserByName["Horizon Auto"],
        name: "SUV Launch",
        status: "ACTIVE",
        budget: 180000,
        start_date: "2026-08-01",
        end_date: "2026-10-15",
      },
      {
        advertiser_id: advertiserByName["Horizon Auto"],
        name: "EV Consideration",
        status: "ACTIVE",
        budget: 140000,
        start_date: "2026-08-01",
        end_date: "2026-09-30",
      },
      {
        advertiser_id: advertiserByName["Horizon Auto"],
        name: "Dealer Retargeting",
        status: "ACTIVE",
        budget: 75000,
        start_date: "2026-08-01",
        end_date: "2026-09-30",
      },

      {
        advertiser_id: advertiserByName["BrightHome"],
        name: "Fall Furniture",
        status: "ACTIVE",
        budget: 100000,
        start_date: "2026-08-01",
        end_date: "2026-10-15",
      },
      {
        advertiser_id: advertiserByName["BrightHome"],
        name: "Home Office",
        status: "ACTIVE",
        budget: 85000,
        start_date: "2026-08-01",
        end_date: "2026-09-30",
      },
    ])
    .returning(["id", "name"]);

  const profiles = [
    "HEALTHY",
    "UNDER_PACING",
    "LOW_CTR",
    "NO_CONVERSIONS",
    "HIGH_CPA",
  ];

  const lineTemplates = [
    {
      suffix: "Prospecting",
      goal_type: "CPA",
      goal_value: 45,
    },
    {
      suffix: "Retargeting",
      goal_type: "CPA",
      goal_value: 35,
    },
    {
      suffix: "Awareness",
      goal_type: "CTR",
      goal_value: 0.005,
    },
  ];

  const linesWithProfiles = [];

  let profileIndex = 0;

  for (const campaign of campaigns) {
    for (const template of lineTemplates) {
      const profile = profiles[profileIndex % profiles.length];

      const [line] = await knex("lines")
        .insert({
          campaign_id: campaign.id,
          name: `${campaign.name} - ${template.suffix}`,
          status: "ACTIVE",

          budget: 60000,
          daily_budget: 1000,

          goal_type: template.goal_type,
          goal_value: template.goal_value,

          start_date: "2026-08-01",
          end_date: "2026-09-30",
        })
        .returning(["id", "name"]);

      linesWithProfiles.push({
        ...line,
        profile,
      });

      profileIndex++;
    }
  }

  const metricRows = [];

  const metricStartDate = new Date(
    Date.UTC(2026, 7, 1)
  );

  const NUMBER_OF_DAYS = 29;

  for (const line of linesWithProfiles) {
    for (let dayIndex = 0; dayIndex < NUMBER_OF_DAYS; dayIndex++) {
      const metricDate = new Date(metricStartDate);

      metricDate.setUTCDate(
        metricDate.getUTCDate() + dayIndex
      );

      const metrics = generateMetrics(
        line.profile,
        dayIndex
      );

      metricRows.push({
        line_id: line.id,
        metric_date: formatDate(metricDate),

        spend: metrics.spend,
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        conversions: metrics.conversions,
        revenue: metrics.revenue,
      });
    }
  }

  await knex.batchInsert(
    "line_metrics",
    metricRows,
    250
  );

  console.log(
    `Seeded ${advertisers.length} advertisers`
  );

  console.log(
    `Seeded ${campaigns.length} campaigns`
  );

  console.log(
    `Seeded ${linesWithProfiles.length} lines`
  );

  console.log(
    `Seeded ${metricRows.length} metric rows`
  );
};