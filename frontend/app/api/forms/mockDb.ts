export const mockForms = new Map([
  ['1', {
    id: '1',
    title: 'Comprehensive Student Feedback Survey',
    nodes: [
      {
        type: 'input',
        id: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name'
      },
      {
        type: 'select', 
        id: 'department',
        title: 'Select Your Department',
        options: [
          'Computer Science',
          'Engineering', 
          'Business',
          'Arts',
          'Medicine'
        ]
      },
      {
        type: 'multiple-choice',
        id: 'study-habits',
        title: 'How do you prefer to study?',
        options: [
          'Alone in a quiet place',
          'In a group study session', 
          'In the library',
          'With background music'
        ]
      },
      {
        type: 'date',
        id: 'enrollment-date',
        title: 'When did you enroll in the university?'
      },
      {
        type: 'likert',
        id: 'satisfaction',
        title: 'Rate your satisfaction with the following statement: \'The course materials were well-organized\'',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral', 
          'Agree',
          'Strongly Agree'
        ]
      },
      {
        type: 'ranking',
        id: 'learning-preferences',
        title: 'Rank the following learning methods from most to least preferred',
        options: [
          'Video lectures',
          'Reading textbooks',
          'Hands-on projects',
          'Group discussions'
        ]
      },
      {
        type: 'matching',
        id: 'concept-matching',
        title: 'Match the programming concepts with their descriptions',
        left: [
          'Encapsulation',
          'Inheritance',
          'Polymorphism',
          'Abstraction'
        ],
        right: [
          'Hiding implementation details',
          'Acquiring properties from parent class',
          'Many forms of a single entity',
          'Simplifying complex systems'
        ]
      }
    ]
  }]
])