# @newriive/common-db

A shared persistence/repository package for the Newriive monorepo.

## Features

- Provides repository classes for CRUD operations on ChecklistGroup and ChecklistItem entities
- Includes sample data and integration-style tests with mocks
- No direct DynamoDB helpers (putItem, getItem, etc.) are exported—only repositories are public

## Usage

### Importing the repositories

```ts
import { ChecklistGroupRepository, ChecklistItemRepository } from '@newriive/common-db';
```

### Example

```ts
const groupRepo = new ChecklistGroupRepository('ChecklistGroupsTable');
const itemRepo = new ChecklistItemRepository('ChecklistItemsTable');

// Create a group
await groupRepo.create({
  id: 'g1',
  userId: 'u1',
  name: 'Test Group',
  createdAt: new Date().toISOString(),
});

// Create an item
await itemRepo.create({
  id: 'i1',
  userId: 'u1',
  groupId: 'g1',
  title: 'Test Item',
  completed: false,
  createdAt: new Date().toISOString(),
});
```

## Testing

- Sample data is provided in `tests/data/checklist-item.json` and `tests/checklist-group.sample.json`.
- Tests use Jest and mock the DynamoDB client for integration-style checks.
- To run tests:

  ```sh
  pnpm --filter @newriive/common-db test
  ```
