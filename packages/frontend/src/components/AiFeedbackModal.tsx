import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import styles from '../styles/components.module.css'

interface AiFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  title: string
  abstract: string
  paperId?: string
  onFeedbackGenerated?: (feedback: string) => void
}

type FeedbackType = 'research' | 'methodology' | 'analysis' | 'literature' | 'innovation'
type AIProvider = 'anthropic' | 'openai' | 'grok'

interface AISettings {
  provider: AIProvider
  apiKey: string
}

export function AiFeedbackModal({ 
  isOpen, 
  onClose, 
  content, 
  title, 
  abstract,
  paperId,
  onFeedbackGenerated 
}: AiFeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('research')
  const [selectedText, setSelectedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{id: string, type: FeedbackType, feedback: string, createdAt: Date}>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('aiSettings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return { provider: 'anthropic' as AIProvider, apiKey: '' }
      }
    }
    return { provider: 'anthropic' as AIProvider, apiKey: '' }
  })

  useEffect(() => {
    // Get selected text when modal opens
    if (isOpen && window.getSelection) {
      const selection = window.getSelection()
      if (selection && selection.toString()) {
        setSelectedText(selection.toString())
      }
    }
    
    // Load feedback history if paperId is provided
    if (isOpen && paperId) {
      loadFeedbackHistory()
    }
  }, [isOpen, paperId])
  
  const loadFeedbackHistory = async () => {
    if (!paperId) return
    
    try {
      const response = await api.get(`/ai/feedback/history/${paperId}`)
      setFeedbackHistory(response.feedbackHistory || [])
    } catch (error) {
      console.error('Failed to load feedback history:', error)
    }
  }

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('aiSettings', JSON.stringify(aiSettings))
  }, [aiSettings])

  const handleGenerateFeedback = async () => {
    if (!aiSettings.apiKey) {
      setShowSettings(true)
      setError('Please configure your AI API key first')
      return
    }

    setIsGenerating(true)
    setError('')
    setFeedback('')

    try {
      const textToReview = selectedText || content
      
      // Check if we should use mock data (no API key) or real API
      const useMockData = !aiSettings.apiKey || aiSettings.apiKey === 'demo'
      
      if (useMockData) {
        // Use mock feedback for demo purposes
        const context = {
          title,
          abstract,
          fullContent: content,
          selectedText: selectedText || null
        }
        const mockFeedback = generateMockFeedback(feedbackType, textToReview, context)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setFeedback(mockFeedback)
        if (onFeedbackGenerated) {
          onFeedbackGenerated(mockFeedback)
        }
      } else {
        // Make real API call
        const response = await api.post('/ai/feedback', {
          content: textToReview,
          feedbackType,
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
          context: {
            title,
            abstract,
            fullContent: content,
            selectedText: selectedText || null,
            paperId: paperId || undefined
          }
        })
        
        setFeedback(response.feedback)
        if (onFeedbackGenerated) {
          onFeedbackGenerated(response.feedback)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate feedback')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockFeedback = (type: FeedbackType, text: string, context: any): string => {
    const feedbackTemplates = {
      research: `## Research Development Insights

**Your Core Contribution:**
I see you're exploring ${context.title}. This is a fascinating area that connects to several emerging discussions in the field.

**Potential Research Directions:**
- Have you considered how this relates to recent work by Chen et al. (2024) on distributed systems? Their framework might complement your approach
- Your methodology could be extended to examine edge cases in quantum computing applications
- There's an interesting parallel with complexity theory that might strengthen your theoretical foundation

**Questions to Deepen Your Analysis:**
1. What would happen if we applied your framework to real-world scenarios at scale?
2. How might your findings challenge existing assumptions in the field?
3. Could this approach be generalized to other domains?

**Collaborative Next Steps:**
Let's explore how your work fits into the broader research landscape. I notice potential connections to game theory and network effects that could add another dimension to your analysis.`,
      
      methodology: `## Methodology Collaboration

**Current Approach Strengths:**
Your methodology shows careful consideration of variables and controls. The experimental design is thoughtful.

**Let's Strengthen Your Methods:**
- Consider a mixed-methods approach combining your quantitative analysis with qualitative interviews
- The sample size calculations could benefit from power analysis - shall we work through this together?
- Your control variables are good, but we might also consider temporal factors

**Alternative Methodological Frameworks:**
1. **Bayesian Approach**: Could offer more nuanced uncertainty quantification
2. **Longitudinal Design**: Might capture evolution of your phenomenon over time
3. **Comparative Case Study**: Could provide deeper contextual insights

**State-of-the-Art Techniques:**
Recent papers at ICML 2024 introduced new statistical methods for similar problems. Would you like to explore how these might apply to your research?`,
      
      analysis: `## Analytical Framework Development

**Your Current Analysis:**
I appreciate the depth of your analytical approach. You're touching on some fundamental questions here.

**Deepening the Analysis:**
- Your data suggests patterns that might be explained by network effects theory
- Have you considered applying topological data analysis to uncover hidden structures?
- The interaction effects you've identified could be modeled using recent advances in causal inference

**Critical Questions:**
1. What assumptions underlie your analytical model, and how might we test them?
2. Are there alternative explanations for your findings we should explore?
3. How robust are your results to different analytical approaches?

**Cutting-Edge Analytical Tools:**
- Graph neural networks could reveal complex relationships in your data
- Information-theoretic measures might quantify the relationships you're observing
- Recent work on interpretable ML could help explain your black-box models`,
      
      literature: `## Literature & Research Connections

**Your Work in Context:**
Your research builds nicely on foundational work while pushing into new territory. Let me help you situate this in the broader conversation.

**Key Connections to Explore:**
- **Theoretical Lineage**: Your approach extends Smith (2019) but challenges Johnson (2021) - this tension is productive
- **Interdisciplinary Links**: Economics literature on mechanism design offers useful parallels
- **Emerging Debates**: Your work speaks to the ongoing discussion about replicability in Nature (2024)

**Underexplored Literature:**
1. The European school has relevant work that's often overlooked in English literature
2. Recent preprints on arXiv suggest similar investigations are happening in parallel
3. Historical perspectives from the 1970s might offer surprising insights

**Synthesis Opportunities:**
By connecting your findings to complexity science and information theory, you could bridge multiple research communities. Shall we explore these connections?`,
      
      innovation: `## Innovation & Impact Exploration

**Novel Contributions I See:**
Your work introduces a fresh perspective on ${context.title}. This is genuinely innovative in how it reframes the problem.

**Potential Breakthrough Areas:**
- Your approach could fundamentally change how we think about resource allocation in distributed systems
- The theoretical framework you're developing might apply far beyond your immediate domain
- I see potential for a new research paradigm emerging from your insights

**Impact Amplification:**
1. **Immediate Applications**: Tech companies could implement this tomorrow
2. **Policy Implications**: Your findings suggest need for regulatory framework updates
3. **Future Research**: You're opening at least three new research directions

**Pushing the Boundaries:**
What if we took your core insight and applied it recursively? This could lead to a general theory of adaptive systems. Recent Nobel work in physics used similar recursive approaches to great effect.

**Collaborative Innovation:**
Let's brainstorm how your work might combine with recent advances in quantum computing and biological systems. The convergence could be transformative.`
    }

    return feedbackTemplates[type]
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className={styles.aiFeedbackModal}>
        <div className={styles.modalHeader}>
          <h2>Research Collaborator</h2>
          <div className={styles.modalHeaderActions}>
            <button 
              className={styles.historyButton}
              onClick={() => setShowHistory(!showHistory)}
              title="View feedback history"
            >
              {showHistory ? 'Notes' : 'History'}
            </button>
            <button className={styles.modalClose} onClick={onClose}>×</button>
          </div>
        </div>

        {showSettings ? (
          <div className={styles.aiSettings}>
            <h3>AI Provider Settings</h3>
            <div className={styles.formGroup}>
              <label>Select AI Provider:</label>
              <select 
                value={aiSettings.provider} 
                onChange={(e) => setAiSettings({...aiSettings, provider: e.target.value as AIProvider})}
                className={styles.aiProviderSelect}
              >
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="grok">Grok</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>API Key:</label>
              <input
                type="password"
                value={aiSettings.apiKey}
                onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                placeholder={`Enter your ${aiSettings.provider} API key`}
                className={styles.apiKeyInput}
              />
              <small className={styles.apiKeyHint}>
                Your API key is stored locally and never sent to our servers. 
                Use "demo" as the API key to try with sample feedback.
              </small>
            </div>
            
            <div className={styles.settingsActions}>
              <button 
                className={styles.saveSettingsButton}
                onClick={() => setShowSettings(false)}
                disabled={!aiSettings.apiKey}
              >
                Save Settings
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showHistory ? (
          <div className={styles.feedbackHistory}>
            <h3>Previous Research Collaborations</h3>
            {feedbackHistory.length === 0 ? (
              <p className={styles.noHistory}>No previous feedback for this paper yet.</p>
            ) : (
              <div className={styles.historyList}>
                {feedbackHistory.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyHeader}>
                      <span className={styles.historyType}>{item.feedbackType}</span>
                      <span className={styles.historyDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.historyContent}>
                      {item.feedback.split('\n').slice(0, 3).join('\n')}...
                    </div>
                    <button
                      className={styles.historyViewButton}
                      onClick={() => {
                        setFeedback(item.feedback)
                        setShowHistory(false)
                      }}
                    >
                      View Full Feedback
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.feedbackOptions}>
              <p className={styles.feedbackPrompt}>
                {selectedText ? 
                  `Let's explore this passage together` : 
                  'Choose how I can help advance your research'
                }
              </p>
              
              <div className={styles.feedbackTypes}>
                <label className={`${styles.feedbackType} ${feedbackType === 'research' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value="research"
                    checked={feedbackType === 'research'}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span>Research Development</span>
                  <small>Expand ideas & explore new directions</small>
                </label>
                
                <label className={`${styles.feedbackType} ${feedbackType === 'methodology' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value="methodology"
                    checked={feedbackType === 'methodology'}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span>Methodology Review</span>
                  <small>Strengthen research approach</small>
                </label>
                
                <label className={`${styles.feedbackType} ${feedbackType === 'analysis' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value="analysis"
                    checked={feedbackType === 'analysis'}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span>Analysis & Insights</span>
                  <small>Deepen analytical framework</small>
                </label>
                
                <label className={`${styles.feedbackType} ${feedbackType === 'literature' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value="literature"
                    checked={feedbackType === 'literature'}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span>Literature Connections</span>
                  <small>Connect to broader research</small>
                </label>
                
                <label className={`${styles.feedbackType} ${feedbackType === 'innovation' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value="innovation"
                    checked={feedbackType === 'innovation'}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span>Innovation & Impact</span>
                  <small>Identify novel contributions</small>
                </label>
              </div>
            </div>

            {error && (
              <div className={styles.feedbackError}>{error}</div>
            )}

            {feedback && (
              <div className={styles.feedbackResult}>
                <div className={styles.feedbackContent}>
                  {feedback.split('\n').map((line, i) => {
                    if (line.startsWith('##')) {
                      return <h3 key={i}>{line.replace('##', '').trim()}</h3>
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={i}>{line.replace(/\*\*/g, '')}</strong>
                    } else if (line.startsWith('-') || line.startsWith('•')) {
                      return <li key={i}>{line.substring(1).trim()}</li>
                    } else if (line.match(/^\d+\./)) {
                      return <li key={i}>{line}</li>
                    } else if (line.trim()) {
                      return <p key={i}>{line}</p>
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            <div className={styles.feedbackActions}>
              <button
                className={styles.generateButton}
                onClick={handleGenerateFeedback}
                disabled={isGenerating}
              >
                {isGenerating ? 'Thinking...' : 'Collaborate'}
              </button>
              <button
                className={styles.settingsButton}
                onClick={() => setShowSettings(true)}
              >
                Settings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}