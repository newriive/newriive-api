import { User, ChecklistGroup, ChecklistItem } from '../src';
import userSample from './user.sample.json';
import groupSample from './checklist-group.sample.json';
import itemSample from './checklist-item.sample.json';

describe('Common Types', () => {
  it('User sample matches User type', () => {
    const user: User = userSample;
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('user1@example.com');
  });

  it('ChecklistGroup sample matches ChecklistGroup type', () => {
    const group: ChecklistGroup = groupSample;
    expect(group.id).toBe('group-1');
    expect(group.name).toBe('Visa Process');
  });

  it('ChecklistItem sample matches ChecklistItem type', () => {
    const item: ChecklistItem = itemSample;
    expect(item.id).toBe('item-1');
    expect(item.title).toBe('Submit application');
    expect(item.completed).toBe(false);
  });
});
