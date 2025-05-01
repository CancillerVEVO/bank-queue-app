import { tickets } from "@/app/lib/placeholder-data";
import { sql } from "@/app/lib/utils";


async function seedTickets() {

  await sql`
  DROP TABLE IF EXISTS tickets;
  `;

  await sql`
  CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL, 
    status TEXT NOT NULL CHECK (status IN ('waiting', 'serving', 'served')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

  for (const ticket of tickets) {
    await sql`
      INSERT INTO tickets (number, status)
      VALUES (${ticket.number}, ${ticket.status})
      ON CONFLICT (number) DO NOTHING;
    `;
  }
}


export async function GET() {
  try {
    console.log("Seeding database...");
    await seedTickets();

    return new Response("Database seeded successfully", { status: 200 });

  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response("Error seeding database", { status: 500 });
  }
}