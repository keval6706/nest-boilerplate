import { Test, TestingModule } from "@nestjs/testing";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

describe("PostController", () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findMyPosts: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    hardDelete: jest.fn(),
    toggleStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should have service injected", () => {
    expect(service).toBeDefined();
  });
});
