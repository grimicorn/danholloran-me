import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'c2fefda563ca91c54c19432c7790c5191880b6c1', queries,  });
export default client;
  