import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EvalDashboardFeature } from './EvalDashboardFeature';
import { evalDashboardFeatureStateMock as mock } from './EvalDashboardFeature.mocks';
import { TurnTimeline } from '@/components/blocks/TurnTimeline';
import { ComparisonReport } from '@/components/blocks/ComparisonReport';
import { CandidateReview } from '@/components/composites/CandidateReview';

describe('the Evals page', () => {
  it('keeps the existing view switcher, with the new views only when their data is given', () => {
    const html = renderToStaticMarkup(<EvalDashboardFeature {...mock} />);
    expect(html).toContain('Golden Evals');
    expect(html).not.toContain('role="tablist"');
  });

  it('shows a session turn by turn: outcome, sampling, feedback and tool calls', () => {
    const html = renderToStaticMarkup(<TurnTimeline turns={mock.data!.turns!} />);
    expect(html).toContain('Turn 3e2b5816');
    expect(html).toContain('not sampled');
    expect(html).toContain('read_file');
    expect(html).toContain('1 👎');
  });

  it('says an incomplete comparison cannot support accepting a candidate', () => {
    const comparison = mock.data!.datasetRuns![0].comparison!;
    const html = renderToStaticMarkup(<ComparisonReport {...comparison} status="incomplete" problems={['Replay it_02 #2 is failed']} />);
    expect(html).toContain('cannot support accepting a candidate');
    expect(html).toContain('Replay it_02 #2 is failed');
  });

  it('shows the change made from a recommendation: its lifecycle and diff', () => {
    const c = mock.data!.recommendations[0].candidate!;
    const html = renderToStaticMarkup(<CandidateReview pack={c.pack} agent={c.agent} status={c.status} requirements={c.requirements} diff={c.diff} />);
    expect(html).toContain(`${c.pack} / ${c.agent}`);
    expect(html).toContain('ASM-BIZ- assumption');
  });
});
