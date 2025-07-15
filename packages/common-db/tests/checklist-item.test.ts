import { ChecklistItemRepository } from '../src/checklist-item';
import { ChecklistItem } from '@newriive/common-types';
import * as clientModule from '../src/client';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import sampleItems from './data/checklist-item.json';

const TABLE_NAME = 'TestChecklistItems';

const item = sampleItems[0] as ChecklistItem;

describe('ChecklistItemRepository', () => {
  let repo: ChecklistItemRepository;
  let sendMock: jest.Mock;
  beforeAll(() => {
    repo = new ChecklistItemRepository(TABLE_NAME);
    sendMock = jest.fn();
    clientModule.ddbDocClient.send = sendMock;
  });

  afterEach(() => {
    sendMock.mockReset();
  });

  it('should create an item', async () => {
    sendMock.mockResolvedValueOnce({ Attributes: item });
    await repo.create(item);
    expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Item).toEqual(item);
  });

  it('should get an item by id', async () => {
    sendMock.mockResolvedValueOnce({ Item: item });
    await repo.get(item.id);
    expect(sendMock).toHaveBeenCalledWith(expect.any(GetCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: item.id });
  });

  it('should update an item', async () => {
    sendMock.mockResolvedValueOnce({ Attributes: { ...item, title: 'Updated', completed: true } });
    await repo.update(item.id, { title: 'Updated', completed: true });
    expect(sendMock).toHaveBeenCalledWith(expect.any(UpdateCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: item.id });
    expect(call.input.UpdateExpression).toContain('#t = :t'); // title alias
    expect(call.input.ExpressionAttributeNames['#t']).toBe('title');
    expect(call.input.ExpressionAttributeValues[':t']).toBe('Updated');
    expect(call.input.UpdateExpression).toContain('#c = :c'); // completed alias
    expect(call.input.ExpressionAttributeNames['#c']).toBe('completed');
    expect(call.input.ExpressionAttributeValues[':c']).toBe(true);
  });

  it('should delete an item', async () => {
    sendMock.mockResolvedValueOnce({});
    await repo.delete(item.id);
    expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: item.id });
  });

  it('should create all sample items', async () => {
    for (const item of sampleItems as ChecklistItem[]) {
      sendMock.mockResolvedValueOnce({ Attributes: item });
      await repo.create(item);
      expect(sendMock).toHaveBeenLastCalledWith(expect.any(PutCommand));
      const call = sendMock.mock.calls[sendMock.mock.calls.length - 1][0];
      expect(call.input.Item).toEqual(item);
    }
  });
});
