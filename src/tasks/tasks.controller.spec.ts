import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { BadRequestException } from '@nestjs/common';

const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll() délègue à TasksService.findAll()', async () => {
    const tasks = [{ id: 1, title: 'Test', content: null, done: false, createdAt: new Date() }];
    mockTasksService.findAll.mockResolvedValue(tasks);

    const result = await controller.findAll();

    expect(mockTasksService.findAll).toHaveBeenCalled();
    expect(result).toEqual(tasks);
  });

  it('create() délègue à TasksService.create()', async () => {
    const dto = { title: 'Nouvelle tâche' };
    const created = { id: 2, title: 'Nouvelle tâche', content: null, done: false, createdAt: new Date() };
    mockTasksService.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(mockTasksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('create() erreur si titre vide', async () => {
    const dto = { title: '' };  
    mockTasksService.create.mockRejectedValueOnce(
      new BadRequestException('title should not be empty'),
    );

    await expect(controller.create(dto as any)).rejects.toBeInstanceOf(BadRequestException);
    expect(mockTasksService.create).toHaveBeenCalledWith(dto);
  });
});
