import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors, Patch } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOneUser(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('photo', {
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
    }))
    async create(@UploadedFile() photo: any, @Body() body: any) {
        try {
            let data;
            if (body.data) {
                // Se vier via FormData (com foto)
                data = typeof body.data === 'string' ? JSON.parse(body.data) : body.data;
            } else {
                // Se vier como JSON direto (sem foto)
                data = body;
            }
            return await this.usersService.createUser(data, photo);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo'))
    async update(
        @Param('id') id: string,
        @UploadedFile() photo: any,
        @Body() body: any
    ) {
        try {
            let data;
            if (body.data) {
                // Se vier via FormData
                data = typeof body.data === 'string' ? JSON.parse(body.data) : body.data;
            } else {
                // Se vier como JSON direto
                data = body;
            }
            return await this.usersService.updateUser(id, data, photo);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    @Get('profile-photo/:profileId')
    async getProfilePhoto(@Param('profileId') profileId: string) {
        return this.usersService.getProfilePhoto(profileId);
    }
}
