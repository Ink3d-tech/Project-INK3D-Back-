import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles.enum';

export const ALLOW_OWNER_OR_ROLE = 'allowOwnerOrRole';

export function AllowOwnerOrRole(role: Role) {
  return SetMetadata(ALLOW_OWNER_OR_ROLE, role);
}
