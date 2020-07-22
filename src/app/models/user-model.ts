export class UserModel {
  primaryKey?: string;
  firstName?: string;
  lastName?: string;
  mailAddress?: string;
  pathOfProfilePicture?: string;
  userType?: string; // systemAdmin, admin, manager, user
  isActive?: boolean;
  birthDate?: number;
}
