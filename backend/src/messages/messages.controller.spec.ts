import { MessagesController } from './messages.controller';
import { messagesModuleMetadata } from './messages.module';
import setupTestingModule from '../../test/setUpTestingModule';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const result = await setupTestingModule(messagesModuleMetadata);
    const module = result.testingModule;

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
