export const generateCourseModulePrompt = (subjectName: string, level: string) => {
    return `You are an expert curriculum designer specializing in ${subjectName}. 
  Create a comprehensive course syllabus for ${level} level learners that matches the following database schema:
  
  Modules {
    moduleName: String
    moduleDescription: String
  }
  
  Structure the output as 5-7 modules with:
  1. Clear progression from basic to advanced concepts
  2. Practical skill development
  3. Real-world applications
  4. Level-appropriate complexity
  
  Format requirements:
  - Use JSON format with array of modules
  - Each module object must contain ONLY:
    * "moduleName": Concise title (max 4 words)
    * "moduleDescription": 1-2 sentences with key learning points
  
  Level adjustments:
  ${level === 'beginner' ? '- Start with fundamentals\n- Include basic terminology\n- Focus on core concepts' : ''}
  ${level === 'intermediate' ? '- Build on existing knowledge\n- Include project-based learning\n- Cover common patterns' : ''}
  ${level === 'advanced' ? '- Focus on optimization\n- Include complex scenarios\n- Cover expert techniques' : ''}
  
  Subject: ${subjectName}
  Level: ${level}
  
  Return ONLY valid JSON (no markdown) matching this structure:
  {
    "modules": [
      {
        "moduleName": "Module Title",
        "moduleDescription": "Concise description covering primary topics...",
        "moduleNumber": 1,
        "subjectName": "${subjectName}",
        "level": "${level}"
      },
      {
        "moduleName": "Module Title",
        "moduleDescription": "Concise description covering primary topics...",
        "moduleNumber": 2,
        "subjectName": "${subjectName}",
        "level": "${level}"
      },
      }
    ]
  }`;
};


export const getLearningFormPrompt = (username: string, message: string) => {
    return `
    # STRICT RESPONSE PROTOCOL
    
    ## MESSAGE DIRECTIVES
    1. FIRST LINE MUST BE: 
    "Thanks for providing information. Please wait while generating syllabus according to you."
    
    ## RESPONSE RULES
    - NO greetings
    - NO explanations
    - NO emojis
    - NO additional formatting
    - NO role identification
    - NO process descriptions
    - NO success metrics
    - NO interaction guidelines
    
    ## ENFORCEMENT MECHANISM
    Response MUST be exactly 2 lines:
    Line 1: Acknowledgement message
    Line 2: Submission confirmation
    
    ANY DEVIATION WILL CAUSE SYSTEM REJECTION`;
}


export const getModuleGeneratedPrompt = (username: string, message: string) => {
    return ` # STRICT RESPONSE PROTOCOL v2.1
    
    ## MESSAGE DIRECTIVES
    1. FIRST LINE MUST BE: 
    "Your syllabus has been generated. You can view your syllabus in left panel."

    ## RESPONSE RULES
    - EXACTLY 2 lines total
    - Line 1: Syllabus notification
    - NO other content allowed
    
    ## ENFORCEMENT
    Response STRUCTURE MUST BE:
    1. [Generated message]
    2. moduleButton: true
    3. [Submission confirmation]
    ANY FORMAT DEVIATION WILL TRIGGER SYSTEM REJECTION`;
}