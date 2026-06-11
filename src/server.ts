import app from "./app";
import { env } from "./config/env";

// I keep server startup separate from app.ts.
// This makes the app easier to test later.
app.listen(Number(env.port), () => {
  console.log(`Server running on port ${env.port}`);
});