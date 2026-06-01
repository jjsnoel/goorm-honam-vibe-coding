export interface ColumnDetail {
  name: string
  dtype: string
  non_null: number
  unique: number
  sample_values: string[]
}

export interface StructureAnalysis {
  rows: number
  columns: number
  memory_mb: number
  duplicate_rows: number
  column_details: ColumnDetail[]
  preview: Record<string, string>[]
}

export interface MissingColumn {
  column: string
  missing_count: number
  missing_rate: number
}

export interface MissingAnalysis {
  total_missing_cells: number
  total_cells: number
  overall_missing_rate: number
  columns_with_missing: number
  complete_rows: number
  by_column: MissingColumn[]
}

export interface OutlierColumn {
  column: string
  iqr: { count: number; rate: number; lower: number | null; upper: number | null }
  zscore: { count: number; rate: number }
}

export interface OutlierAnalysis {
  numeric_column_count: number
  columns_analyzed: OutlierColumn[]
  total_iqr_outliers: number
  high_outlier_columns: string[]
}

export interface NumericStat {
  column: string
  count: number
  mean: number | null
  std: number | null
  min: number | null
  '25%': number | null
  '50%': number | null
  '75%': number | null
  max: number | null
  skewness: number | null
}

export interface CategoricalStat {
  column: string
  unique: number
  top_values: { value: string; count: number }[]
}

export interface DistributionAnalysis {
  numeric_summary: NumericStat[]
  categorical_summary: CategoricalStat[]
  numeric_count: number
  categorical_count: number
}

export interface CorrelationPair {
  x: string
  y: string
  correlation: number
}

export interface CorrelationAnalysis {
  available: boolean
  message?: string
  column_count?: number
  top_pairs?: CorrelationPair[]
  strong_correlations?: CorrelationPair[]
  moderate_correlations?: CorrelationPair[]
  matrix?: Record<string, Record<string, number>>
}

export interface ChartItem {
  id: string
  title: string
  image: string
}

export interface MLStrategy {
  recommended_preprocessing: string[]
  recommended_models: string[]
  validation_strategy: string
  evaluation_metrics: string[]
  feature_engineering: string[]
  next_steps: string[]
  ai_summary?: string
}

export interface PPTSlide {
  number: number
  title: string
  bullets: string[]
}

export interface AnalysisResult {
  insights: string[]
  ml_strategy: MLStrategy
  ai_enhanced: boolean
}

export interface EdaResult {
  filename: string
  structure: StructureAnalysis
  missing: MissingAnalysis
  outliers: OutlierAnalysis
  distributions: DistributionAnalysis
  correlation: CorrelationAnalysis
  charts: ChartItem[]
}

export interface AnalyzeResponse {
  filename: string
  eda: EdaResult
  analysis: AnalysisResult
  report: {
    markdown: string
    ppt_outline: PPTSlide[]
  }
}

export interface MultiAnalyzeResponse {
  count: number
  results: AnalyzeResponse[]
  errors?: string[]
  /** Present when a single file was uploaded (backward compat) */
  filename?: string
  eda?: EdaResult
  analysis?: AnalysisResult
  report?: AnalyzeResponse['report']
}
