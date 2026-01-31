import { EndSessionResponse } from '../services/dialogueService'
import './DialogueResult.css'

interface DialogueResultProps {
  result: EndSessionResponse
  onSubmitQuest: () => void
  onRetry: () => void
  onClose: () => void
}

function DialogueResult({ result, onSubmitQuest, onRetry, onClose }: DialogueResultProps) {
  const { session_summary, evaluation, passed, can_submit_quest } = result

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#48bb78'
    if (score >= 75) return '#4299e1'
    if (score >= 60) return '#ed8936'
    return '#f56565'
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}分${secs}秒`
  }

  return (
    <div className="dialogue-result">
      <div className="result-container">
        {/* 结果标题 */}
        <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
          <div className="result-icon">
            {passed ? '🎉' : '💪'}
          </div>
          <h2>{passed ? '恭喜完成对话！' : '继续加油！'}</h2>
          <p className="result-subtitle">
            {passed ? '你的表现非常出色' : '再试一次，你会做得更好'}
          </p>
        </div>

        {/* 总分 */}
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: getScoreColor(evaluation.overall_score) }}>
            <span className="score-value" style={{ color: getScoreColor(evaluation.overall_score) }}>
              {evaluation.overall_score}
            </span>
            <span className="score-label">总分</span>
          </div>
        </div>

        {/* 详细评分 */}
        <div className="score-breakdown">
          <h3>详细评分</h3>
          <div className="score-items">
            <div className="score-item">
              <div className="score-item-header">
                <span className="score-item-label">语法</span>
                <span className="score-item-value">{evaluation.grammar_score}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${evaluation.grammar_score}%`,
                    background: getScoreColor(evaluation.grammar_score),
                  }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-item-header">
                <span className="score-item-label">流畅度</span>
                <span className="score-item-value">{evaluation.fluency_score}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${evaluation.fluency_score}%`,
                    background: getScoreColor(evaluation.fluency_score),
                  }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-item-header">
                <span className="score-item-label">完整度</span>
                <span className="score-item-value">{evaluation.completeness_score}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${evaluation.completeness_score}%`,
                    background: getScoreColor(evaluation.completeness_score),
                  }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-item-header">
                <span className="score-item-label">发音</span>
                <span className="score-item-value">{evaluation.pronunciation_score}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${evaluation.pronunciation_score}%`,
                    background: getScoreColor(evaluation.pronunciation_score),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 会话统计 */}
        <div className="session-stats">
          <div className="stat-item">
            <span className="stat-label">对话轮数</span>
            <span className="stat-value">{session_summary.total_turns}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">用时</span>
            <span className="stat-value">{formatDuration(session_summary.duration_seconds)}</span>
          </div>
        </div>

        {/* 优点 */}
        {evaluation.strengths.length > 0 && (
          <div className="feedback-section strengths">
            <h3>✨ 你的优点</h3>
            <ul>
              {evaluation.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 改进建议 */}
        {evaluation.improvements.length > 0 && (
          <div className="feedback-section improvements">
            <h3>📈 改进建议</h3>
            <ul>
              {evaluation.improvements.map((improvement, idx) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 反馈 */}
        {evaluation.feedback.length > 0 && (
          <div className="feedback-section general">
            <h3>💬 总体反馈</h3>
            <ul>
              {evaluation.feedback.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="result-actions">
          {can_submit_quest && passed && (
            <button onClick={onSubmitQuest} className="btn btn-primary btn-large">
              提交任务
            </button>
          )}
          {!passed && (
            <button onClick={onRetry} className="btn btn-primary btn-large">
              重新尝试
            </button>
          )}
          <button onClick={onClose} className="btn btn-secondary btn-large">
            返回任务列表
          </button>
        </div>
      </div>
    </div>
  )
}

export default DialogueResult
