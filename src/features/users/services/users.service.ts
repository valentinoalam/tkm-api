import { UpdateUserDto } from '../dto/update-user.dto';
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash, verify } from 'argon2';

import { DatabaseService } from '@core/database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User as UserEntity } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import * as fakeData from 'src/shared/fake-data'; 
import { CreateProfileDto } from '../dto';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<any> {
    const fakeUser = fakeData.fakeUser(); // Generate 10 fake users
    const fakeProfile = fakeData.fakeProfile()
    const data = await fs.promises.readFile('users.json', 'utf8');
    const newUser = fakeUser.username + ', password: ' + fakeUser.hashedPassword
    let users = JSON.parse(data);
    users.push(newUser);
    const jsonData = JSON.stringify(users, null, 2);
    fs.writeFile('users.json', jsonData, (err) => {
      if (err) {
      console.error('Error writing data to file', err);
      }
      console.log('User data updated and saved to users.json');
    });

    // Replace with actual password hashing logic
    fakeUser.hashedPassword = await hash(fakeUser.hashedPassword); // Assuming a hashPassword function

    // Save the fake data to the database using Prisma
    let user = await this.db.user.create({ 
      data: {
        ...fakeUser, 
        profile: {
          create: {...fakeProfile },
        }
      },
        include: { profile: true }, })
    return user;
  }

  async create(
    dto: CreateUserDto, profileDto: CreateProfileDto
  ): Promise<any> {
    // generate the password hash
    const { username, email } = dto;
    let user = await this.db.user.findFirst({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await hash(dto.hashedPassword);
   
    user = await this.db.user
      .create({
        data: {
          username: username,
          email: email,
          profile: {
            create: {
              name: profileDto.name,
              position: profileDto.position,
              phone: profileDto.phone,
              address: profileDto.address,
            },
          },
          hashedPassword: hashedPassword
        },
        include: { profile: true },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // if (error.code === 'P2002') throw new ForbiddenException('Credentials taken.');
          if (error.code === 'P2002')
            throw new ForbiddenException('Username/Email already taken.');
        }

        throw error;
      });

    return user;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<any | null> {

    // const validate = await this.db.user.compare(
    //   password,
    //   user?.getPassword(),
    // );
    // return validate ? user : null;
    const user = await this.db.user.findUnique({
      where: { id:username },
    });
    if (!user) {
      throw new NotFoundException('The item does not exist');
    }
    if (user && await verify(password, user.hashedPassword)) {
      const { hashedPassword, ...result } = user;
      return result;
    }

    return null;
  
  }
  async getIAM(id: string): Promise<any> {
    // const decodedUserInfo = req.user as { id: string; email: string };
    const user = await this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    delete user.hashedPassword;
    delete user.hashedRT;

    return user;
  }

  async getAll(): Promise<any[]> {
    const records = await this.db.user.findMany({
      // select: { id: true, email: true },
      include: {
        profile: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          username: 'desc',
        },
      ],
    });
    return records;
  }

  async getAllDeleted(): Promise<any[]> {
    const records = await this.db.user.findMany({
      include: {
        profile: true,
      },
    });

    return records;
  }

  async getById(id: string): Promise<any> {
    // find the user by username
    const user = await this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    return user;
  }

  async searchFirst(query: any): Promise<any> {
    const record = await this.db.user.findFirst({
      where: {
        ...query.where,
        AND: [{ isDeleted: false }],
      },
      include: {
        profile: true,
      },
    });
    return record;
  }

  async searchMany(query: any): Promise<any[]> {
    const records = await this.db.user.findMany({
      where: {
        ...query.where,
        AND: [{ isDeleted: false }],
      },
      include: {
        profile: true,
      },
    });
    return records;
  }

  async searchFirstDeleted(query: any): Promise<any> {
    const record = await this.db.user.findFirst({
      where: {
        ...query.where,
        AND: [{ isDeleted: true }],
      },
      include: {
        profile: true,
      },
    });
    return record;
  }

  async searchManyDeleted(query: any): Promise<any[]> {
    const records = await this.db.user.findMany({
      where: {
        ...query.where,
        AND: [{ isDeleted: true }],
      },
      include: {
        profile: true,
      },
    });

    return records;
  }

  async updateById(
    id: string,
    dto: UpdateUserDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    let updateData = new UserEntity();
    const profileDto = [
      'name',
      'file',
      'position',
      'phone',
      'address',
    ];
    if (dto.hashedPassword) updateData.hashedPassword = await hash(dto.hashedPassword);
    delete dto.hashedPassword;
    let filteredDto: any = {};
    let filteredUserDto: Partial<UserEntity> = {};
    let filteredProfileDto: Partial<Profile> = {};
    for (const prop in dto) {
      if (dto[prop]) {
        filteredDto[prop] = dto[prop];
      }
    }
    for (const prop in filteredDto) {
      if (profileDto.includes(prop)) {
        filteredProfileDto[prop] = filteredDto[prop];
      } else {
        filteredUserDto[prop] = filteredDto[prop];
      }
    }

    filteredProfileDto = {
      ...filteredProfileDto,
      userModified: userId,
      dtModified: new Date(),
    };

    if (file) {
      filteredProfileDto.profilePic = file.filename;
    }

    updateData = {
      ...updateData,
      ...filteredUserDto,
      updatedAt: new Date(),
    };
    const updatedUser = await this.db.user
      .update({
        where: { id: id },
        data: {
          ...updateData,
          profile: { update: filteredProfileDto },
        },
        include: {
          profile: true,
        },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new ForbiddenException('Username/Email/NIK already taken.');
        }
        throw error;
      });

    return updatedUser;
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      return await this.db.profile.update({
        where: {
          userId: userId,
        },
        data: {
          ...dto,
        },
      });
    } catch (err) {
      if (err?.code === 'P2025') {
        throw new NotFoundException(`Record ${userId} to update not found`);
      }
    }
  }
  async deleteById(id: string, userId: string) {
    const user = await this.db.user.delete({
      where: { id },
    });

    return user;
  }
}
