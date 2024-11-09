export type NodeType = 'input' | 'select' | 'multiple-choice' | 'date' | 'likert' | 'ranking' | 'matching'

export interface BaseNode {
  type: NodeType
  id: string
  title?: string
  label?: string
  placeholder?: string
  answer?: string
  correctAnswer?: string | string[]
}

export interface InputNode extends BaseNode {
  type: 'input'
  label: string
  placeholder: string
}

export interface SelectNode extends BaseNode {
  type: 'select'
  title: string
  options: string[]
}

export interface MultipleChoiceNode extends BaseNode {
  type: 'multiple-choice'
  title: string
  options: string[]
}

export interface DateNode extends BaseNode {
  type: 'date'
  title: string
}

export interface LikertNode extends BaseNode {
  type: 'likert'
  title: string
  options: string[]
}

export interface RankingNode extends BaseNode {
  type: 'ranking'
  title: string
  options: string[]
}

export interface MatchingNode extends BaseNode {
  type: 'matching'
  title: string
  left: string[]
  right: string[]
}

export type FormNode = InputNode | SelectNode | MultipleChoiceNode | DateNode | LikertNode | RankingNode | MatchingNode

export interface FormData {
  id: string
  title: string
  description?: string
  nodes: FormNode[]
  createdAt: string
}

export const mockForms: FormData[] = [
  {
    id: "1",
    title: "Comprehensive Student Feedback Survey",
    description: "A detailed survey to gather student feedback on learning preferences, academic experience, and course satisfaction. This form demonstrates various question types including text input, multiple choice, ratings, and concept matching.",
    createdAt: "2024-01-15T12:00:00Z",
    nodes: [
      {
        type: "input",
        id: "name",
        label: "Full Name",
        placeholder: "Enter your full name",
        answer: "This is a personal identification field - any valid name is acceptable"
      },
      {
        type: "select",
        id: "department",
        title: "Select Your Department",
        options: [
          "Computer Science",
          "Engineering", 
          "Business",
          "Arts",
          "Medicine"
        ],
        answer: "Select your current department of study"
      },
      {
        type: "multiple-choice",
        id: "study-habits",
        title: "How do you prefer to study?",
        options: [
          "Alone in a quiet place",
          "In a group study session", 
          "In the library",
          "With background music"
        ],
        answer: "This question helps us understand your preferred study environment. Multiple answers can be valid based on individual preferences."
      },
      {
        type: "date",
        id: "enrollment-date",
        title: "When did you enroll in the university?",
        answer: "The enrollment date should be within the last 4 years"
      },
      {
        type: "likert",
        id: "satisfaction",
        title: "Rate your satisfaction with the following statement: 'The course materials were well-organized'",
        options: [
          "Strongly Disagree",
          "Disagree",
          "Neutral", 
          "Agree",
          "Strongly Agree"
        ],
        answer: "This helps us gauge student satisfaction with course organization. Responses will be used to improve course structure."
      },
      {
        type: "ranking",
        id: "learning-preferences",
        title: "Rank the following learning methods from most to least preferred",
        options: [
          "Video lectures",
          "Reading textbooks",
          "Hands-on projects",
          "Group discussions"
        ],
        answer: "This question helps us understand your learning style preferences. There is no correct order - it's based on personal preference."
      },
      {
        type: "matching",
        id: "concept-matching",
        title: "Match the programming concepts with their descriptions",
        left: [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        right: [
          "Hiding implementation details",
          "Acquiring properties from parent class",
          "Many forms of a single entity",
          "Simplifying complex systems"
        ],
        answer: "Correct matches:\nEncapsulation -> Hiding implementation details\nInheritance -> Acquiring properties from parent class\nPolymorphism -> Many forms of a single entity\nAbstraction -> Simplifying complex systems"
      }
    ]
  }
]