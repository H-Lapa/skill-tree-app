export const dummyTree = {
    id: 'dummy-tree-123',
    title: 'Calisthenics',
    nodes: [
      {
        id: 'node-1',
        title: 'Root',
        isRoot: true,
        position: { x: 250, y: 0 },
        children: ['node-2', 'node-3'],
        resources: {
          videos: [],
          articles: [],
        },
        description: 'This is the root node for the Calisthenics skill tree.',
      },
      {
        id: 'node-2',
        title: 'Push Up',
        position: { x: 100, y: 100 },
        children: ['node-4'],
        resources: {
          videos: ['https://www.youtube.com/watch?v=IODxDxX7oi4'],
          articles: ['https://example.com/push-up-guide'],
        },
        description: 'Master the basic push-up form and build upper body strength.',
      },
      {
        id: 'node-3',
        title: 'Pull Up',
        position: { x: 400, y: 100 },
        children: [],
        resources: {
          videos: ['https://www.youtube.com/watch?v=eGo4IYlbE5g'],
          articles: ['https://example.com/pull-up-guide'],
        },
        description: 'Learn how to perform a proper pull-up to strengthen your back and arms.',
      },
      {
        id: 'node-4',
        title: 'Advanced Push Up',
        position: { x: 50, y: 200 },
        children: [],
        resources: {
          videos: ['https://www.youtube.com/watch?v=H7HmzwI67ec'],
          articles: ['https://example.com/advanced-push-up'],
        },
        description: 'Progress to advanced push-up variations for increased difficulty.',
      },
    ],
  };