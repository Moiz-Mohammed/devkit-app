'use client';

import React from 'react';
import type { QuestQuestion } from '@/types';

interface MCQQuestionProps {
  question: QuestQuestion;
  selectedAnswer: string;
  onSelect: (answer: string) => void;
  showFeedback: boolean;
}

export default function MCQQuestion({
  question,
  selectedAnswer,
  onSelect,
  showFeedback,
}: MCQQuestionProps) {
  const options = (question.options as string[]) || [];

  return (
    <div className="devkit-card p-6 space-y-6">
      <div className="space-y-2">
        <span className="badge badge-accent text-xs">Question {question.orderIndex}</span>
        <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          
          let optionStyles = 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--primary-border)] hover:bg-[var(--bg-hover)]';
          
          if (showFeedback) {
            if (isCorrect) {
              optionStyles = 'border-[var(--success)] bg-[var(--success-subtle)] text-[var(--text-success)]';
            } else if (isSelected && !isCorrect) {
              optionStyles = 'border-[var(--danger)] bg-[var(--danger-subtle)] text-[var(--text-danger)]';
            } else {
              optionStyles = 'border-[var(--border-subtle)] bg-[var(--bg-void)] opacity-40';
            }
          } else if (isSelected) {
            optionStyles = 'border-[var(--primary-500)] bg-[var(--primary-subtle)] shadow-[0_0_12px_var(--primary-glow)]';
          }

          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm md:text-base cursor-pointer ${optionStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-muted)] flex items-center justify-center text-xs font-mono font-bold text-[var(--text-muted)]">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium">{option}</span>
              </div>

              {showFeedback && isCorrect && (
                <span className="text-[var(--text-success)] font-bold text-sm">✓ Correct</span>
              )}
              {showFeedback && isSelected && !isCorrect && (
                <span className="text-[var(--text-danger)] font-bold text-sm">✗ Incorrect</span>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && question.explanation && (
        <div className="p-4 rounded-xl bg-[var(--bg-void)] border border-[var(--border-muted)] space-y-1 animate-fade-in">
          <p className="text-xs font-bold text-[var(--text-gold)]">💡 EXPLANATION</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
