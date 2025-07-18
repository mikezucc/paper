import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

interface FeedbackRequest {
  content: string
  feedbackType: 'research' | 'methodology' | 'analysis' | 'literature' | 'innovation'
  provider: 'openai' | 'anthropic' | 'grok'
  apiKey: string
  context: {
    title: string
    abstract: string
    fullContent: string
    selectedText: string | null
  }
}

export class AIService {
  async generateFeedback(request: FeedbackRequest): Promise<string> {
    const { content, feedbackType, provider, apiKey, context } = request
    
    const prompt = this.buildPrompt(feedbackType, content, context)
    
    switch (provider) {
      case 'anthropic':
        return this.generateAnthropicFeedback(apiKey, prompt)
      case 'openai':
        return this.generateOpenAIFeedback(apiKey, prompt)
      case 'grok':
        return this.generateGrokFeedback(apiKey, prompt)
      default:
        throw new Error(`Unsupported AI provider: ${provider}`)
    }
  }
  
  private buildPrompt(
    feedbackType: string,
    content: string,
    context: { title: string; abstract: string; fullContent: string; selectedText: string | null }
  ): string {
    const isSelectedText = context.selectedText !== null
    const textToReview = isSelectedText ? context.selectedText : content
    
    const baseContext = `
Paper Title: ${context.title}
Abstract: ${context.abstract}
${isSelectedText ? 'Reviewing selected text from the paper.' : 'Reviewing the full paper.'}

Text to review:
${textToReview}
`
    
    const prompts = {
      research: `${baseContext}

As a research collaborator, help develop and expand the ideas in this work. Consider:
1. How this research connects to current debates and emerging work in the field
2. Potential new research directions or hypotheses to explore
3. Methodological innovations that could strengthen the approach
4. Interdisciplinary connections that might enrich the analysis
5. Questions that could deepen the theoretical framework

Engage as a peer researcher offering constructive ideas for advancement. Format with markdown headers (##).`,

      methodology: `${baseContext}

Let's collaborate on strengthening the methodological approach. Focus on:
1. Current methodological strengths and how to build on them
2. Alternative or complementary methods from recent literature
3. Statistical or analytical techniques from cutting-edge research
4. Ways to increase robustness and validity
5. Novel approaches that could yield new insights

Suggest specific methodological enhancements with references to recent work. Format with markdown headers (##).`,

      analysis: `${baseContext}

Help deepen the analytical framework of this research. Consider:
1. Theoretical lenses that could reveal new dimensions
2. Advanced analytical techniques from related fields
3. Hidden assumptions to examine and test
4. Alternative interpretations of the findings
5. Ways to connect micro-level insights to macro-level theory

Collaborate on developing a richer analytical approach. Format with markdown headers (##).`,

      literature: `${baseContext}

Let's explore how this work connects to the broader scholarly conversation. Examine:
1. Key debates this research contributes to
2. Overlooked literature streams (including non-English sources)
3. Interdisciplinary connections that could enrich the work
4. Historical perspectives that provide context
5. Emerging work that suggests future directions

Help situate this research in the evolving scholarly landscape. Format with markdown headers (##).`,

      innovation: `${baseContext}

Explore the innovative potential and impact of this research. Consider:
1. Novel contributions and paradigm-shifting possibilities
2. Applications beyond the immediate domain
3. Connections to breakthrough work in adjacent fields
4. Potential for opening new research programs
5. Societal or practical implications

Collaborate on identifying and amplifying the transformative aspects. Format with markdown headers (##).`
    }
    
    return prompts[feedbackType as keyof typeof prompts] || prompts.research
  }
  
  private async generateAnthropicFeedback(apiKey: string, prompt: string): Promise<string> {
    const anthropic = new Anthropic({ apiKey })
    
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: 'You are a collaborative research partner and subject matter expert. Engage as a peer researcher who helps develop ideas, suggests connections to cutting-edge work, and explores new directions. Be intellectually rigorous while maintaining a collegial, exploratory tone. Reference specific recent papers, methodologies, and theoretical frameworks where relevant.'
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : ''
  }
  
  private async generateOpenAIFeedback(apiKey: string, prompt: string): Promise<string> {
    const openai = new OpenAI({ apiKey })
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a collaborative research partner and subject matter expert. Engage as a peer researcher who helps develop ideas, suggests connections to cutting-edge work, and explores new directions. Be intellectually rigorous while maintaining a collegial, exploratory tone. Reference specific recent papers, methodologies, and theoretical frameworks where relevant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
    
    return response.choices[0].message.content || ''
  }
  
  private async generateGrokFeedback(apiKey: string, prompt: string): Promise<string> {
    // Grok API implementation would go here
    // For now, throw an error as Grok API details are not available
    throw new Error('Grok API integration not yet implemented')
  }
}

export const aiService = new AIService()