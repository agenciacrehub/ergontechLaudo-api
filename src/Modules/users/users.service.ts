import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, Profile_photoDto } from "./dto/users.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(data: any, photo?: any) {
        try {
            // Se vier via FormData, pode ser string
            const userData = typeof data.user === 'string' ? JSON.parse(data.user) : (data.user || data);
            const profileData = typeof data.profile === 'string' ? JSON.parse(data.profile) : (data.profile || {});

            // Criptografar a senha antes de salvar
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            // Extrai os arrays do profile
            const { emails, phones, addresses, ...profileRest } = profileData;

            // Preparar dados da foto se existir
            let photoCreate: { create: { photo_user: string } } | undefined = undefined;
            if (photo && photo.buffer) {
                const base64Photo = photo.buffer.toString('base64');
                photoCreate = {
                    create: {
                        photo_user: base64Photo
                    }
                };
            }

            // Preparar dados do perfil
            const profileCreateData: any = {
                ...profileRest,
                profile_email: { create: emails || [] },
                profile_phone: { create: phones || [] },
                profile_address: { create: addresses || [] }
            };
            
            // Adicionar foto apenas se existir
            if (photoCreate) {
                profileCreateData.profile_photo = photoCreate;
            }

            const user = await this.prisma.user.create({
                data: {
                    ...userData,
                    profiles: {
                        create: profileCreateData
                    }
                },
                include: {
                    profiles: {
                        include: {
                            profile_email: true,
                            profile_phone: true,
                            profile_address: true,
                            profile_photo: true,
                            company: true,
                            job_function: true
                        }
                    }
                }
            });
            return user;
        } catch (error) {
            console.error('Erro detalhado ao criar usuário:', error);
            throw error;
        }
    }

    async findAllUsers() {
        const users = await this.prisma.user.findMany({
            include: {
                profiles: {
                    include: {
                        profile_email: true,
                        profile_phone: true,
                        profile_address: true,
                        profile_photo: true,
                        company: true,
                        job_function: true
                    }
                }
            }
        });
        return users;
    }

    async findOneUser(id: string) {
        const user = this.prisma.user.findUnique({ where: { id } });
        return user;
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user;
    }

    async updateUser(id: string, data: any, photo?: any) {
        try {
            if (!data) {
                throw new Error('Dados de atualização não enviados.');
            }

            // Se vier via FormData, pode ser string
            const userData = data.user || data;
            const profile = data.profile || {};

            // Criptografar senha se vier
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            // Profile update
            let profileUpdate: any = {};
            if (profile) {
                if (profile.birth_date) {
                    profileUpdate.birth_date = profile.birth_date;
                }
                if (profile.institution_id) {
                    profileUpdate.institution = {
                        connect: { id: profile.institution_id }
                    };
                }
                // Emails
                if (Array.isArray(profile.emails) && profile.emails.length > 0) {
                    profileUpdate.profile_email = {
                        deleteMany: {},
                        create: profile.emails.map(email => ({
                            email: email.email,
                            is_primary: email.is_primary || false
                        }))
                    };
                }
                // Phones
                if (Array.isArray(profile.phones) && profile.phones.length > 0) {
                    profileUpdate.profile_phone = {
                        deleteMany: {},
                        create: profile.phones.map(phone => ({
                            number: phone.number,
                            type: phone.type,
                            is_primary: phone.is_primary || false
                        }))
                    };
                }
                // Addresses
                if (Array.isArray(profile.addresses) && profile.addresses.length > 0) {
                    profileUpdate.profile_address = {
                        deleteMany: {},
                        create: profile.addresses.map(address => ({
                            street: address.street,
                            number: address.number,
                            complement: address.complement,
                            district: address.district,
                            city: address.city,
                            state: address.state,
                            zip_code: address.zip_code,
                            country: address.country,
                            type: address.type,
                            is_primary: address.is_primary || false
                        }))
                    };
                }
                // Foto
                if (photo && photo.buffer) {
                    const base64Photo = photo.buffer.toString('base64');
                    profileUpdate.profile_photos = {
                        deleteMany: {},
                        create: [{ photo: base64Photo }]
                    };
                }
            }

            // Remove campos que não devem ser atualizados diretamente
            delete userData.id;
            delete userData.profile;

            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    ...userData,
                    ...(Object.keys(profileUpdate).length > 0 ? {
                        profile: {
                            update: profileUpdate
                        }
                    } : {})
                },
                include: {
                    profiles: {
                        include: {
                            profile_email: true,
                            profile_phone: true,
                            profile_address: true,
                            profile_photo: true,
                            company: true,
                            job_function: true
                        }
                    }
                }
            });
            return user;
        } catch (error) {
            console.error('Erro detalhado ao atualizar usuário:', error);
            throw error;
        }
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.delete({ where: { id } });
        return user;
    }

    async getProfilePhoto(profileId: string) {
        try {
            const profilePhoto = await this.prisma.profile_photo.findFirst({
                where: { profile_id: profileId }
            });
            return profilePhoto;
        } catch (error) {
            console.error('Erro ao buscar foto do perfil:', error);
            throw error;
        }
    }
}