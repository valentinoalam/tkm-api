import {
  Controller,
  Get,
  Req,
  Body,
  Param,
  Post,
  Delete,
  Patch,
  HttpStatus,
  HttpCode,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './services/users.service';

@ApiTags('Users')
// @ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('fake-it')
  async createFakeData() {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };
    try {
      const user = await this.usersService.createFakeData();
      dataOut.data.user = user;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }
    return dataOut;
  }

  @Post('user')
  async createUser(@Body() data: CreateUserDto) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };
    try {
      const user = await this.usersService.create(data);
      dataOut.data.user = user;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }
    return dataOut;
  }
  
  @Get('iam')
  async getIAM(@Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };
    try {
      const user = await this.usersService.getIAM(req.user['sub']);

      const { name, profilePic, division, position, phone, alamat } =
        user.profile;
      const { username, email, userRole } = user;
      dataOut.data.user = {
        username,
        role: userRole,
        email,
        name,
        profilePic,
        division,
        position,
        phone,
        alamat,
      };
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }
    return dataOut;
  }

  @Get()
  @ApiOperation({ summary: 'Lists of users' })
  @HttpCode(HttpStatus.OK)
  async getAll(@Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: {
          page: 0,
          totalRecords: 0,
          records: [],
        },
      },
      logs: {},
    };

    try {
      const users = await this.usersService.getAll();

      dataOut.data.user.totalRecords = users.length;
      dataOut.data.user.records = users;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }

    return dataOut;
  }

  @Get('deleted')
  async getAllDeleted(@Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: {
          page: 0,
          totalRecords: 0,
          records: [],
        },
      },
      logs: {},
    };

    try {
      dataOut.data.user.records = await this.usersService.getAllDeleted();
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }

    return dataOut;
  }

  @Get(':id')
  async getById(@Param('id') userId: string, @Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: {
          page: 0,
          totalRecords: 0,
          records: [],
        },
      },
      logs: {},
    };

    try {
      const user = await this.usersService.getById(userId);

      const { name, profilePic, division, position, phone, alamat } =
        user.profile;
      const { username, email, userRole } = user;
      dataOut.data.user.records.push({
        username,
        role: userRole,
        email,
        name,
        profilePic,
        division,
        position,
        phone,
        alamat,
      });
      dataOut.data.user.totalRecords = 1;
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, error };
    }

    return dataOut;
  }

  @Post('search-first')
  searchFirst(@Body() query: any, @Req() req: Request) {
    return this.usersService.searchFirst(query);
  }

  @Post('search-many')
  searchMany(@Body() query: any, @Req() req: Request) {
    return this.usersService.searchMany(query);
  }

  @Post('search-first-deleted')
  searchFirstDeleted(@Body() query: any, @Req() req: Request) {
    return this.usersService.searchFirstDeleted(query);
  }

  @Post('search-many-deleted')
  searchDeleted(@Body() query: any) {
    return this.usersService.searchManyDeleted(query);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'User has been successfully updated' })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateById(
    @Param('id') userId: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };

    try {
      const user = await this.usersService.updateById(
        userId,
        dto,
        file,
        userId,
      );

      // const { name, profilePic, position, phone, address } = user.profile;
      const { username, email } = user;
      dataOut.data.user = {
        username,
        email,
        // name,
        // profilePic,
        // position,
        // phone,
        // address,
      };
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, reqBody: dto, error };
    }

    return dataOut;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string, @Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };

    try {
      const userId = ''; // req.user['sub']
      const user = await this.usersService.deleteById(id, userId);

      const { username, email } = user;

      dataOut.data.user = { username, email };
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = { ...dataOut.logs, reqParams: { id }, error };
    }

    return dataOut;
  }
}
