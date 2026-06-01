import type { AnalyzeResponse } from '../types/eda'
import { ChartGallery } from './ChartGallery'
import { InsightPanel } from './InsightPanel'
import { ReportSection } from './ReportSection'
import { SummaryCard } from './SummaryCard'
import { Presentation } from 'lucide-react'

interface Props {
  result: AnalyzeResponse
}

export function AnalysisReport({ result }: Props) {
  const { eda, analysis } = result

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="행 × 열"
          value={`${eda.structure.rows.toLocaleString()} × ${eda.structure.columns}`}
          sub={eda.filename}
        />
        <SummaryCard
          label="결측률"
          value={`${eda.missing.overall_missing_rate}%`}
          sub={`${eda.missing.columns_with_missing}개 컬럼`}
          accent="amber"
        />
        <SummaryCard
          label="수치형 / 범주형"
          value={`${eda.distributions.numeric_count} / ${eda.distributions.categorical_count}`}
          accent="emerald"
        />
        <SummaryCard
          label="IQR 이상치"
          value={eda.outliers.total_iqr_outliers.toLocaleString()}
          sub={`${eda.outliers.numeric_column_count}개 변수 분석`}
          accent="rose"
        />
      </div>

      <div className="space-y-6">
        <ReportSection id="structure" number={1} title="데이터 구조 분석">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2 pr-4">컬럼</th>
                  <th className="pb-2 pr-4">타입</th>
                  <th className="pb-2 pr-4">고유값</th>
                  <th className="pb-2">샘플</th>
                </tr>
              </thead>
              <tbody>
                {eda.structure.column_details.slice(0, 20).map((col) => (
                  <tr key={col.name} className="border-b border-slate-800/60">
                    <td className="py-2 pr-4 font-medium text-white">{col.name}</td>
                    <td className="py-2 pr-4 text-slate-400">{col.dtype}</td>
                    <td className="py-2 pr-4">{col.unique}</td>
                    <td className="py-2 text-slate-500">{col.sample_values.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            중복 행: {eda.structure.duplicate_rows.toLocaleString()} | 메모리:{' '}
            {eda.structure.memory_mb} MB
          </p>
        </ReportSection>

        <ReportSection id="missing" number={2} title="결측치 분석">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="전체 결측률" value={`${eda.missing.overall_missing_rate}%`} accent="amber" />
            <SummaryCard label="결측 컬럼" value={eda.missing.columns_with_missing} />
            <SummaryCard label="완전 행" value={eda.missing.complete_rows.toLocaleString()} accent="emerald" />
          </div>
          {eda.missing.by_column.filter((c) => c.missing_count > 0).length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="pb-2">컬럼</th>
                  <th className="pb-2">결측 수</th>
                  <th className="pb-2">결측률(%)</th>
                </tr>
              </thead>
              <tbody>
                {eda.missing.by_column
                  .filter((c) => c.missing_count > 0)
                  .slice(0, 15)
                  .map((col) => (
                    <tr key={col.column} className="border-t border-slate-800/60">
                      <td className="py-2">{col.column}</td>
                      <td className="py-2">{col.missing_count}</td>
                      <td className="py-2">{col.missing_rate}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-400">결측치가 없습니다.</p>
          )}
        </ReportSection>

        <ReportSection id="outliers" number={3} title="이상치 분석">
          <p className="mb-4 text-sm text-slate-400">IQR(1.5×) 및 Z-score(|z|&gt;3) 기준</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">컬럼</th>
                <th className="pb-2">IQR 이상치</th>
                <th className="pb-2">IQR 비율(%)</th>
                <th className="pb-2">Z-score 이상치</th>
              </tr>
            </thead>
            <tbody>
              {eda.outliers.columns_analyzed.slice(0, 15).map((item) => (
                <tr key={item.column} className="border-t border-slate-800/60">
                  <td className="py-2 font-medium">{item.column}</td>
                  <td className="py-2">{item.iqr.count}</td>
                  <td className="py-2">{item.iqr.rate}%</td>
                  <td className="py-2">{item.zscore.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        <ReportSection id="distributions" number={4} title="변수 분포 분석">
          <ChartGallery charts={eda.charts} />
          {eda.distributions.numeric_summary.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-2">변수</th>
                    <th className="pb-2">mean</th>
                    <th className="pb-2">std</th>
                    <th className="pb-2">min</th>
                    <th className="pb-2">max</th>
                    <th className="pb-2">skew</th>
                  </tr>
                </thead>
                <tbody>
                  {eda.distributions.numeric_summary.slice(0, 10).map((s) => (
                    <tr key={s.column} className="border-t border-slate-800/60">
                      <td className="py-2">{s.column}</td>
                      <td className="py-2">{s.mean?.toFixed(2)}</td>
                      <td className="py-2">{s.std?.toFixed(2)}</td>
                      <td className="py-2">{s.min?.toFixed(2)}</td>
                      <td className="py-2">{s.max?.toFixed(2)}</td>
                      <td className="py-2">{s.skewness?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportSection>

        <ReportSection id="correlation" number={5} title="상관관계 분석">
          {eda.correlation.available ? (
            <>
              <p className="mb-4 text-sm text-slate-400">상위 상관 쌍 (|r| 기준)</p>
              <div className="space-y-2">
                {eda.correlation.top_pairs?.slice(0, 10).map((pair) => (
                  <div
                    key={`${pair.x}-${pair.y}`}
                    className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2 text-sm"
                  >
                    <span>
                      {pair.x} ↔ {pair.y}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        Math.abs(pair.correlation) >= 0.7
                          ? 'text-rose-400'
                          : Math.abs(pair.correlation) >= 0.4
                            ? 'text-amber-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {pair.correlation.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-400">{eda.correlation.message}</p>
          )}
        </ReportSection>

        <ReportSection id="insights" number={6} title="주요 인사이트">
          <InsightPanel insights={analysis.insights} aiEnhanced={analysis.ai_enhanced} />
        </ReportSection>

        <ReportSection id="ml" number={7} title="머신러닝 적용 전략">
          {analysis.ml_strategy.ai_summary && (
            <p className="mb-4 rounded-lg bg-violet-950/30 p-4 text-sm text-violet-200">
              {analysis.ml_strategy.ai_summary}
            </p>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-indigo-300">전처리</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.ml_strategy.recommended_preprocessing.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-indigo-300">추천 모델</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.ml_strategy.recommended_models.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-indigo-300">평가 지표</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.ml_strategy.evaluation_metrics.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-indigo-300">다음 단계</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.ml_strategy.next_steps.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </ReportSection>

        <ReportSection id="ppt" number={8} title="PPT 보고서 초안">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <Presentation className="h-4 w-4" />
            8장 슬라이드 구성 · PPT 다운로드 가능
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {result.report.ppt_outline.map((slide) => (
              <div
                key={slide.number}
                className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
              >
                <p className="text-xs text-indigo-400">Slide {slide.number}</p>
                <h4 className="mt-1 font-semibold text-white">{slide.title}</h4>
                <ul className="mt-3 space-y-1 text-sm text-slate-400">
                  {slide.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ReportSection>
      </div>
    </>
  )
}
