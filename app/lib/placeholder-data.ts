import { Ticket, Bank, Employee, BankTeller } from "@/app/lib/definitions";

export const banks: Bank[] = [
  {
    id: 1,
    name: "Afirme",
    image_url: "/banks/afirme.svg",
    background_color: "#FFFFFF",
    button_color: "#15793B",
  },
  {
    id: 2,
    name: "BBVA",
    image_url: "/banks/bbva.svg",
    background_color: "#072146",
    button_color: "#028484",
  },
];

export const users: Employee[] = [
  {
    id: 1,
    email: "juan@afirme.com",
    password: "123456", 
  },
  {
    id: 2,
    email: "laura@afirme.com",
    password: "123456",
  },
  {
    id: 3,
    email: "juan@bbva.com",
    password: "123456", 
  },
  {
    id: 4,
    email: "laura@bbva.com",
    password: "123456",
  },

];

export const bankTellers: Omit<BankTeller, "id">[] = [
  {
    employee_id: users[0].id,
    bank_id: banks[0].id,     // Afirme
    window_number: 1,
  },
  {
    employee_id: users[1].id,
    bank_id: banks[0].id,     // Afirme
    window_number: 2,
  },
  {
    employee_id: users[2].id,
    bank_id: banks[1].id,   // BBVA
    window_number: 1,
  },
  {
    employee_id: users[3].id,
    bank_id: banks[1].id,     // BBVA
    window_number: 2,
  },
];

export const tickets: Omit<Ticket, "id" | "created_at" | "updated_at">[] = [
  { number: 1, status: "waiting", bank_teller_id: null, bank_id: banks[0].id },
  { number: 2, status: "waiting", bank_teller_id: null , bank_id: banks[0].id},
  { number: 3, status: "waiting", bank_teller_id: null , bank_id: banks[0].id},
  { number: 4, status: "waiting", bank_teller_id: null , bank_id: banks[1].id},
  { number: 5, status: "waiting", bank_teller_id: null , bank_id: banks[1].id},
  { number: 6, status: "waiting", bank_teller_id: null , bank_id: banks[1].id},
];