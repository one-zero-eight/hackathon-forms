import { apiTypes } from "@/lib/api";
import {
  InputQuestion_type,
  MatchingQuestion_type,
  MultipleChoiceQuestion_type,
  RankingQuestion_type,
  SingleChoiceQuestion_type,
} from "@/lib/api/types";

export const formData: apiTypes.SchemaForm = {
  id: "123",
  title: "Flutter Basics Assessment",
  description: "Test your knowledge of Flutter basics with this quiz.",
  created_at: "2021-09-01T00:00:00Z",
  created_by: "admin",
  updated_at: "2021-09-01T00:00:00Z",
  updated_by: "admin",
  deleted_at: null,
  deleted_by: null,
  nodes: [
    // Node 1: Introduction
    {
      id: 0,
      content: {
        title: "Basic Knowledge in Flutter",
        md_content:
          "Welcome to the Flutter basics assessment! This quiz will test your understanding of fundamental Flutter concepts, widgets, and development principles.",
        medias: [
          "https://storage.googleapis.com/cms-storage-bucket/70760bf1e88b184bb1bc.png",
        ],
        explanation: {
          explanation: "",
          for_correct_answer_too: false,
        },
      },
      question: {
        question_type: SingleChoiceQuestion_type.select,
        options: [
          "A UI toolkit for building native desktop applications",
          "Google's UI toolkit for building natively compiled applications",
          "A JavaScript framework for mobile development",
          "A database management system for mobile apps",
        ],
        correct_answer: 1,
        explanation: {
          explanation:
            "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
          for_correct_answer_too: true,
        },
      },
      required: true,
      next_node: 1,
    },

    // Node 2: Widget Types
    {
      id: 1,
      content: {
        title: "Flutter Widgets",
        md_content: "Let's test your knowledge about Flutter widget types.",
        medias: [],
        explanation: {
          explanation: "",
          for_correct_answer_too: false,
        },
      },
      question: {
        question_type: MultipleChoiceQuestion_type.multiple_choice,
        options: [
          "Stateless Widgets",
          "Stateful Widgets",
          "Dynamic Widgets",
          "Inherited Widgets",
        ],
        correct_answer: [0, 1, 3],
        explanation: {
          explanation:
            "Flutter primarily uses Stateless, Stateful, and Inherited widgets. 'Dynamic Widgets' is not a standard widget type in Flutter.",
          for_correct_answer_too: true,
        },
      },
      required: true,
      next_node: 2,
    },

    // Node 3: Hot Reload
    {
      id: 2,
      content: {
        title: "Hot Reload in Flutter",
        md_content: "Explain what Hot Reload is in Flutter development.",
        medias: [],
        explanation: {
          explanation: "",
          for_correct_answer_too: false,
        },
      },
      question: {
        question_type: InputQuestion_type.input,
        textarea: true,
        correct_answer: [
          "Hot Reload allows developers to see changes in real-time without losing the app state",
        ],
        explanation: {
          explanation:
            "Hot Reload injects updated source code files into the running Dart VM, preserving the app state while showing changes instantly.",
          for_correct_answer_too: true,
        },
      },
      required: true,
      next_node: 3,
    },

    // Node 4: State Management
    {
      id: 3,
      content: {
        title: "State Management Solutions",
        md_content:
          "Rank the following state management solutions from simplest to most complex.",
        medias: [],
        explanation: {
          explanation: "",
          for_correct_answer_too: false,
        },
      },
      question: {
        question_type: RankingQuestion_type.ranking,
        options: ["setState", "Provider", "Bloc", "Redux"],
        correct_answer: [0, 1, 2, 3],
        explanation: {
          explanation:
            "setState is the simplest form of state management, followed by Provider. Bloc and Redux are more complex solutions offering robust state management capabilities.",
          for_correct_answer_too: true,
        },
      },
      required: true,
      next_node: 4,
    },
    // Node 5: Flutter Architecture
    {
      id: 4,
      content: {
        title: "Flutter Architecture Components",
        md_content:
          "Match the Flutter architecture components with their descriptions.",
        medias: [],
        explanation: {
          explanation: "",
          for_correct_answer_too: false,
        },
      },
      question: {
        question_type: MatchingQuestion_type.matching,
        options_first: [
          "Flutter Engine",
          "Dart Framework",
          "Platform Specific Code",
          "Widget Tree",
        ],
        options_second: [
          "Renders widgets and handles events",
          "Foundation of Flutter's reactive framework",
          "Native code integration layer",
          "Core C++ implementation",
        ],
        correct_answer: {
          "0": 3,
          "1": 1,
          "2": 2,
          "3": 0,
        },
        explanation: {
          explanation:
            "Understanding Flutter's architecture is crucial for developing efficient applications. Each component plays a specific role in the Flutter framework.",
          for_correct_answer_too: true,
        },
      },
      required: true,
      next_node: null,
    },
  ],
};
