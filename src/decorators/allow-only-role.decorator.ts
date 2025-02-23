import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles.enum';

export const ALLOW_ONLY_ROLE = 'allowOnlyRole';

export function AllowOnlyRole(role: Role) {
  return SetMetadata(ALLOW_ONLY_ROLE, role);
}
