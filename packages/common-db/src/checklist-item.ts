import { ddbDocClient } from './client';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ChecklistItem } from '@newriive/common-types';

export class ChecklistItemRepository {
  private tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(item: ChecklistItem) {
    return ddbDocClient.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  async get(id: string) {
    return ddbDocClient.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
  }

  async update(id: string, updates: Partial<ChecklistItem>) {
    // Example: update title, notes, dueDate, completed
    const updateExp = [];
    const expAttrNames: Record<string, string> = {};
    const expAttrValues: Record<string, unknown> = {};
    if (updates.title) {
      updateExp.push('#t = :t');
      expAttrNames['#t'] = 'title';
      expAttrValues[':t'] = updates.title;
    }
    if (typeof updates.completed === 'boolean') {
      updateExp.push('#c = :c');
      expAttrNames['#c'] = 'completed';
      expAttrValues[':c'] = updates.completed;
    }
    if (typeof updates.notes === 'string') {
      updateExp.push('#n = :n');
      expAttrNames['#n'] = 'notes';
      expAttrValues[':n'] = updates.notes;
    }
    if (typeof updates.dueDate === 'string') {
      updateExp.push('#d = :d');
      expAttrNames['#d'] = 'dueDate';
      expAttrValues[':d'] = updates.dueDate;
    }
    if (updateExp.length === 0) {
      throw new Error('No valid fields to update');
    }
    return ddbDocClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET ' + updateExp.join(', '),
        ExpressionAttributeNames: expAttrNames,
        ExpressionAttributeValues: expAttrValues,
        ReturnValues: 'ALL_NEW',
      }),
    );
  }

  async delete(id: string) {
    return ddbDocClient.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
