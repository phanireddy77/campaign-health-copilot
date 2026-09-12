import app from "./app";

import {
  env,
} from "./config/env";

import db from "./db/knex";

const server =
  app.listen(
    env.PORT,
    () => {
      console.log(
        `Campaign Health API running on port ${env.PORT}`
      );
    }
  );

async function shutdown(
  signal: string
) {
  console.log(
    `${signal} received. Shutting down gracefully.`
  );

  server.close(
    async () => {
      try {
        await db.destroy();

        console.log(
          "Database connections closed."
        );

        process.exit(0);
      } catch (error) {
        console.error(
          "Shutdown failed:",
          error
        );

        process.exit(1);
      }
    }
  );
}

process.on(
  "SIGTERM",
  () =>
    void shutdown(
      "SIGTERM"
    )
);

process.on(
  "SIGINT",
  () =>
    void shutdown(
      "SIGINT"
    )
);