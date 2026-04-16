import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from '../admin/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  // Register a new admin (run once to create your admin account)
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.adminModel({ email, password: hashedPassword });
    await admin.save();
    return { message: 'Admin created successfully' };
  }

  // Login and return JWT token
  async login(email: string, password: string) {
    // 1. Find admin by email
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password with stored hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Create JWT payload and sign it
    const payload = { sub: admin._id, email: admin.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}