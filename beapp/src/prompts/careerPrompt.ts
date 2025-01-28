// src/prompts/careerPrompt.ts
import { PromptTemplate } from "@langchain/core/prompts";

export const CAREER_PROMPT = new PromptTemplate({
  inputVariables: ["field", "jobRole", "currentLevel"],
  template: `
    Role: Expert Career Advisor specializing in {field}
    Task: Create a 12-week learning roadmap for {jobRole} role
    
    User Profile:
    - Field: {field}
    - Target Role: {jobRole}
    - Current Level: {currentLevel || 'not specified'}
    
    Requirements:
    1. Split into 4 phases (3 weeks each)
    2. For each phase:
       - Key concepts to master
       - Practical projects
       - Recommended resources (prioritize free)
       - Self-assessment checklist
    3. Include emerging trends in {field}
    4. Format in Markdown with headers
    
    Example Structure:
    ## Phase 1: Core Fundamentals (Weeks 1-3)
    ### Concepts
    - Concept 1: Brief explanation
    - Concept 2: Brief explanation
    
    ### Practical Work
    - Project 1: Small practice project
    - Project 2: Real-world scenario
    
    Output:`
});