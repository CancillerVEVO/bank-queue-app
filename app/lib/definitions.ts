export type TicketStatus = "waiting" | "serving" | "served";

export type Ticket = {
  id: number;
  number: number;
  status: TicketStatus;
  bank_id: number | null; // FK to Bank.id
  created_at: string;
  updated_at: string;
  bank_teller_id: number | null; // FK to BankTeller.id
};

export type Bank = {
  id: number;
  name: string;
  image_url: string;
  background_color: string;
  button_color: string;
};

export type Employee = {
  id: number;
  email: string;
  password: string;
};

export type BankTeller = {
  id: number;
  employee_id: number;    // FK to Employee.id
  bank_id: number;        // FK to Bank.id
  window_number: number;
};

export type EmployeeContext = {
  employee_id: number;
  email: string;
  bank_teller_id: number;
  window_number: number;
  bank_id: number;
  bank_name: string;
  image_url: string;
  background_color: string;
  button_color: string;
};
