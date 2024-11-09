export type NodeType = 'input' | 'select' | 'multiple-choice' | 'date' | 'likert' | 'ranking' | 'matching'

export interface BaseNode {
  type: NodeType
  id: string
  title?: string
  label?: string
  placeholder?: string
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
  nodes: FormNode[]
}

export const mockForms: FormData[] = [
  {
    id: "1",
    title: "Comprehensive Student Feedback Survey",
    nodes: [
      {
        type: "input",
        id: "name",
        label: "Full Name",
        placeholder: "Enter your full name"
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
        ]
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
        ]
      },
      {
        type: "date",
        id: "enrollment-date",
        title: "When did you enroll in the university?"
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
        ]
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
        ]
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
        ]
      }
    ]
  }
]