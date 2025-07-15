import { ChecklistGroupRepository } from '../src/checklist-group';
import { ChecklistGroup } from '@newriive/common-types';
import * as clientModule from '../src/client';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import sampleGroups from './data/checklist-group.json';

const TABLE_NAME = 'TestChecklistGroups';

const group = sampleGroups[0] as ChecklistGroup;

describe('ChecklistGroupRepository', () => {
  let repo: ChecklistGroupRepository;
  let sendMock: jest.Mock;
  beforeAll(() => {
    repo = new ChecklistGroupRepository(TABLE_NAME);
    sendMock = jest.fn();
    clientModule.ddbDocClient.send = sendMock;
  });

  afterEach(() => {
    sendMock.mockReset();
  });

  it('should create a group', async () => {
    sendMock.mockResolvedValueOnce({ Attributes: group });
    await repo.create(group);
    expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Item).toEqual(group);
  });

  it('should get a group by id', async () => {
    sendMock.mockResolvedValueOnce({ Item: group });
    await repo.get(group.id);
    expect(sendMock).toHaveBeenCalledWith(expect.any(GetCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: group.id });
  });

  it('should update a group', async () => {
    sendMock.mockResolvedValueOnce({ Attributes: { ...group, name: 'Updated' } });
    await repo.update(group.id, { name: 'Updated' });
    expect(sendMock).toHaveBeenCalledWith(expect.any(UpdateCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: group.id });
    expect(call.input.UpdateExpression).toContain('#n = :n'); // check for alias, not 'name'
    expect(call.input.ExpressionAttributeNames['#n']).toBe('name');
    expect(call.input.ExpressionAttributeValues[':n']).toBe('Updated');
  });

  it('should delete a group', async () => {
    sendMock.mockResolvedValueOnce({});
    await repo.delete(group.id);
    expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteCommand));
    const call = sendMock.mock.calls[0][0];
    expect(call.input.Key).toEqual({ id: group.id });
  });

  it('should create all sample groups', async () => {
    for (const group of sampleGroups as ChecklistGroup[]) {
      sendMock.mockResolvedValueOnce({ Attributes: group });
      await repo.create(group);
      expect(sendMock).toHaveBeenLastCalledWith(expect.any(PutCommand));
      const call = sendMock.mock.calls[sendMock.mock.calls.length - 1][0];
      expect(call.input.Item).toEqual(group);
    }
  });
});
