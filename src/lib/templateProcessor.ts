// 模板变量处理工具
export function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return template;
  
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  }
  return result;
}

// 递归处理对象中的所有模板
export function processTemplateObject(obj: any, variables: Record<string, any>): any {
  if (typeof obj === 'string') {
    return replaceTemplateVariables(obj, variables);
  } else if (Array.isArray(obj)) {
    return obj.map(item => processTemplateObject(item, variables));
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = processTemplateObject(value, variables);
    }
    return result;
  }
  return obj;
}

// 从配置中提取全局变量并处理模板
export function processConfigWithGlobalVariables(config: any): any {
  if (!config.globalVariables) {
    return config;
  }
  
  // 创建一个包含所有变量的对象，包括处理后的 headerLogo
  const allVariables = { ...config.globalVariables };
  
  // 首先处理 headerLogo（如果它包含模板变量）
  if (config.headerLogo && typeof config.headerLogo === 'string') {
    allVariables.headerLogo = replaceTemplateVariables(config.headerLogo, config.globalVariables);
  }
  
  // 然后使用包含处理后 headerLogo 的变量对象处理整个配置
  return processTemplateObject(config, allVariables);
}
