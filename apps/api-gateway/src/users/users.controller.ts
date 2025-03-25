import { HttpAuthGuard } from '@easygen/guards/http-auth.guard';
import { RequestWithPayload } from '@easygen/guards/types/request-with-payload';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserApiDto } from './dto/create-user.dto';
import { ReadUserApiDto } from './dto/read-user.dto';
import { UpdateUserApiDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: ReadUserApiDto })
  create(@Body() createUserDto: CreateUserApiDto) {
    const user = this.usersService.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return user;
  }

  @Get()
  @UseGuards(HttpAuthGuard)
  findAll(@Request() req: RequestWithPayload) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(HttpAuthGuard)
  findOne(
    @Request() req: RequestWithPayload,
    @Param('id') requestUserId: string,
  ) {
    if (req.jwtPayload.userId !== requestUserId)
      throw new UnauthorizedException('Access Denied');

    return this.usersService.findOne(requestUserId);
  }

  @Patch(':id')
  @UseGuards(HttpAuthGuard)
  update(
    @Request() req: RequestWithPayload,
    @Param('id') requestUserId: string,
    @Body() updateUserDto: UpdateUserApiDto,
  ) {
    if (req.jwtPayload.userId !== requestUserId)
      throw new UnauthorizedException('Access Denied');

    return this.usersService.update(requestUserId, {
      ...updateUserDto,
      id: requestUserId,
    });
  }

  @Delete(':id')
  @UseGuards(HttpAuthGuard)
  remove(
    @Request() req: RequestWithPayload,
    @Param('id') requestUserId: string,
  ) {
    if (req.jwtPayload.userId !== requestUserId)
      throw new UnauthorizedException('Access Denied');

    return this.usersService.remove(requestUserId);
  }
}
