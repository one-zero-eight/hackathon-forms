import { createContext, PropsWithChildren, useContext } from "react";

export type FormData = {
  id: string;
  title: string;
  nodes: FormNode[];
};
export type FormNode =
  | InputFormNode
  | SelectFormNode
  | MultipleChoiceFormNode
  | DateFormNode
  | LikertFormNode
  | RankingFormNode
  | MatchingFormNode;

export type InputFormNode = {
  type: "input";
  id: string;
  label: string;
  placeholder: string;
};
export type SelectFormNode = {
  type: "select";
  id: string;
  title: string;
  options: string[];
};
export type MultipleChoiceFormNode = {
  type: "multiple-choice";
  id: string;
  title: string;
  options: string[];
};
export type DateFormNode = {
  type: "date";
  id: string;
  title: string;
};
export type LikertFormNode = {
  type: "likert";
  id: string;
  title: string;
  options: string[];
};
export type RankingFormNode = {
  type: "ranking";
  id: string;
  title: string;
  options: string[];
};
export type MatchingFormNode = {
  type: "matching";
  id: string;
  title: string;
  left: string[];
  right: string[];
};

export const FormContext = createContext<FormData | undefined>(undefined);

export function FormProvider({
  id,
  children,
}: PropsWithChildren<{ id: string }>) {
  const formData: FormData = {
    id: "form-123",
    title: "Comprehensive Student Feedback Survey",
    nodes: [
      {
        type: "input",
        id: "name",
        label: "Full Name",
        placeholder: "Enter your full name",
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
          "Medicine",
        ],
      },
      {
        type: "multiple-choice",
        id: "study-habits",
        title: "How do you prefer to study?",
        options: [
          "Alone in a quiet place",
          "In a group study session",
          "In the library",
          "With background music",
        ],
      },
      {
        type: "date",
        id: "enrollment-date",
        title: "When did you enroll in the university?",
      },
      {
        type: "likert",
        id: "satisfaction",
        title:
          "Rate your satisfaction with the following statement: 'The course materials were well-organized'",
        options: [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ],
      },
      {
        type: "ranking",
        id: "learning-preferences",
        title:
          "Rank the following learning methods from most to least preferred",
        options: [
          "Video lectures",
          "Reading textbooks",
          "Hands-on projects",
          "Group discussions",
        ],
      },
      {
        type: "matching",
        id: "concept-matching",
        title: "Match the programming concepts with their descriptions",
        left: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        right: [
          "Hiding implementation details",
          "Acquiring properties from parent class",
          "Many forms of a single entity",
          "Simplifying complex systems",
        ],
      },
    ],
  };

  return (
    <FormContext.Provider value={formData}>{children}</FormContext.Provider>
  );
}

export function useForm() {
  return useContext(FormContext);
}

export function useFormNode<T extends FormNode>(
  id: string,
  type?: T["type"],
): T | undefined {
  const form = useForm();
  if (!form) return undefined;

  const node = form.nodes.find((node) => node.id === id && node.type === type);
  return node as T | undefined;
}
