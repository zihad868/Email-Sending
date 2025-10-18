import { UserRole } from "@prisma/client";

export interface TRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
