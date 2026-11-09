import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import {
    ContactMessage,
    TicketStatus,
  } from './entities/contact-message.entity';
  import {
    ContactReply,
    ReplySenderType,
  } from './entities/contact-reply.entity';
  import { User, UserRole } from '../users/entities/user.entity';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { ListContactDto } from './dto/list-contact.dto';
  import { UpdateContactDto } from './dto/update-contact.dto';
  import { AddReplyDto } from './dto/add-reply.dto';
  
  @Injectable()
  export class ContactService {
    constructor(
      @InjectRepository(ContactMessage)
      private readonly contactRepo: Repository<ContactMessage>,
  
      @InjectRepository(ContactReply)
      private readonly replyRepo: Repository<ContactReply>,
    ) {}
  
    async create(user: User | null, dto: CreateContactDto) {
      const fullName = user
        ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
          dto.full_name
        : dto.full_name;
  
      const phone = user?.phone ?? dto.phone;
  
      const message = this.contactRepo.create({
        user_id: user?.id ?? null,
        full_name: fullName,
        phone,
        subject: dto.subject,
        message: dto.message,
        status: TicketStatus.Open,
        is_read: false,
      });
  
      const saved = await this.contactRepo.save(message);
  
      return {
        id: saved.id,
        message: 'تیکت شما با موفقیت ثبت شد. به‌زودی پاسخ می‌دهیم.',
      };
    }
  
    async listForUser(userId: number) {
      return this.contactRepo.find({
        where: { user_id: userId },
        relations: { replies: true },
        order: { created_at: 'DESC' },
      });
    }
  
    async list(dto: ListContactDto) {
      const page = Math.max(1, Number(dto.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(dto.limit) || 20));
      const skip = (page - 1) * limit;
  
      const qb = this.contactRepo
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.replies', 'replies')
        .orderBy('contact.created_at', 'DESC')
        .skip(skip)
        .take(limit);
  
      if (dto.unread_only === 'true') {
        qb.andWhere('contact.is_read = :read', { read: false });
      }
  
      if (dto.status) {
        qb.andWhere('contact.status = :status', { status: dto.status });
      }
  
      if (dto.search) {
        qb.andWhere(
          '(contact.full_name ILIKE :q OR contact.phone ILIKE :q OR contact.message ILIKE :q)',
          { q: `%${dto.search}%` },
        );
      }
  
      const [items, total] = await qb.getManyAndCount();
  
      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        unread_count: await this.contactRepo.count({
          where: { is_read: false },
        }),
        open_count: await this.contactRepo.count({
          where: { status: TicketStatus.Open },
        }),
      };
    }
  
    async findOne(id: number) {
      const message = await this.contactRepo.findOne({
        where: { id },
        relations: { replies: true },
      });
      if (!message) throw new NotFoundException('تیکت یافت نشد');
      return message;
    }
  
    async findOneForUser(id: number, userId: number) {
      const message = await this.contactRepo.findOne({
        where: { id, user_id: userId },
        relations: { replies: true },
      });
      if (!message) throw new NotFoundException('تیکت یافت نشد');
      return message;
    }
  
    async addReply(id: number, user: User, dto: AddReplyDto) {
      const message = await this.contactRepo.findOne({ where: { id } });
      if (!message) throw new NotFoundException('تیکت یافت نشد');
  
      const isAdmin =
        user.role === UserRole.Admin || user.role === UserRole.SuperAdmin;
      const isOwner = message.user_id === user.id;
  
      if (!isAdmin && !isOwner) {
        throw new BadRequestException('شما دسترسی به این تیکت ندارید');
      }
  
      if (message.status === TicketStatus.Closed) {
        throw new BadRequestException(
          'این تیکت بسته شده و قابل پاسخ نیست',
        );
      }
  
      const reply = this.replyRepo.create({
        contact_id: id,
        sender_type: isAdmin ? ReplySenderType.Admin : ReplySenderType.User,
        sender_id: user.id,
        message: dto.message,
      });
  
      const saved = await this.replyRepo.save(reply);
  
      message.last_reply_at = new Date();
  
      if (isAdmin) {
        message.status = TicketStatus.Resolved;
        message.is_read = true;
      } else {
        message.status = TicketStatus.Open;
        message.is_read = false;
      }
  
      await this.contactRepo.save(message);
  
      return saved;
    }
  
    async update(id: number, dto: UpdateContactDto) {
      const message = await this.findOne(id);
  
      if (dto.status !== undefined) {
        message.status = dto.status;
      }
  
      return this.contactRepo.save(message);
    }
  
    async markRead(id: number) {
      const message = await this.findOne(id);
      message.is_read = true;
      return this.contactRepo.save(message);
    }
  
    async remove(id: number) {
      const message = await this.findOne(id);
      await this.contactRepo.delete(id);
      return { message: 'تیکت حذف شد', id };
    }
  }