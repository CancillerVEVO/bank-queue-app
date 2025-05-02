import { tickets, banks, employees, bankTellers } from "@/app/lib/placeholder-data";
import { sql } from "@/app/lib/utils";
import bcrypt from "bcryptjs";

async function seedBanks() {

  await sql`
     CREATE TABLE banks (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       image_url TEXT NOT NULL,
       background_color TEXT NOT NULL,
       button_color TEXT NOT NULL
     );
   `;

  for (const bank of banks) {
    await sql`
      INSERT INTO banks (id, name, image_url, background_color, button_color)
      VALUES (${bank.id}, ${bank.name}, ${bank.image_url}, ${bank.background_color}, ${bank.button_color});
    `;
  }
}

async function seedEmployees() {
  await sql`
      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
  for (const employee of employees) {
    const hashedPassword = await bcrypt.hash(employee.password, 10);
    await sql`
        INSERT INTO employees (id, email, password)
        VALUES (${employee.id}, ${employee.email}, ${hashedPassword});
      `;
  }

}

async function seedBankTellers() {
  await sql`
      CREATE TABLE bank_tellers (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
        bank_id INTEGER REFERENCES banks(id) ON DELETE CASCADE,
        window_number INTEGER NOT NULL
      );
    `;

  for (const teller of bankTellers) {
    await sql`
        INSERT INTO bank_tellers (employee_id, bank_id, window_number)
        VALUES (${teller.employee_id}, ${teller.bank_id}, ${teller.window_number});
      `;
  }



}

async function seedTickets() {

  // Create tickets
  await sql`
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        number INTEGER UNIQUE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('waiting', 'serving', 'served')),
        bank_teller_id INTEGER REFERENCES bank_tellers(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
  // Seed tickets
  for (const ticket of tickets) {
    await sql`
      INSERT INTO tickets (number, status, bank_teller_id)
      VALUES (${ticket.number}, ${ticket.status}, ${ticket.bank_teller_id});
    `;
  }
}


export async function GET() {
  try {


    console.log("Seeding database...");

    // Drop in reverse dependency order
    await sql`DROP TABLE IF EXISTS tickets;`;
    await sql`DROP TABLE IF EXISTS bank_tellers;`;
    await sql`DROP TABLE IF EXISTS employees;`;
    await sql`DROP TABLE IF EXISTS banks;`;

    // Create tables
    await seedBanks();
    await seedEmployees();
    await seedBankTellers();
    await seedTickets();

    return new Response("Database seeded successfully", { status: 200 });

  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response("Error seeding database", { status: 500 });
  }
}