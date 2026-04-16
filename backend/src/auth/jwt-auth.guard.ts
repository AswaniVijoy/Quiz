import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Simply extend AuthGuard('jwt') — Passport does the heavy lifting
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}