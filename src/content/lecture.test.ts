import { describe, expect, it } from 'vitest';
import { LECTURE_CONTEXT_PAGES, LECTURE_LESSONS, LECTURE_SOURCE } from './lecture';
import { QUESTION_BANK } from './questions';
import { THEORY } from './theory';
import { ALL_SIMULATORS } from './modules';
import { materialize } from './questions/types';
import { gameReducer, createInitialState } from '../game/reducer';
import katex from 'katex';

describe('MBR source coverage',()=>{
  it('accounts for every PDF page and distinguishes non-teaching context',()=>{
    const covered=new Set([...LECTURE_CONTEXT_PAGES,...LECTURE_LESSONS.flatMap(l=>l.pages)]);
    expect([...covered].sort((a,b)=>a-b)).toEqual(Array.from({length:LECTURE_SOURCE.pages},(_,i)=>i+1));
    expect(new Set(LECTURE_LESSONS.map(l=>l.id)).size).toBe(LECTURE_LESSONS.length);
  });
  it('connects every lesson to a simulator, both language versions, theory and module questions',()=>{
    for(const l of LECTURE_LESSONS){
      expect(ALL_SIMULATORS).toContain(l.simulator);
      expect(QUESTION_BANK[l.module].some(q=>q.id===l.question.id)).toBe(true);
      for(const lang of ['de','ru'] as const){
        expect(l.text[lang].length).toBeGreaterThan(80);
        expect(l.experiment[lang].length).toBeGreaterThan(15);
        expect(THEORY[lang][l.module].some(s=>s.title.startsWith(l.title[lang]))).toBe(true);
        const q=materialize({source:l.question,seed:7,shuffleSeed:3},lang);
        expect(q.prompt.length).toBeGreaterThan(10); expect(q.explanation.length).toBeGreaterThan(20);
      }
    }
  });
  it('awards completion XP once without changing existing module progress',()=>{
    const initial=createInitialState();
    const first=gameReducer(initial,{type:'FLAG',flag:'lecture-dft',xp:15});
    const repeat=gameReducer(first,{type:'FLAG',flag:'lecture-dft',xp:15});
    expect(first.xp).toBe(15); expect(repeat.xp).toBe(15); expect(repeat.modules).toEqual(initial.modules);
  });
  it('renders every source-backed formula without KaTeX errors',()=>{
    for(const l of LECTURE_LESSONS) if(l.formula) {
      expect(()=>katex.renderToString(l.formula!,{throwOnError:true})).not.toThrow();
    }
  });
});
