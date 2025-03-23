/**
 * 문제 파싱 관련 상수 및 유틸리티 함수
 */

export interface ParsedQuestion {
  questionTitle: string;
  choices: string[];
}

export const extractChoiceNumber = (choice: string): string => {
  const matches = choice.match(/^[①②③④⑤]/);
  if (!matches) { return ''; }
  return matches[0]; // 원문자 그대로 반환
};

export const parseContent = (content: string): ParsedQuestion => {
  // 1. 줄바꿈 문자 처리
  const normalizedText = content.replace(/\n\n|\n/g, '');

  // 2. 질문 제목과 선택지 분리
  const splitPattern = /(.*?)(①.*)/s;
  const initialMatch = normalizedText.match(splitPattern);

  if (!initialMatch) {
    // 매칭되는 패턴이 없을 경우 빈 배열로 초기화
    return { questionTitle: content.trim(), choices: [] };
  }

  const questionTitle = initialMatch[1].trim();
  const choicesText = initialMatch[2].trim();

  // 3. 선택지 추출
  const choicePattern = /(①|②|③|④|⑤)(.*?)(?=①|②|③|④|⑤|$)/gs;
  const choices: string[] = [];

  let match;
  while ((match = choicePattern.exec(choicesText)) !== null) {
    choices.push(`${match[1]} ${match[2].trim()}`);
  }

  return {
    questionTitle,
    choices,
  };
};
