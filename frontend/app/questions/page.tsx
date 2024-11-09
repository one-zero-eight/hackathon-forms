'use client';

import { useState } from 'react';
import { SelectQuestion } from '@/components/questions/SelectQuestion';
import { MultipleChoiceQuestion } from '@/components/questions/MultipleChoiceQuestion';
import { DateQuestion } from '@/components/questions/DateQuestion';
import { MatchingQuestion } from '@/components/questions/MatchingQuestion';
import { LikertQuestion } from '@/components/questions/LikertQuestion';
import { RankingQuestion } from '@/components/questions/RankingQuestion';

export default function QuestionsPage() {
  const [answers, setAnswers] = useState({
    select: '',
    multipleChoice: [] as string[],
    date: '',
    matching: {},
    likert: 0,
    ranking: ['JavaScript', 'Python', 'Java']
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Question Types Demo</h1>

      <SelectQuestion
        question="What is your favorite color?"
        options={['Red', 'Blue', 'Green', 'Yellow']}
        value={answers.select}
        onChange={(value) => setAnswers({ ...answers, select: value })}
      />

      <MultipleChoiceQuestion
        question="Which programming languages do you know?"
        options={['JavaScript', 'Python', 'Java', 'C++']}
        value={answers.multipleChoice}
        onChange={(value) => setAnswers({ ...answers, multipleChoice: value })}
      />

      <DateQuestion
        question="When did you start programming?"
        value={answers.date}
        onChange={(value) => setAnswers({ ...answers, date: value })}
      />

      <MatchingQuestion
        question="Match the language with its creator"
        items={[
          { left: 'JavaScript', right: 'Brendan Eich' },
          { left: 'Python', right: 'Guido van Rossum' },
          { left: 'Java', right: 'James Gosling' }
        ]}
        value={answers.matching}
        onChange={(value) => setAnswers({ ...answers, matching: value })}
      />

      <LikertQuestion
        question="I enjoy programming"
        value={answers.likert}
        onChange={(value) => setAnswers({ ...answers, likert: value })}
      />

      <RankingQuestion
        question="Rank these programming languages in order of preference"
        options={answers.ranking}
        value={answers.ranking}
        onChange={(value) => setAnswers({ ...answers, ranking: value })}
      />

      <pre className="mt-8 p-4 bg-gray-100 rounded-md">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
} 