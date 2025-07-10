import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { Post } from "../../database/schemas/post.schema";
import { PostService } from "./post.service";

describe("PostService", () => {
  let service: PostService;
  let model: Model<Post>;

  const mockPost = {
    _id: "507f1f77bcf86cd799439011",
    title: "Test Post",
    content: "Test Content",
    author: "507f1f77bcf86cd799439012",
    tags: ["test"],
    isActive: true,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPostModel = {
    new: jest.fn().mockResolvedValue(mockPost),
    constructor: jest.fn().mockResolvedValue(mockPost),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
    populate: jest.fn(),
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    model = module.get<Model<Post>>(getModelToken(Post.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should have model injected", () => {
    expect(model).toBeDefined();
  });
});
