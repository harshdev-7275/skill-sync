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
        "moduleDescription": "Concise description covering primary topics..."
      }
    ]
  }`;
  };