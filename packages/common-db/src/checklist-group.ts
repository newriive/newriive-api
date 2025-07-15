import { ddbDocClient } from './client';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ChecklistGroup } from '@newriive/common-types';

export class ChecklistGroupRepository {
  private tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(group: ChecklistGroup) {
    return ddbDocClient.send(new PutCommand({ TableName: this.tableName, Item: group }));
  }

  async get(id: string) {
    return ddbDocClient.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
  }

  async update(id: string, updates: Partial<ChecklistGroup>) {
    // Example: update name and description
    const updateExp = [];
    const expAttrNames: Record<string, string> = {};
    const expAttrValues: Record<string, unknown> = {};
    if (updates.name) {
      updateExp.push('#n = :n');
      expAttrNames['#n'] = 'name';
      expAttrValues[':n'] = updates.name;
    }
    if (updates.description) {
      updateExp.push('#d = :d');
      expAttrNames['#d'] = 'description';
      expAttrValues[':d'] = updates.description;
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
