import { Controller, Post, Get, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('tasks')
@UseGuards(JwtAuthGuard) // ✅ Auth required
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(dto, req.user.userId);
  }

  @Get()
  getTasks(@Query('page') page = 1, @Query('limit') limit = 10, @Query('sortBy') sortBy = 'createdAt') {
    return this.tasksService.getTasks(Number(page), Number(limit), sortBy);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Get(':id/history')
  getTaskHistory(@Param('id') id: string) {
    return this.tasksService.getTaskHistory(id);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  softDeleteTask(@Param('id') id: string) {
    return this.tasksService.softDeleteTask(id);
  }
}
