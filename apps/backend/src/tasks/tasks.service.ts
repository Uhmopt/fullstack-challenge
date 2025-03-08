import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Status } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async checkPrismaModels() {
    console.log("Available models:", Object.keys(this.prisma));
  }
  
  async createTask(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: "PENDING",
      },
    });
  }

  async getTasks(page = 1, limit = 10, sortBy = 'createdAt') {
    const [tasks, totalCount] = await Promise.all([
      this.prisma.task.findMany({
        where: { deletedAt: null },
        orderBy: { [sortBy]: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({
        where: { deletedAt: null },
      }),
    ]);

    return { tasks, totalCount };
  }

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id, deletedAt: null },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async getTaskHistory(taskId: string) {
    return this.prisma.taskHistory.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  }
  

  async updateTask(id: string, dto: UpdateTaskDto) {
    const existingTask = await this.prisma.task.findUnique({ where: { id } });
    if (!existingTask) throw new NotFoundException('Task not found');

    if (dto.status && dto.status !== existingTask.status) {
      await this.prisma.taskHistory.create({
        data: {
          taskId: id,
          oldStatus: existingTask.status,
          newStatus: dto.status as Status,
          reason: dto.reason || "No reason provided",
        },
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status as Status,
      },
    });
  }

  async softDeleteTask(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
