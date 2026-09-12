
exports.up = async function(knex) {
    await knex.schema.createTable("advertisers", (table) => {
        table.increments("id").primary();
        table.string("name", 200).notNullable();
        table.string("industry", 200).notNullable().unique();
        table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

        table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("campaigns", (table) => {
        table.increments("id").primary();
        table.string("name", 200).notNullable();
        table.integer("advertiser_id").notNullable().references("id").inTable("advertisers").onDelete("CASCADE");
        table.string("status", 50).notNullable().defaultTo("active");
        table.decimal("budget", 14, 2).notNullable();
        table.date("start_date").notNullable();
        table.date("end_date").notNullable();
        table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
        table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

        table.index("advertiser_id", "idx_campaigns_advertiser_id");
        table.index("status", "idx_campaigns_status");
    });

    await knex.schema.createTable("lines", (table) => {
        table.increments("id").primary();
        table.string("name", 200).notNullable();
        table.integer("campaign_id").notNullable().references("id").inTable("campaigns").onDelete("CASCADE");
        table.string("status", 30).notNullable().defaultTo("ACTIVE");
        table.decimal("budget", 14, 2).notNullable();
        table.decimal("daily_budget", 14, 2);
        table.string("goal_type", 50);
        table.decimal("goal_value", 14, 4);
        table.date("start_date").notNullable();
        table.date("end_date").notNullable();
        table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
        table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

        table.index('campaign_id', 'idx_lines_campaign_id');
        table.index('status', 'idx_lines_status');
    });

    await knex.schema.createTable("line_metrics", (table) => {
        table.increments("id").primary();
        table.integer("line_id").notNullable().references("id").inTable("lines").onDelete("CASCADE");
        table.date("metric_date").notNullable();
        table.decimal("spend", 14, 2).notNullable().defaultTo(0);
        table.integer("impressions").notNullable().defaultTo(0);
        table.integer("clicks").notNullable().defaultTo(0);
        table.integer("conversions").notNullable().defaultTo(0);
        table.decimal("revenue", 14, 2).notNullable().defaultTo(0);
        table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());


        table.unique(["line_id", "metric_date"], "unique_line_metric_per_day");

        table.index("line_id", "idx_line_metrics_line_id");
        table.index("metric_date", "idx_line_metrics_metric_date");
    });
}

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("line_metrics");
    await knex.schema.dropTableIfExists("lines");
    await knex.schema.dropTableIfExists("campaigns");
    await knex.schema.dropTableIfExists("advertisers");
}
